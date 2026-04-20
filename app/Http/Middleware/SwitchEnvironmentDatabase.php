<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class SwitchEnvironmentDatabase
{
    public function handle(Request $request, Closure $next)
    {
        $bearerToken = $request->bearerToken();
        
        // 1. API requests: Route based on token prefix (independent of user mode)
        if ($bearerToken) {
            if (str_starts_with($bearerToken, 'sk_test_')) {
                Config::set('database.default', env('DB_CONNECTION') . '_test');
            } elseif (str_starts_with($bearerToken, 'sk_live_')) {
                Config::set('database.default', env('DB_CONNECTION'));
            }
        } else {
            // 2. Web requests: Route based on authenticated user's business mode
            if (
                Auth::check() && 
                Auth::user()->user_type !== 'admin' && 
                Auth::user()->business?->mode === 'test'
            ) {
                Config::set('database.default', env('DB_CONNECTION') . '_test');
            }
        }

        return $next($request);
    }
}