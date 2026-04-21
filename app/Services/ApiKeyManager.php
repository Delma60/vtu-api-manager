<?php

namespace App\Services;

use App\Models\ApiCredential;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ApiKeyManager
{
    public static function generateKey($userId, $environment = 'live', $name = 'Default Key')
    {
        // Determine the prefix based on the environment
        $prefix = $environment === 'live' ? 'VTUSECK-' : 'VTUSECK_TEST-';
        
        // Generate a secure, random string (40 characters)
        $randomString = Str::random(40);
        
        // Construct the full plain-text key
        $plainTextKey = $prefix . $randomString;
        
        // Encrypt for secure storage
        $encryptedKey = Crypt::encryptString($plainTextKey);
        
        // Save to database
        ApiCredential::create([
            'user_id' => $userId,
            'name' => $name,
            'environment' => $environment,
            'key_prefix' => $prefix,
            'hashed_key' => $encryptedKey,
        ]);
        
        // Return the plain text key. THIS IS THE ONLY TIME THE USER SEES IT.
        return $plainTextKey; 
    }

    // encrypt and decrypt functions for manual use if needed
    public static function encryptKey($plainTextKey)
    {        
        return Crypt::encryptString($plainTextKey);
    }

    public static function decryptKey($encryptedKey)
    {
        return Crypt::decryptString($encryptedKey);
    }
    public static function cleanBearerToken($token)
    {
        return self::activeToken($token);
    }

    public static function activeToken($token = null){
        if(!$token) return null;
        $keyPart = substr($token, strpos($token, '-') + 1);
        return request()->user()->tokens()->get()->map(
            function ($cred) use ($keyPart) {
                $decryptedKey = ApiKeyManager::decryptKey($cred->hashed_key);
                $decryptedKeyPart = substr($decryptedKey, strpos($decryptedKey, '-') + 1);
                return $decryptedKeyPart === $keyPart ? $cred : null;
            }
        )->filter()->first();
    }
}