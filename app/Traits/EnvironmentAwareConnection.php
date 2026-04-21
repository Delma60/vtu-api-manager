<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait EnvironmentAwareConnection
{
    public function getConnectionName()
    {
        if (Auth::check() && Auth::user()->business?->mode === 'test') {
            return 'mysql_test';
        }
        // for api too we can check the token's environment if available
        $activeToken = Auth::user()?->tokens()->latest()->first();
        Log::info($activeToken);
        if ($activeToken) {
            Log::info('Active token environment: ' . $activeToken->environment);
            if ($activeToken->environment === 'test') {
                return 'mysql_test';
            }
        }

        return config('database.default');
    }
}
