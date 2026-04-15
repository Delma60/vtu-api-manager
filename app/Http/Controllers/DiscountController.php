<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Network;
use Illuminate\Http\Request;
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
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'network_id' => 'required|exists:networks,id',
            'type' => 'required|in:airtime,exam,airtimeToCash,user_upgrade,bulksms,airtimePin,electricity,airtime2cash',
            'plan_type' => 'required|exists:network_types,id',
            'min_amount' => 'numeric|min:0',
            'max_amount' => 'numeric|min:0',
            'providerable' => 'required|array',
            'providerable*.*.provider_id' => 'required|exists:providers,id',
            'providerable*.*.cost_price' => 'required|numeric|min:0',
            'providerable*.*.margin_value' => 'required|numeric|min:0',
            'providerable*.*.margin_type' => 'required|in:percentage,fixed',
            'providerable*.*.server_id' => 'nullable',
        ]);
        $network = Network::find($validated['network_id']);
        $discount = Discount::create([
            'name' => $network->name,
            'type' => $validated['type'],
            'plan_type' => $validated['plan_type'],
            'min_amount' => $validated['min_amount'] ?? null,
            'max_amount' => $validated['max_amount'] ?? null,
        ]);
        $providerables = collect($validated['providerable'])->mapWithKeys(function ($item) {
            return [$item['provider_id'] => [
                'cost_price' => $item['cost_price'],
                'margin_value' => $item['margin_value'],
                'margin_type' => $item['margin_type'],
                'server_id' => $item['server_id'],
            ]];
        });
        $discount->providers()->attach($providerables);
        Log::info($validated);
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
    public function update(Request $request, Discount $discount)
    {
        //
        $validated = $request->validate([
            'network_id' => 'sometimes|exists:networks,id',
            'type' => 'sometimes|in:airtime,exam,airtimeToCash,user_upgrade,bulksms,airtimePin,electricity,airtime2cash',
            'plan_type' => 'sometimes|exists:network_types,id',
            'min_amount' => 'numeric|min:0',
            'max_amount' => 'numeric|min:0',
            'providerable' => 'sometimes|array',
            'providerable*.*.provider_id' => 'sometimes|exists:providers,id',
            'providerable*.*.cost_price' => 'sometimes|numeric|min:0',
            'providerable*.*.margin_value' => 'sometimes|numeric|min:0',
            'providerable*.*.margin_type' => 'sometimes|in:percentage,fixed',
            'providerable*.*.server_id' => 'nullable',
            'is_active' => 'sometimes|boolean'
        ]);

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
            $providerables = collect($validated['providerable'])->mapWithKeys(function ($item) {
                return [$item['provider_id'] => [
                    'cost_price' => $item['cost_price'],
                    'margin_value' => $item['margin_value'],
                    'margin_type' => $item['margin_type'],
                    'server_id' => $item['server_id'],
                ]];
            });
            $discount->providers()->sync($providerables);
        }
        Log::info($validated);
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
