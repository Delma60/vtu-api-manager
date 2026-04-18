<?php

namespace App\Services\Vtu;

use App\Services\ProviderService;
use Illuminate\Support\Facades\DB;

class CableProcessor
{
   public function process($request)
    {
        return DB::transaction(function () use ($request) {
            $provider = ProviderService::getProviderInstance('cable');
            return $provider->process("cable", $request);
        });
    }

    public function getCablePlans($cable_network)
    {
        // Implement logic to retrieve data plans based on the network ID
            $provider = ProviderService::getProviderInstance('cable');
            if (!$provider) {
                return [
                    'status' => 'error',
                    'message' => 'No cable provider configured',
                ];
            }
            $response = $provider->plans([ 
                'cable_network' => $cable_network,
                'type' => 'cable'
            ]);
            if (($response['status'] ?? '') !== 'success') {
                return [
                    'status' => 'error',
                    'message' => $response['message'] ?? 'Failed to retrieve cable plans',
                    'data' => null,
                ];
            }
            return $response;

    }
}
