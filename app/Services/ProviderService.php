<?php

namespace App\Services;

use App\Class\Providers\Adex;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProviderService
{
    /**
     * Create a new class instance.
     */
    public function __construct(){}

    static function make (Provider $provider) {
        $useSandbox = env('USE_SANDBOX', false);

        $match = "adex" //$useSandbox ? "sandbox":($provider->sub_category === "simhost" ? $provider->name : $provider->sub_category);
        Log::info($provider);
        return match ($match) {
            "adex"=> new Adex($provider),
            // "sandbox"=> new SandboxService() ,
            // "sme plug"=> new SMEPlug($provider),
            // "spurs"=> new Adex($provider),
            // "msorg"=> new Adex($provider),
        } ;
    }

    public static function createProvider(array $data): Provider
    {
        return Provider::create($data);
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
