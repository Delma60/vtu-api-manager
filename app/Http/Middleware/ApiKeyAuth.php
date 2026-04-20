<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PersonalAccessToken;

class ApiKeyAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Get the Authorization header
        $authHeader = $request->bearerToken();

        if (!$authHeader) {
            return $next($request);
        }

        // Check if it's a Sanctum token (format: 1|hash)
        if (str_contains($authHeader, '|')) {
            $token = PersonalAccessToken::withoutGlobalScope('business_tenant')->findToken($authHeader);

            if ($token) {
                Auth::setUser($token->tokenable);
                return $next($request);
            }
        }
        $token = PersonalAccessToken::withoutGlobalScope('business_tenant')->where('plain_text_token', $authHeader)->first();

            if ($token) {
                Auth::setUser($token->tokenable);
                return $next($request);
            }

        // If no valid token found, continue for sanctum:auth to handle it
        return $next($request);
    }
}
