<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait TenantEnvironmentScope
{
    protected static function booted()
    {
        static::addGlobalScope('environment', function (Builder $builder) {
            $environment = 'live'; // Default
            
            $request = request();
            $bearerToken = $request->bearerToken();

            // 1. Determine environment from API Token
            if ($bearerToken) {
                if (str_starts_with($bearerToken, 'sk_test_')) {
                    $environment = 'test';
                }
            } 
            // 2. Determine environment from Authenticated User Business Mode
            elseif (Auth::check() && Auth::user()->user_type !== 'admin') {
                $environment = Auth::user()->business?->mode ?? 'live';
            }

            $builder->where($builder->getQuery()->from . '.environment', $environment);
        });
    }
}