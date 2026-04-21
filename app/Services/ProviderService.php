<?php

namespace App\Services;

use App\Class\Providers\Adex;
use App\Class\Providers\ProviderAbstract;
use App\Class\Providers\Sandbox;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProviderService
{
    /**
     * Instantiate the correct provider instance.
     */
    public static function make(Provider $provider): ProviderAbstract
    {
        $useSandbox = false;

        if(request()->user()){
            $user = request()->user();
            $useSandbox = $user->business?->mode === 'test';
        }

        // Determine if sandbox mode should be used based on the authenticated user's business mode
        if (auth()->check() && auth()->user()->user_type !== 'admin' && auth()->user()->business) {
            $useSandbox = auth()->user()->business->mode === 'test';
        }

        if ($useSandbox) {
            return new Sandbox($provider);
        }

        $author = $provider->meta['meta_author'] ?? 'sandbox';

        return match ($author) {
            'ADEX DEVELOPER' => new Adex($provider),
            'sandbox'        => new Sandbox($provider),
            default          => throw new \InvalidArgumentException("Unsupported provider author: {$author}"),
        };
    }

    /**
     * Check and log the health status of a provider.
     */
    public static function diagnose(Provider $provider): bool
    {
        $providerInstance = self::make($provider);
        $isHealthy = $providerInstance->isHealthy();
        
        $providerInstance->diagnose(
            'Health Check', 
            'Provider Health Status', 
            "Provider is " . ($isHealthy ? 'healthy' : 'unhealthy'), 
            "success"
        );
        
        return $isHealthy;
    }

    /**
     * Get an active provider instance based on an identifier.
     */
    public static function getProviderInstance(string $identifier): ?ProviderAbstract
    {
        Log::info("Fetching provider with identifier: {$identifier}");
        $provider = Provider::serviceProvider($identifier)->first();
        
        return $provider ? self::make($provider) : null;
    }

    public static function createProvider(array $data): Provider
    {
        $meta = self::processUrlMetadata($data);
        return Provider::create($meta);
    }

    public static function updateProvider(array $data): Provider
    {
        $meta = self::processUrlMetadata($data);
        $provider = Provider::findOrFail($meta['id']);
        $provider->update($meta);
        
        return $provider;
    }

    /**
     * Fetch and append metadata (author, logo) from the provider's base URL.
     */
    private static function processUrlMetadata(array $data): array
    {
        if (empty($data['base_url'])) {
            return $data;
        }

        $url = rtrim($data['base_url'], '/');

        // 1. Transform /api or /v1 to the root app URL if found
        if (Str::contains($url, ['/api', '/v1'])) {
            $url = preg_replace('/(\/api|\/v1).*$/', '', $url);
            $data['base_url'] = $url; // Save the stripped URL back to the data array
        }

        // 2. Fetch the metadata
        try {
            $response = Http::timeout(5)->get($url);
            
            if ($response->successful()) {
                $html = $response->body();
                
                // Use regex to find the <meta name="author" ...> tag
                if (preg_match('/<meta\s+name=["\']author["\']\s+content=["\']([^"\']+)["\']\s*\/?>/i', $html, $matches)) {
                    $data['meta']['meta_author'] = $matches[1];
                }
                
                // Check for website logo
                if (preg_match('/<link.*?rel=["\'](?:shortcut )?icon["\'].*?href=["\']([^"\']+)["\']/i', $html, $logoMatches)) {
                    $logoUrl = $logoMatches[1];
                    
                    // Handle relative paths (e.g., /favicon.ico)
                    if (!Str::startsWith($logoUrl, ['http://', 'https://', '//'])) {
                        $logoUrl = $url . '/' . ltrim($logoUrl, '/');
                    }
                    
                    $data['logo_url'] = $logoUrl;
                }
            }
        } catch (\Exception $e) {
            // Log the actual error message alongside the URL for easier debugging
            Log::warning("Could not fetch metadata for: {$url}. Error: " . $e->getMessage());
        }

        return $data;
    }

    /**
     * Sum balances across all configured providers.
     */
    public static function sumAllBalances(): float
    {
        $total = 0.0;

        Provider::all()->each(function (Provider $vendor) use (&$total) {
            try {
                $vendorInstance = self::make($vendor);
                $balance = str_replace(',', '', $vendorInstance->checkBalance());
                $total += (float) $balance;
            } catch (\Throwable $e) {
                // Replaced error_log() with Laravel's standard Log facade
                Log::error("Failed to fetch balance for vendor [{$vendor->name}]: " . $e->getMessage());
            }
        });

        return $total;
    }

    /**
     * Handle incoming webhooks for a specific provider.
     */
    public static function webhook(Request $request, string $identifier)
    {
        // Use firstOrFail so it automatically aborts with a 404 if the vendor doesn't exist
        $vendor = Provider::whereIdentifier($identifier)->firstOrFail();
        
        $vendorInstance = self::make($vendor);
        $vendorInstance->webhook($request);
        
        return response()->noContent();
    }
}