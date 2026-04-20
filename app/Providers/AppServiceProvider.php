<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use App\Models\Transaction;
use App\Observers\TransactionObserver;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        // Register model observers
        Transaction::observe(TransactionObserver::class);
        Sanctum::getAccessTokenFromRequestUsing(function ($request) {
            $token = $request->bearerToken();
            Log::info('Attempting to extract access token from request');

            if (!$token) {
                return null;
            }

            $token = trim($token);
            Log::info($token);

            // Strip out custom prefixes so Sanctum can validate the real token
            if (str_starts_with($token, 'sk_test_')) {
                $stripped = substr($token, 8);
                Log::debug('Stripped test prefix token', [
                    'original_length' => strlen($token),
                    'stripped_length' => strlen($stripped),
                    'stripped_token' =>  $stripped,
                    ]);
                return $stripped;
            }

            if (str_starts_with($token, 'sk_live_')) {
                $stripped = substr($token, 8);
                // Log::debug('Stripped live prefix token', ['original_length' => strlen($token), 'stripped_length' => strlen($stripped)]);
                return $stripped;
            }

            // No custom prefix, return token as-is
            return $token;
        });
    }
}

