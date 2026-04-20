<?php

namespace App\Http\Middleware;

use App\Models\ApiCredential;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
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
        $providedKey = $request->bearerToken();

        if (!$providedKey) {
            return response()->json(['error' => 'API key is missing.'], 401);
        }

        // separate prefix and key
        $prefix = substr($providedKey, 0, strpos($providedKey, '-'));
        $keyPart = substr($providedKey, strpos($providedKey, '-') + 1);
        
        $credential = ApiCredential::all()->map(
            function ($cred) use ($keyPart) {
                $decryptedKey = Crypt::decryptString($cred->hashed_key);
                $decryptedKeyPart = substr($decryptedKey, strpos($decryptedKey, '-') + 1);
                return $decryptedKeyPart === $keyPart ? $cred : null;
            }
        )->filter()->first();

        if (!$credential) {
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