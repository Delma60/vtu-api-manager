<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AirtimePinRequest;
use App\Http\Requests\AirtimeServiceRequest;
use App\Http\Requests\CablePurchaseRequest;
use App\Http\Requests\DataPinRequest;
use App\Http\Requests\DataPurchaseRequest;
use App\Models\Discount;
use App\Models\Network;
use App\Models\NetworkType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    //
    function airtime(AirtimeServiceRequest $request){
        // check the discount plan for min and max amount
        $all = Discount::all();
        
        $discount = Discount::where(function($query) use($request) {
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

        $response = service()->airtime()->process($request->user(), $request->validated());

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

    function cablePlans(Request $request){
        $validated = $request->validate([
            'cable_network' => 'required|string',
        ]);

        $network = NetworkType::where('name', strtoupper($validated['cable_network']))->first();

        if (!$network) {
            return $this->fail(message: 'Invalid cable network', code: 400);
        }

        $cablePlan = service()->cable()->getCablePlans($network->id);

        if (($cablePlan['status'] ?? '') === 'error' || empty($cablePlan['data'] ?? [])) {
            return $this->fail(
                message: $cablePlan['message'] ?? 'Failed to retrieve cable plans',
                code: 500,
                meta: $cablePlan
            );
        }
        return $this->success(
            data: $cablePlan['data'] ?? null,
            message: $cablePlan['message'] ?? 'Cable plans retrieved successfully',
            code: $cablePlan['code'] ?? 200,
            meta: $cablePlan
        );

    }


    function data(DataPurchaseRequest $request){
        // Log::debug('Data purchase request received', ['request' => $request->validated()]);
        $response = service()->data()->process($request->user(), $request->validated());

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

    function cable(CablePurchaseRequest $request){
        // Log::debug('Data purchase request received', ['request' => $request->validated()]);
        $response = service()->cable()->process($request->user(), $request->validated());

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


    public function airtimePin(AirtimePinRequest $request)
    {
        $payload = $request->validated();
        $user = $request->user(); // Assuming api.key middleware sets the user/business

        try {
            // Dispatch to VtuManager using 'airtime_pin' type
            $response = $this->vtuManager->process('airtime_pin', $user, $payload);

            $status = ($response['status'] === 'success') ? 200 : 400;
            return response()->json($response, $status);

        } catch (\Exception $e) {
            Log::error('Airtime PIN API Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while processing the request.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Process Data PIN Generation
     */
    public function dataPin(DataPinRequest $request)
    {
        $payload = $request->validated();
        $user = $request->user();

        // The PinProcessor requires 'amount', but the user payload only sent 'name'. 
        // We need to look up the exact plan cost before passing it to the processor so it knows how much to deduct.
        $discountPlan = \App\Models\Discount::where('name', $payload['name'])
            ->whereIn('type', ['data_pin', 'dataPin'])
            ->first();

        if (!$discountPlan) {
            return response()->json([
                'status' => 'error',
                'message' => 'The specified Data PIN plan could not be found.'
            ], 404);
        }

        // Attach the required denomination amount to the payload for the Processor
        $payload['amount'] = $discountPlan->min_amount;

        try {
            // Dispatch to VtuManager using 'data_pin' type
            $response = $this->vtuManager->process('data_pin', $user, $payload);

            $status = ($response['status'] === 'success') ? 200 : 400;
            return response()->json($response, $status);

        } catch (\Exception $e) {
            Log::error('Data PIN API Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while processing the request.',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null
            ], 500);
        }
    }

}
