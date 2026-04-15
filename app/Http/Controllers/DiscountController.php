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
        $discount = Discount::create(array_merge($validated, ['name' => $network->name] ));
        $discount->providers()->attach($validated['providerable']);
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discount $discount)
    {
        //
    }
}
