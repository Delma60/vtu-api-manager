<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
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
        Sanctum::getAccessTokenFromRequestUsing(function ($request) {
            $token = $request->bearerToken();
            
            if (!$token) {
                return null;
            }

            // Strip out your custom prefixes so Sanctum can validate the real hash
            if (str_starts_with($token, 'sk_test_')) {
                return substr($token, 8); // Remove "sk_test_"
            }

            if (str_starts_with($token, 'sk_live_')) {
                return substr($token, 8); // Remove "sk_live_"
            }

            return $token;
        });
    
        
    }
}

