<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait EnvironmentAwareConnection
{
    public function getConnectionName()
    {
        if (Auth::check() && Auth::user()->business?->mode === 'test') {
            return 'mysql_test';
        }

        return config('database.default');
    }
}
