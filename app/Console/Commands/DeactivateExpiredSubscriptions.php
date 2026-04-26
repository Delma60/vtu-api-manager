<?php

namespace App\Console\Commands;

use App\Models\Business;
use App\Models\Package;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DeactivateExpiredSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'subscriptions:deactivate-expired';

    /**
     * The console command description.
     */
    protected $description = 'Checks for active subscriptions that have passed their expiration date and downgrades them to the free tier.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // TODO:: #18 Memory Leaks in Cron Jobs - Use chunk() or chunkById() instead of get() to prevent memory exhaustion
        // TODO:: #19 Missing Free Tier Fallback - FIXED: Added validation and error handling for missing free tier
        // Find the default Free Tier package (lowest price active package)
        $freeTier = Package::where('is_active', true)->orderBy('price', 'asc')->first();

        if (!$freeTier) {
            Log::critical('Subscription Cron Failed: No Free Tier package found to downgrade users to.');
            $this->error('Critical Error: No Free Tier package found. Cannot proceed with subscription deactivation.');
            return;
        }

        // Use chunks to prevent memory exhaustion
        $count = 0;
        Business::where('subscription_status', 'active')
            ->whereNotNull('subscription_ends_at')
            ->where('subscription_ends_at', '<', now())
            ->chunkById(100, function ($businesses) use ($freeTier, &$count) {
                foreach ($businesses as $business) {
                    $business->update([
                        'package_id' => $freeTier->id,
                        'subscription_status' => 'past_due',
                        'subscription_ends_at' => null,
                    ]);
                    // Fire events or notifications here if needed
                    // TODO: Optional - Send an email/notification to the business owner here
                    // $business->owner->notify(new SubscriptionExpiredNotification());

                    $count++;
                }
            });

        $this->info("Successfully downgraded {$count} expired subscriptions.");
        Log::info("Subscription Cron: Downgraded {$count} expired subscriptions.");
    }
}