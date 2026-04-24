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
        // Find all businesses whose subscription has expired but are still marked as active
        $expiredBusinesses = Business::where('subscription_status', 'active')
            ->whereNotNull('subscription_ends_at')
            ->where('subscription_ends_at', '<', now())
            ->get();

        if ($expiredBusinesses->isEmpty()) {
            $this->info('No expired subscriptions found today.');
            return;
        }

        // Find the default Free Tier package (lowest price active package)
        $freeTier = Package::where('is_active', true)->orderBy('price', 'asc')->first();

        $count = 0;

        foreach ($expiredBusinesses as $business) {
            $business->update([
                'package_id' => $freeTier?->id,
                'subscription_status' => 'past_due', // Or 'active' if you just consider the free tier normal
                'subscription_ends_at' => null, // Free tier doesn't expire
            ]);

            // TODO: Optional - Send an email/notification to the business owner here
            // $business->owner->notify(new SubscriptionExpiredNotification());

            $count++;
        }

        $this->info("Successfully downgraded {$count} expired subscriptions.");
        Log::info("Subscription Cron: Downgraded {$count} expired subscriptions.");
    }
}