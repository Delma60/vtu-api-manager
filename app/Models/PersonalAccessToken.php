<?php

namespace App\Models;

use App\Traits\EnvironmentAwareConnection;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use EnvironmentAwareConnection;

    /**
     * Override to use the current database connection set by middleware,
     * not the authenticated user's business mode (which is null during token lookup).
     */
    public function getConnectionName()
    {
        // If a user is authenticated, use their business mode
        if (Auth::check() && Auth::user()->business?->mode === 'test') {
            return 'mysql_test';
        }

        // Otherwise, respect the database connection already set by middleware
        return config('database.default');
    }


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'token',
        'abilities',
        'expires_at',
        'plain_text_token',
        'mode',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'abilities' => 'json',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
        'plain_text_token' => 'encrypted',
    ];
}
