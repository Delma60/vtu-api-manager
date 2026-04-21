<?php

namespace App\Http\Middleware;

use App\Models\ApiCredential;
use Closure;
use Illuminate\Http\Request;
use App\Services\ApiKeyManager;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $bearerToken = $request->bearerToken();

        if (!$bearerToken) {
            return response()->json(['error' => 'API key is missing.'], 401);
        }

        $credential = ApiKeyManager::getCredentialFromToken($bearerToken);

        if (!$credential || !$credential->user || !$credential->user->is_active || !$credential?->is_active) {
            return response()->json(['error' => 'Unauthorized. Invalid API key.'], 401);
        }

        // Update last used timestamp
        $credential->update(['last_used_at' => now()]);

        // Set the authenticated user
        $request->setUserResolver(function () use ($credential) {
            return $credential->user;
        });

        // Set API mode in config
        config(['app.api_mode' => $credential->environment]);

        return $next($request);
    }
}
