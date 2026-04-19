<?php

namespace App\Services\Vtu;

use App\Models\User;
use App\Services\ProviderService;
use App\Services\TransactionService;
use Illuminate\Support\Facades\Log;

class AirtimeProcessor
{
    public function __construct(protected TransactionService $transactionService) {}

    public function process(User $user, array $payload): array
    {
        $provider = ProviderService::getProviderInstance('airtime');
        $txRef = $payload['tx_ref'] ?? 'VTM_' . uniqid();
        $payload['tx_ref'] = $txRef; 

        // 1. Initialize Transaction and deduct wallet
        try {
            $transaction = $this->transactionService->initialize($user, [
                'transaction_reference' => $txRef,
                'provider' => $payload['provider'],
                'platform' => $payload['platform'] ?? 'api',
                'transaction_type' => 'airtime',
                'account_or_phone' => $payload['phone'],
                'amount' => $payload['amount'],
                'discount_amount' => $payload['discount_amount'] ?? 0.00,
            ]);
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        // 2. Format & Send Request
        try {
            $formattedPayload = $provider->formatPayload('airtime', $payload);
            $response = $provider->sendRequest('airtime', $formattedPayload);

            if (isset($response['status']) && $response['status'] === 'success') {
                $this->transactionService->markAsSuccessful($transaction, $response);
                return $response;
            }

            $this->transactionService->markAsFailed($transaction, $response['message'] ?? 'Provider failed to process the request', $response);
            return $response;
        } catch (\Exception $e) {
            Log::error('Airtime Processing Error: ' . $e->getMessage(), ['payload' => $payload]);
            $this->transactionService->markAsFailed($transaction, 'An unexpected error occurred.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'An unexpected error occurred. Wallet refunded.'];
        }
    }
}