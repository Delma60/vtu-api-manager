<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait EnvironmentAwareConnection
{
    public function getConnectionName()
    {
        // Log::info('Determining connection for user', [
        //     'request' => request()->user(),
        //     'user_id' => Auth::id(),
        //     'user_type' => Auth::user()?->user_type,
        //     'business_mode' => Auth::user()?->business?->mode,
        // ]);

        if (Auth::check() && Auth::user()->business?->mode === 'test') {
            return 'mysql_test';
        }
        // for api too we can check the token's environment if available
        $activeToken = request()->user()?->tokens()->latest()->first();
        if ($activeToken) {
            if ($activeToken->environment === 'test') {
                return 'mysql_test';
            }
        }

        return config('database.default');
    }
}
