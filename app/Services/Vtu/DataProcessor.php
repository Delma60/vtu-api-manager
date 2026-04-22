<?php

namespace App\Services\Vtu;

use App\Models\User;
use App\Services\ProviderService;
use App\Services\TransactionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DataProcessor
{
    public function __construct(protected TransactionService $transactionService) {}

    public function process(User $user, array $payload): array
    {
        // $provider = ProviderService::getProviderInstance("data");
        $txRef = $payload['tx_ref'] ?? 'VTM_' . uniqid();
        $payload['tx_ref'] = $txRef;

        // 1. Initialize Transaction and deduct wallet
        try {
            $transaction = $this->transactionService->initialize($user, [
                'transaction_reference' => $txRef,
                'provider' => $payload['provider'],
                'platform' => $payload['platform'] ?? 'api',
                'transaction_type' => 'data',
                'account_or_phone' => $payload['phone'],
                'amount' => $payload['amount'],
                'discount_amount' => $payload['discount_amount'] ?? 0.00,
                'meta' => [
                    'data_plan_id' => $payload['data_plan'] ?? null,
                    'network' => $payload['network'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        $providersToTry = ProviderService::getFallbackProviders('data', $payload['network_type_id'] ?? null);

        // If no providers are configured at all
        if (empty($providersToTry)) {
            $this->transactionService->markAsFailed($transaction, 'No active providers available for this service.', []);
            return ['status' => 'error', 'message' => 'No active providers available. Wallet refunded.'];
        }

        $lastResponse = null;


        // 2. Format & Send Request
        foreach ($providersToTry as $providerInstance) {
            try {
                // Update the transaction record to reflect the current provider being attempted
                $transaction->update(['provider_id' => $providerInstance->getProviderModel()->id]);

                // Format the payload specifically for THIS provider
                $formattedPayload = $providerInstance->formatPayload('data', $payload);
                // Attempt the transaction
                $response = $providerInstance->sendRequest('data', $formattedPayload);
                $lastResponse = $response;

                // If successful, mark it and break out of the loop!
                if (isset($response['status']) && $response['status'] === 'success') {
                    $this->transactionService->markAsSuccessful($transaction, $response);
                    return $response; // Return early on success
                }

                // If we get here, the current provider failed. 
                // Log it, and the loop will naturally proceed to the NEXT provider.
                Log::warning("Provider Failover: " . $providerInstance->getProviderModel()->name . " failed for TX: " . $txRef, ['response' => $response]);

            } catch (\Exception $e) {
                // Catch timeouts or HTTP errors for the current provider
                Log::error("Provider Exception during Failover: " . $providerInstance->getProviderModel()->name . " - " . $e->getMessage());
                $lastResponse = ['status' => 'error', 'message' => $e->getMessage()];
                // Loop continues to the next provider
            }

        }
        $errorMessage = $lastResponse['message'] ?? 'All available providers failed to process the request';
    
        $this->transactionService->markAsFailed($transaction, $errorMessage, $lastResponse ?? []);
        
        return [
            'status' => 'error', 
            'message' => $errorMessage
        ];
    }

    public function getDataPlans($networkId)
    {
        // Implement logic to retrieve data plans based on the network ID
            $provider = ProviderService::getProviderInstance('data');
            if (!$provider) {
                return [
                    'status' => 'error',
                    'message' => 'No data provider configured',
                ];
            }
            $response = $provider->plans([ 
                'network_id' => $networkId,
                'type' => 'data'
            ]);
            if (($response['status'] ?? '') !== 'success') {
                return [
                    'status' => 'error',
                    'message' => $response['message'] ?? 'Failed to retrieve data plans',
                    'data' => null,
                ];
            }
            return $response;

    }
}
