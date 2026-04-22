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
use Illuminate\Validation\ValidationException;

class ProviderService
{
    public static $defaultTimeoutMs = 5000;
    public const SUPPORTED_AUTHORS = [
        'ADEX DEVELOPER',
        "SMEPLUG"
        // Add other supported API authors here in the future
    ];

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
        
        // 1. Fetch the mapped class from our config file
        $supportedProviders = config('vtu.providers', []);

        if (!array_key_exists($author, $supportedProviders)) {
            throw new \InvalidArgumentException("Unsupported provider author: {$author}");
        }

        // 2. Dynamically instantiate the class
        $providerClass = $supportedProviders[$author];
        return new $providerClass($provider);
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
        $provider = Provider::withoutGlobalScopes()->where('is_active', true)->first();
        return $provider ? self::make($provider) : null;
    }

    public static function createProvider(array $data): Provider
    {
        $meta = self::processUrlMetadata($data);
        self::ensureProviderIsSupported($meta);
        return Provider::create($meta);
    }

    public static function updateProvider(array $data): Provider
    {
        $meta = self::processUrlMetadata($data);
        $provider = Provider::findOrFail($meta['id']);
        self::ensureProviderIsSupported($meta);
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

        if (Str::contains($url, ['/api', '/v1'])) {
            $url = preg_replace('/(\/api|\/v1).*$/', '', $url);
            // $data['base_url'] = $url;
        }

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ])->timeout(15)->get($url);

        
            
            if ($response->successful()) 
                {
                    // ... inside the try-catch block ...
                
                $html = $response->body();
                $extractedName = null;
                
                // 1. Try the standard Meta Tag first
                if (preg_match('/<meta\s+name=["\']author["\']\s+content=["\']([^"\']+)["\']\s*\/?>/i', $html, $matches)) {
                    $extractedName = strtoupper(trim($matches[1]));
                } 
                // 2. Try Regex to search the HTML body for "Designed/Developed/Powered By"
                elseif (preg_match('/(?:designed|developed|powered)\s+by\s*(?:<[^>]+>\s*)?([a-zA-Z0-9\s&]+)/i', $html, $matches)) {
                    $extractedName = strtoupper(trim($matches[1]));
                }
                // 3. NEW: Fallback to the Page Title for enterprise providers like SME Plug
                elseif (preg_match('/<title>([^<]+)<\/title>/i', $html, $matches)) {
                    $extractedName = strtoupper(trim($matches[1]));
                }

                // 4. Format the extracted name dynamically against the config list
                if ($extractedName) {
                    $normalizedName = str_replace('A D E', 'ADEX', $extractedName);
                    $matched = false;
                    
                    $supportedAuthors = array_keys(config('vtu.providers', []));

                    foreach ($supportedAuthors as $supportedAuthor) {
                        if ($supportedAuthor === 'sandbox') continue;

                        // Grab the primary keyword (e.g., 'SME' from 'SME PLUG' or 'SMEPLUG')
                        // We use str_replace to handle spaces so 'SME PLUG' matches 'SMEPLUG'
                        $primaryKeyword = str_replace(' ', '', explode(' ', $supportedAuthor)[0]); 
                        
                        if (Str::contains(str_replace(' ', '', $normalizedName), $primaryKeyword)) {
                            $data['meta']['meta_author'] = $supportedAuthor;
                            $matched = true;
                            break;
                        }
                    }

                    if (!$matched) {
                        $data['meta']['meta_author'] = $extractedName;
                    }
                }
                }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Could not fetch metadata for: {$url}. Error: " . $e->getMessage());
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
    public static function webhook(Request $request, string $uuid)
    {
        // Use firstOrFail so it automatically aborts with a 404 if the vendor doesn't exist
        $vendor = Provider::where('uuid', $uuid)->firstOrFail();
        
        $vendorInstance = self::make($vendor);
        $vendorInstance->webhook($request);
        
        return response()->noContent();
    }

    private static function ensureProviderIsSupported(array $data): void
    {
        $author = $data['meta']['meta_author'] ?? null;
        $supportedProviders = config('vtu.providers', []);

        if (!array_key_exists($author, $supportedProviders)) {
            $detected = $author ? "Detected author: {$author}" : "No valid API author tag found at this URL";
            
            throw ValidationException::withMessages([
                'base_url' => "This is not a supported VTU provider API. {$detected}."
            ]);
        }
    }

    /**
     * Get a list of fallback provider instances, prioritized by the primary network type provider.
     *
     * @param string $service The requested service (e.g., 'data', 'airtime')
     * @param int|null $networkTypeId The ID of the specific network type (e.g., MTN SME)
     * @return array<\App\Class\Providers\ProviderAbstract>
     */
    public static function getFallbackProviders(string $service, ?int $networkTypeId = null): array
    {
        $primaryProviderId = null;

        // 1. Identify the primary provider assigned to this specific network type
        if ($networkTypeId) {
            $networkType = \App\Models\NetworkType::find($networkTypeId);
            if ($networkType && $networkType->provider_id) {
                $primaryProviderId = $networkType->provider_id;
            }
        }

        // 2. Fetch all active providers within the current business scope
        $activeProviders = Provider::where('is_active', true)->get();

        // 3. Sort the collection so the primary provider is always at index 0
        if ($primaryProviderId) {
            $activeProviders = $activeProviders->sortByDesc(function ($provider) use ($primaryProviderId) {
                // Return 1 if it's the primary, 0 for everything else, then sort descending
                return $provider->id === $primaryProviderId ? 1 : 0;
            })->values(); // Reset the array keys to be sequential
        }

        $fallbackInstances = [];

        // 4. Instantiate and filter by supported services
        foreach ($activeProviders as $provider) {
            try {
                // Dynamically instantiate the class using your config factory
                $instance = self::make($provider);
                
                // Only add to our fallback pool if the class explicitly supports the service
                if ($instance->supportsService($service)) {
                    $fallbackInstances[] = $instance;
                }
            } catch (\Exception $e) {
                // If a provider fails to instantiate (e.g., missing from config, bad config), we log and safely skip it
                Log::warning("Failover Setup: Skipped provider '{$provider->name}' - " . $e->getMessage());
            }
        }

        return $fallbackInstances;
    }
}
