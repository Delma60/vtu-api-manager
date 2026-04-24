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
            'name' => !empty($validated['name']) ? $validated['name'] : $network->name,
            'type' => $validated['type'],
            'plan_type' => $validated['plan_type'] ?? null,
            'min_amount' => $validated['min_amount'] ?? null,
            'max_amount' => $validated['max_amount'] ?? null,
            
        ]);

        $pinSource = $validated['pin_source'] ?? 'api';
        
        if ($pinSource === 'api' && isset($validated['providerable']['provider_id'])) {
            $pivotData = [];
            $item = $validated['providerable'];
            $pivotData[$item['provider_id']] = [
                'cost_price'   => $item['cost_price'] ?? 0,
                'margin_value' => $item['margin_value'] ?? 0,
                'margin_type'  => $item['margin_type'] ?? 'fixed',
                'server_id'    => $item['server_id'] ?? null,
            ];
            $discount->providers()->attach($pivotData);
        }

        if ($pinSource === 'local' && !empty($validated['pins'])) {
            // Split text area by newline, trim whitespace, and filter out empty lines
            $rawPins = array_filter(array_map('trim', explode("\n", $validated['pins'])));
            
            $pinsToInsert = [];
            foreach ($rawPins as $pin) {
                if (!empty($pin)) {
                    $pinsToInsert[] = [
                        'discount_id' => $discount->id,
                        'network_id' => $network->id,
                        'pin' => $pin, // *Note: In production, consider encrypting this value*
                        'amount' => $validated['min_amount'], // Denomination
                        'status' => 'unused',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            if (!empty($pinsToInsert)) {
                \App\Models\AirtimePin::insert($pinsToInsert);
            }
        }
        // Log::info($validated);
        if ($validated['type'] === 'airtime_pin') {
             return redirect()->route('pricing.airtime-data', ['tab' => 'airtime_pin'])
                              ->with("success", "Airtime PIN Plan created successfully.");
        }
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
