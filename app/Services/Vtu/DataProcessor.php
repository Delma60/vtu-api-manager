<?php

namespace App\Services\Vtu;

use App\Models\User;
use App\Services\ProviderService;
use App\Services\TransactionService;
use Illuminate\Support\Facades\DB;

class DataProcessor
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

        // 2. Format & Send Request
        try {
            $formattedPayload = $provider->formatPayload('data', $payload);
            $response = $provider->sendRequest('data', $formattedPayload);

            if (isset($response['status']) && $response['status'] === 'success') {
                $this->transactionService->markAsSuccessful($transaction, $response);
                return $response;
            }

            $this->transactionService->markAsFailed($transaction, $response['message'] ?? 'Provider failed to process the request', $response);
            return $response;
        } catch (\Exception $e) {
            Log::error('Data Processing Error: ' . $e->getMessage(), ['payload' => $payload]);
            $this->transactionService->markAsFailed($transaction, 'An unexpected error occurred.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'An unexpected error occurred. Wallet refunded.'];
        }
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
