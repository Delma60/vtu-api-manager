<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiscountPlanRequest;
use App\Http\Requests\UpdateDiscountPlanRequest;
use App\Models\Discount;
use App\Models\Network;
use Illuminate\Support\Facades\Log;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiscountPlanRequest $request)
    {
        //
        $validated = $request->validated();
        $network = Network::find($validated['network_id']);
        $discount = Discount::create([
            'name' => $network->name,
            'type' => $validated['type'],
            'plan_type' => $validated['plan_type'],
            'min_amount' => $validated['min_amount'] ?? null,
            'max_amount' => $validated['max_amount'] ?? null,
        ]);
        
        $pivotData = [];
        $item = $validated['providerable'];
        $pivotData[$item['provider_id']] = [
            'cost_price'   => $item['cost_price'],
            'margin_value' => $item['margin_value'],
            'margin_type'  => $item['margin_type'],
            'server_id'    => $item['server_id'] ?? null,
        ];
        $discount->providers()->attach($pivotData);
        // Log::info($validated);
        return back()->with("success", "Discount created successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(Discount $discount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discount $discount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiscountPlanRequest $request, Discount $discount)
    {
        //
        $validated = $request->validated();

        if (isset($validated['network_id'])) {
            $network = Network::find($validated['network_id']);
            $discount->name = $network->name;
        }
        if (isset($validated['type'])) {
            $discount->type = $validated['type'];
        }
        if (isset($validated['plan_type'])) {
            $discount->plan_type = $validated['plan_type'];
        }
        if (isset($validated['min_amount'])) {
            $discount->min_amount = $validated['min_amount'];
        }
        if (isset($validated['max_amount'])) {
            $discount->max_amount = $validated['max_amount'];
        }
        if (isset($validated['is_active'])) {
            $discount->is_active = $validated['is_active'];
        }
        $discount->save();
        if (isset($validated['providerable'])) {
            $item = $validated['providerable'];
            $providerables = [
                $item['provider_id'] => [
                    'cost_price' => $item['cost_price'],
                    'margin_value' => $item['margin_value'],
                    'margin_type' => $item['margin_type'],
                    'server_id' => $item['server_id'],
                ]
            ];
            $discount->providers()->sync($providerables);
        }
        return back()->with("success", "Discount updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discount $discount)
    {
        //
        $discount->delete();
        return back()->with("success", "Discount deleted successfully");
    }
}
