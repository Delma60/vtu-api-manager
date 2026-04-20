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
}