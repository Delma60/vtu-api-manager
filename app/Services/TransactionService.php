<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionService
{
    // initializing transaction for checkout
    public function initializeCheckout(User $user, array $data):Transaction{

    return Transaction::create(array_merge([
                'business_id' => $user->business_id ?? null,
                'user_id' => $user->id,
                'provider' => $data['provider'] ?? 'unknown',
                'status' => 'pending',
                'transaction_reference' => $data['transaction_reference'],
                'platform' => $data['platform'] ?? 'api',
                'transaction_type' => $data['transaction_type'],
                'account_or_phone' => $data['account_or_phone'],
                'amount' => $data['amount'],
                'discount_amount' => $data['discount_amount'] ?? 0.00,
                'service_fee' => $data['service_fee'] ?? 0.00,
                'quantity' => $data['quantity'] ?? 1,
                'receiver' => $data['receiver'] ?? $data['account_or_phone'],
                'meta' => $data['meta'] ?? $data,
            ], $data));
    }
    /**
     * Initialize a transaction and deduct the user's wallet securely.
     */

    public function initialize(User $user, array $data, ?string $platform = "api"): Transaction
    {
        return DB::transaction(function () use ($user, $data, $platform) {
            // Check if this is a test environment - skip wallet deduction
            $environment = request()->attributes->get('environment') ?? 'live';
            
            if ($environment !== 'test') {
                $wallet = $user->wallet()->lockForUpdate()->first();
    
                // Calculate exact amount to deduct
                $amountToDeduct = $data['amount'] - ($data['discount_amount'] ?? 0) + ($data['service_fee'] ?? 0);
    
                if (!$wallet || $wallet->balance < $amountToDeduct) {
                    throw new Exception('Insufficient wallet balance to complete this transaction.');
                }
                // Deduct the wallet
                $wallet->balance -= $amountToDeduct;
                $wallet->save();
            }

            // Create the pending transaction
            return Transaction::create([
                'business_id' => $user->business_id ?? null,
                'user_id' => $user->id,
                'provider' => $data['provider'] ?? 'unknown',
                'status' => 'pending',
                'transaction_reference' => $data['transaction_reference'],
                'platform' => $data['platform'] ?? 'api',
                'transaction_type' => $data['transaction_type'],
                'account_or_phone' => $data['account_or_phone'],
                'amount' => $data['amount'],
                'discount_amount' => $data['discount_amount'] ?? 0.00,
                'service_fee' => $data['service_fee'] ?? 0.00,
                'quantity' => $data['quantity'] ?? 1,
                'receiver' => $data['receiver'] ?? $data['account_or_phone'],
                'meta' => $data['meta'] ?? null,
            ]);
        });
    }

    /**
     * Mark transaction as successful.
     */
    public function markAsSuccessful(Transaction $transaction, array $response): Transaction
    {
        $transaction->update([
            'status' => 'success',
            'payment_reference' => $response['reference'] ?? $response['request-id'] ?? null,
            'response_message' => $response['message'] ?? 'Transaction completed successfully.',
            'completed_at' => now(),
            'token' => $response['token'] ?? null,
            'meta' => array_merge($transaction->meta ?? [], ['provider_response' => $response]),
        ]);

        return $transaction;
    }

    /**
     * Mark transaction as failed and securely refund the user.
     */
    public function markAsFailed(Transaction $transaction, string $reason, array $response = []): Transaction
    {
        return DB::transaction(function () use ($transaction, $reason, $response) {
            // Prevent double refunds
            if ($transaction->status === 'failed' || $transaction->status === 'refunded') {
                return $transaction;
            }

            $transaction->update([
                'status' => 'failed',
                'response_message' => $reason,
                'completed_at' => now(),
                'meta' => array_merge($transaction->meta ?? [], ['error_response' => $response]),
            ]);

            // Refund the wallet securely
            $wallet = $transaction->user->wallet()->lockForUpdate()->first();
            if ($wallet) {
                $amountToRefund = $transaction->amount - $transaction->discount_amount + $transaction->service_fee;
                $wallet->balance += $amountToRefund;
                $wallet->save();
            }

            return $transaction;
        });
    }
}