<?php

namespace App\Services;

use App\Models\ApiCredential;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;

class ApiKeyManager
{
    /**
     * Cache duration for active tokens to drastically reduce database hits.
     * Set to 5 minutes (300 seconds).
     */
    private const CACHE_TTL = 300;

    /**
     * Generate a new API Key for a business environment.
     * * @param int $businessId
     * @param string $environment 'live' or 'test'
     * @return string The plaintext token (Must be shown to user ONCE)
     */
    public static function generateKey(int $userId, int $businessId, string $environment = 'live', string $name): string
    {
        // 1. Generate a secure random token
        $prefix = $environment === 'test' ? 'VTUSECK_TEST-' : 'VTUSECK-';
        $plainTextToken = bin2hex(random_bytes(32));

        $storedToken = Crypt::encryptString($plainTextToken);

        // 3. Save to database
        ApiCredential::create([
            'user_id' => $userId,
            'business_id' => $businessId,
            'environment' => $environment,
            'hashed_key'       => $storedToken,
            'name'        => $name,
            'key_prefix' => $prefix,
            'is_active'   => true,
        ]);

        return $plainTextToken;
    }

    /**
     * Retrieve the active credential model based on an incoming Bearer token.
     * Includes caching to prevent heavy database queries on every API request.
     *
     * @param string|null $plainTextToken
     * @return ApiCredential|null
     */
    public static function getCredentialFromToken(?string $plainTextToken): ?ApiCredential
    {
        $broken = explode('-', $plainTextToken);
        $token = end($broken);
        if (empty($token)) {
            return null;
        }

        // 1. Create a unique cache key based on the token itself
        // We hash the token for the cache key so the raw token isn't sitting in plain text in Redis/File cache
        $cacheKey = 'api_key_auth_' . hash('sha256', $token);

        // 2. Check cache first, otherwise query database
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($token) {
            
            // Bypass global scopes because the user isn't fully authenticated yet!
            $credentials = ApiCredential::withoutGlobalScopes()
                ->where('is_active', true)
                ->get();

            // Find the matching token
            foreach ($credentials as $credential) {
                try {
                    // If you store tokens encrypted:
                    $decrypted = Crypt::decryptString($credential->hashed_key);
                    
                    if ($decrypted === $token) {
                        return $credential;
                    }
                } catch (\Exception $e) {
                    // Skip if a token is malformed or cannot be decrypted
                    Log::warning("Failed to decrypt API key ID: " . $credential->id);
                    continue;
                }
            }

            return null; // Token is invalid or revoked
        });
    }

    /**
     * Revoke a specific API key so it can no longer be used.
     * * @param ApiCredential $credential
     * @return void
     */
    public static function revokeKey(ApiCredential $credential): void
    {
        $credential->update(['is_active' => false]);

        // If you revoke a key, make sure to bust the cache!
        try {
            $decrypted = Crypt::decryptString($credential->token);
            Cache::forget('api_key_auth_' . hash('sha256', $decrypted));
        } catch (\Exception $e) {
            // Failsafe
        }
    }

    /**
     * Retrieve all API keys for a specific business.
     * Automatically masks the tokens for secure frontend display.
     *
     * @param int $businessId
     * @return \Illuminate\Support\Collection
     */
    public static function getTokensForBusiness(int $businessId)
    {
        // Use withoutGlobalScopes to ensure we fetch both live and test keys
        return ApiCredential::withoutGlobalScopes()
            ->where('business_id', $businessId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($credential) {
                try {
                    // Decrypt the token to mask it properly
                    $decrypted = Crypt::decryptString($credential->token);
                    
                    // Extract the prefix (sk_live_ or sk_test_) and the last 4 characters
                    $prefix = substr($decrypted, 0, 8); 
                    $lastFour = substr($decrypted, -4);
                    
                    // Create a safe, masked version for the frontend
                    $credential->masked_token = $prefix . str_repeat('*', 24) . $lastFour;
                } catch (\Exception $e) {
                    // Failsafe if decryption fails
                    $credential->masked_token = 'Unreadable Token';
                }
                
                // Completely hide the raw encrypted database token from the final array/JSON output
                $credential->makeHidden('token');
                
                return $credential;
            });
    }
}