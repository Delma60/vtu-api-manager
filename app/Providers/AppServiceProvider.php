<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
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
            $token = trim($token);

            // Strip out your custom prefixes so Sanctum can validate the real hash
            if (str_starts_with($token, 'sk_test_')) {
                Log::info(['Bearer Token:' => $token, 'Stripped Token:' => substr($token, 8), 'Request Path' => $request->path()]);
                return substr($token, 8); 
            }

            if (str_starts_with($token, 'sk_live_')) {
                Log::info(['Bearer Token:' => $token, 'Stripped Token:' => substr($token, 8), 'Request Path' => $request->path()]);
                return substr($token, 8); // Remove "sk_live_"
            }



            return $token;
        });
    
        
    }
}

