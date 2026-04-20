<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class SwitchEnvironmentDatabase
{
    public function handle(Request $request, Closure $next)
    {
        // Check if this is an API request with a bearer token
        $bearerToken = $request->bearerToken();
        
        if ($bearerToken) {
            // Determine connection based on token prefix
            if (str_starts_with($bearerToken, 'sk_test_')) {
                $testConnection = env('DB_CONNECTION') . '_test';
                Config::set('database.default', $testConnection);
                DB::setDefaultConnection($testConnection);
            } elseif (str_starts_with($bearerToken, 'sk_live_')) {
                // Ensure we're using the live connection
                $liveConnection = env('DB_CONNECTION');
                Config::set('database.default', $liveConnection);
                DB::setDefaultConnection($liveConnection);
            }
        } else {
            // For web requests, use the existing logic
            if (
                auth()->check() && 
                auth()->user()->user_type !== 'admin' && 
                auth()->user()->business?->mode === 'test'
            ) {
                $originalConnection = env('DB_CONNECTION');
                $testConnection = $originalConnection . '_test'; 
                Config::set('database.default', $testConnection);
                DB::setDefaultConnection($testConnection);
            }
        }

        return $next($request);
    }
}