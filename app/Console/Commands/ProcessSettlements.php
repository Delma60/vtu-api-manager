<?php

namespace App\Console\Commands;

use App\Models\Settlement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessSettlements extends Command
{
    protected $signature = 'settlements:process';
    protected $description = 'Process pending settlements and move them to available balance';

    public function handle()
    {
        $this->info('Starting settlement processing...');

        // Fetch settlements that are due and haven't been settled yet
        $dueSettlements = Settlement::where('is_settled', false)
            ->where('settles_at', '<=', now())
            ->with('wallet') // Eager load the wallet
            ->get();

        if ($dueSettlements->isEmpty()) {
            $this->info('No settlements due at this time.');
            return;
        }

        foreach ($dueSettlements as $settlement) {
            DB::beginTransaction();
            try {
                $wallet = $settlement->wallet;

                // Move from pending to available
                $wallet->decrement('pending_balance', $settlement->amount);
                $wallet->increment('balance', $settlement->amount);

                // Mark as settled
                $settlement->update(['is_settled' => true]);

                DB::commit();
                $this->info("Processed settlement {$settlement->reference} for Wallet {$wallet->id}");

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Failed to process settlement {$settlement->reference}: " . $e->getMessage());
                $this->error("Failed to process settlement {$settlement->reference}");
            }
        }

        $this->info('Settlement processing completed.');
    }
}