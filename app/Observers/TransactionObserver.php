<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Services\MetricsService;

class TransactionObserver
{
    protected array $finalStatuses = ['successful', 'failed', 'refunded'];

    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        if ($this->isFinalStatus($transaction->status)) {
            $this->recordMetrics($transaction);
        }
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        if (!$transaction->isDirty('status')) {
            return;
        }

        $oldStatus = $transaction->getOriginal('status');
        $newStatus = $transaction->status;

        if (!$this->isFinalStatus($newStatus)) {
            return;
        }

        if ($this->isFinalStatus($oldStatus)) {
            return;
        }

        $this->recordMetrics($transaction);
    }

    /**
     * Record metrics for the transaction
     */
    private function recordMetrics(Transaction $transaction): void
    {
        try {
            $metricsService = app(MetricsService::class);
            $metricsService->recordTransaction($transaction);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to record metrics for transaction', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function isFinalStatus(?string $status): bool
    {
        return in_array($status, $this->finalStatuses, true);
    }
}
