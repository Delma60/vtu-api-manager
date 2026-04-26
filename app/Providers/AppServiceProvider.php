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
        
        Transaction::observe(TransactionObserver::class);
        // TODO:: #20 Env() Calls Outside Config Files - env() returns null after config:cache, use config() instead
       if(str_contains(env("APP_URL"), "ngrok") ){
            URL::forceScheme('https');
        }
    }
}

