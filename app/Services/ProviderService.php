<?php

namespace App\Services;

use App\Class\Providers\Adex;
use App\Class\Providers\ProviderAbstract;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProviderService
{
    /**
     * Create a new class instance.
     */
    public function __construct(){}

    static function make (Provider $provider):ProviderAbstract {
        $useSandbox = env('USE_SANDBOX', false);

        $match = "ADEX DEVELOPER"; //$useSandbox ? "sandbox":($provider->sub_category === "simhost" ? $provider->meta?->meta_author : $provider->sub_category);
        // Log::info($provider);
        return match ($match) {
            "ADEX DEVELOPER"=> new Adex($provider),
            // "sandbox"=> new SandboxService() ,
            // "sme plug"=> new SMEPlug($provider),
            // "spurs"=> new Adex($provider),
            // "msorg"=> new Adex($provider),
        } ;
    }

    // this is where the i get to put provider to make and get provder
    static function getProviderInstance($identifier): ?ProviderAbstract
    {
        $provider = Provider::serviceProvider($identifier)->first();
        Log::info($identifier);
        return $provider ? self::make($provider) : null;
    }

    public static function createProvider(array $data): Provider
    {
        $meta = self::processUrlMetadata($data);
        return Provider::create($meta);
    }

    private static function processUrlMetadata(array $data): array
    {
        if (isset($data['base_url'])) {
            $url = $data['base_url'];

            // 1. Transform /api or /v1 to the root app URL if found
            // Example: transform https://website.com/api/v1 to https://website.com or https://app.website.com
            if (Str::contains($url, ['/api', '/v1'])) {
                $data['base_url'] = preg_replace('/(\/api|\/v1).*$/', '', $url);
            }

            // 2. Fetch the metadata (The "Inconvenience" check)
            try {
                $response = Http::timeout(5)->get($url);
                
                if ($response->successful()) {
                    $html = $response->body();
                    
                    // Use regex to find the <meta name="author" ...> tag
                    preg_match('/<meta\s+name=["\']author["\']\s+content=["\']([^"\']+)["\']\s*\/?>/i', $html, $matches);
                    // check for website logo
                    if (preg_match('/<link.*?rel=["\'](?:shortcut )?icon["\'].*?href=["\']([^"\']+)["\']/i', $html, $logoMatches)) {
                        $logoUrl = $logoMatches[1];
                        
                        // Handle relative paths (e.g., /favicon.ico)
                        if (!Str::startsWith($logoUrl, ['http', '//'])) {
                            $logoUrl = rtrim($url, '/') . '/' . ltrim($logoUrl, '/');
                        }
                        
                        $data['logo_url'] = $logoUrl;
                    }
                    if (isset($matches[1])) {
                        // You can store this in a 'meta_author' column or use it for validation
                        $data['meta']['meta_author'] = $matches[1];
                    }
                }
            } catch (\Exception $e) {
                // If the site is down or blocks the request, you can decide to 
                // throw an error or just log it and continue.
                Log::warning("Could not fetch metadata for: " . $url);
            }
        }
        $data['base_url'] = $url;

        return $data;
    }

    public static function updateProvider(array $data): Provider
    {
        
        $meta = self::processUrlMetadata($data);
        $provider = Provider::findOrFail($meta['id']);
        $provider->update($meta);
        return $provider;
    }

    public static function sumAllBalances(): float
    {

         $total = 0.0;
            Provider::all()->map(function ($vendor) use (&$total) {
            try {
                // Log::info($vendor);
                $vendorInstance = self::make($vendor);
                $total += (float) str_replace(',', '', $vendorInstance->checkBalance());
            } catch (\Throwable $e) {
                error_log($e);
                // Log::warning("Failed to fetch balance for vendor [{$vendor->name}]: " . $e->getMessage());
            }
        });

        error_log($total);
        return $total;

    }

    static function webhook(Request $request, $identifier){
        $vendor = Provider::whereIdentifier($identifier)->first();
        $vendorInstance = self::make($vendor);
        $vendorInstance->webhook($request);
        return response()->noContent();

    }

}
