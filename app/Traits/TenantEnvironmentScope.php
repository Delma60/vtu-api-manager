<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait TenantEnvironmentScope
{
    protected static function bootTenantEnvironmentScope()
    {
        // 1. Intercept CREATION (Inserts)
        static::creating(function ($model) {

            // Automatically attach the current environment if not explicitly provided
            if (empty($model->environment)) {
                $model->environment = self::determineCurrentEnvironment();
            }
        });
        
        // 2. Intercept READS (Selects)
        static::addGlobalScope('environment', function (Builder $builder) {
            Log::info("Applying TenantEnvironmentScope for " . $builder->getModel()->getTable());
            $builder->where(
                $builder->getQuery()->from . '.environment', 
                self::determineCurrentEnvironment()
            );
        });
    }

    /**
     * Centralized logic to figure out if we are in live or test mode.
     */
    protected static function determineCurrentEnvironment(): string
    {
        $request = request();
        $bearerToken = $request->bearerToken();

        // 1. Determine environment from API Token
        if ($bearerToken) {
            return str_starts_with($bearerToken, 'sk_test_') ? 'test' : 'live';
        } 
        
        // 2. Determine environment from Authenticated User Business Mode
        if (Auth::check() && Auth::user()->user_type !== 'admin') {
            return Auth::user()->business?->mode ?? 'live';
        }

        // Default fallback
        return 'live';
    }
}