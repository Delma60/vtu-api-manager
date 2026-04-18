<?php

namespace App\Services\Vtu;

use App\Services\ProviderService;
use Illuminate\Support\Facades\DB;

class DataProcessor
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
        return DB::transaction(function () use ($request) {
            $provider = ProviderService::getProviderInstance('data');
            return $provider->process("data", $request);
        });
    }

    public function getDataPlans($networkId)
    {
        // Implement logic to retrieve data plans based on the network ID
            $provider = ProviderService::getProviderInstance('data');
            if (!$provider) {
                return [
                    'status' => 'error',
                    'message' => 'No data provider configured',
                ];
            }
            $response = $provider->plans([ 
                'network_id' => $networkId,
            ]);
            if (($response['status'] ?? '') !== 'success') {
                return [
                    'status' => 'error',
                    'message' => $response['message'] ?? 'Failed to retrieve data plans',
                    'data' => null,
                ];
            }
            return $response;

    }
}
