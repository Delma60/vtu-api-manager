<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AirtimeServiceRequest;
use App\Http\Requests\DataPurchaseRequest;
use App\Models\Discount;
use App\Models\Network;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    //
    function airtime(AirtimeServiceRequest $request){
        // check the discount plan for min and max amount
        $discount = Discount::airtime()->where(function($query) use($request) {
            $query->where("name", $request->network)
            ->whereHas('planType',  function($q) use($request) {
                $q->where('name', $request->plan_type);
            });
        })->first();

        if(!$discount) {
            return $this->fail(message: 'No airtime plan available for the specified plan type', code: 400);
        }

        // check min and max range for the discount plan
        if ($request->amount < $discount->min_amount || $request->amount > $discount->max_amount) {
            return $this->fail(message: 'Amount must be between ' . $discount->min_amount . ' and ' . $discount->max_amount, code: 400);
        }

        $response = service()->airtime()->process($request->validated());
        
        // Check if the response indicates an error
        if (($response['status'] ?? '') === 'error') {
            return $this->fail(
                message: $response['message'] ?? 'Transaction failed',
                code: 500,
                meta: $response
            );
        }
        
        return $this->success(
            data: $response['data'] ?? null, 
            message: $response['message'] ?? 'Airtime purchase successful', 
            code: $response['code'] ?? 200,
            meta: $response
        );
    }

    function dataPlans(Request $request){
        $validated = $request->validate([
            'network' => 'required|string',
        ]);

        $network = Network::where('code', $validated['network'])->first();

        if (!$network) {
            return $this->fail(message: 'Invalid network code', code: 400);
        }

        $dataPlan = service()->data()->getDataPlans($network->id);

        if (($dataPlan['status'] ?? '') === 'error' || empty($dataPlan['data'] ?? [])) {
            return $this->fail(
                message: $dataPlan['message'] ?? 'Failed to retrieve data plans',
                code: 500,
                meta: $dataPlan
            );
        }
        return $this->success(
            data: $dataPlan['data'] ?? null, 
            message: $dataPlan['message'] ?? 'Data plans retrieved successfully', 
            code: $dataPlan['code'] ?? 200,
            meta: $dataPlan
        );

    }

    
    function data(DataPurchaseRequest $request){
        Log::debug('Data purchase request received', ['request' => $request->validated()]);
        $response = service()->data()->process($request->validated());
        
        // Check if the response indicates an error
        if (($response['status'] ?? '') === 'error') {
            return $this->fail(
                message: $response['message'] ?? 'Transaction failed',
                code: 500,
                meta: $response
            );
        }
        
        return $this->success(
            data: $response['data'] ?? null, 
            message: $response['message'] ?? 'Data purchase successful', 
            code: $response['code'] ?? 200,
            meta: $response
        );
    }
}
