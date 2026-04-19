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
        if (auth()->check() && auth()->user()->business?->mode === 'test') {
            // Swap the default connection to the test connection
            Config::set('database.default', env('DB_CONNECTION') . '_test');
            
            // Purge any existing connections to ensure a clean slate
            DB::purge(env('DB_CONNECTION') . '_test');
        }

        return $next($request);
    }
}