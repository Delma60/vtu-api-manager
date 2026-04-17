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
        // ProviderService::make();
        return DB::transaction(function () {
            
        });
    }
}
