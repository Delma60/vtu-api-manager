<?php

namespace App\Services\Vtu;

use App\Models\User;
use App\Services\ProviderService;
use App\Services\TransactionService;
use Illuminate\Support\Facades\DB;

class CableProcessor
{
   public function __construct(protected TransactionService $transactionService) {}

    public function process(User $user, array $payload): array
    {
        $provider = ProviderService::getProviderInstance($payload['provider']);
        $txRef = $payload['tx_ref'] ?? 'VTM_' . uniqid();
        $payload['tx_ref'] = $txRef;

        // 1. Initialize Transaction and deduct wallet
        try {
            $transaction = $this->transactionService->initialize($user, [
                'transaction_reference' => $txRef,
                'provider' => $payload['provider'],
                'platform' => $payload['platform'] ?? 'api',
                'transaction_type' => 'cable',
                'account_or_phone' => $payload['iuc'],
                'amount' => $payload['amount'],
                'discount_amount' => $payload['discount_amount'] ?? 0.00,
                'meta' => [
                    'cable_plan_id' => $payload['cable_plan'] ?? null,
                    'cable_network' => $payload['cable_network'] ?? $payload['cable'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        // 2. Format & Send Request
        try {
            $formattedPayload = $provider->formatPayload('cable', $payload);
            $response = $provider->sendRequest('cable', $formattedPayload);

            if (isset($response['status']) && $response['status'] === 'success') {
                $this->transactionService->markAsSuccessful($transaction, $response);
                return $response;
            }

            $this->transactionService->markAsFailed($transaction, $response['message'] ?? 'Provider failed to process the request', $response);
            return $response;
        } catch (\Exception $e) {
            Log::error('Cable Processing Error: ' . $e->getMessage(), ['payload' => $payload]);
            $this->transactionService->markAsFailed($transaction, 'An unexpected error occurred.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'An unexpected error occurred. Wallet refunded.'];
        }
    }

    public function getCablePlans($cable_network)
    {
        // Implement logic to retrieve data plans based on the network ID
            $provider = ProviderService::getProviderInstance('cable');
            if (!$provider) {
                return [
                    'status' => 'error',
                    'message' => 'No cable provider configured',
                ];
            }
            $response = $provider->plans([ 
                'cable_network' => $cable_network,
                'type' => 'cable'
            ]);
            if (($response['status'] ?? '') !== 'success') {
                return [
                    'status' => 'error',
                    'message' => $response['message'] ?? 'Failed to retrieve cable plans',
                    'data' => null,
                ];
            }
            return $response;

    }
}
