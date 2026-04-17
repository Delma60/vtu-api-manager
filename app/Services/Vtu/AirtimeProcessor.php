<?php

namespace App\Services\Vtu;

use App\Services\ProviderService;
use Illuminate\Support\Facades\DB;

class AirtimeProcessor
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function process($request)
    {
        // Implement the logic to process airtime purchase here
        return DB::transaction(function () use ($request) {
            $provider = ProviderService::getProviderInstance('airtime');
            return $provider->process("airtime", $request);
        });
    }
}
