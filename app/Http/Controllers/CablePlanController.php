<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCablePlansRequest;
use App\Http\Requests\UpdateCablePlansRequest;
use App\Models\CablePlan;
use App\Models\NetworkType;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CablePlanController extends Controller
{

    public function index()
    {
        // get first provider
        $cablePlans = CablePlan::with(['networkType'])->latest()->get();
        $cableNetworks = NetworkType::where('type', 'cable')->get();

        return inertia('pricing/cable', [
            'cablePlans' => $cablePlans,
            'cableNetworks' => $cableNetworks,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $networkTypes = NetworkType::where('type', 'cable')->get();
        $providers = Provider::where('is_active', true)->get();

        return inertia('pricing/create-cable-plan', [
            'networkTypes' => $networkTypes,
            'providers' => $providers,
            'networks' => $networkTypes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCablePlansRequest $request)
    {
        $validated = $request->validated();

        // CablePlan::create($validated);
        DB::transaction(function() use ($validated) {
             $dataPlan = CablePlan::create([
                'cable_network' => $validated['cable_network'],
                'plan_name' => $validated['plan_name'],
                'is_active' => $validated['is_active'] ?? true,
                ]);
            // Handle provider association if providerable data is provided
            if (!empty($validated['providerable']['provider_id'])) {
                $dataPlan->providers()->attach($validated['providerable']['provider_id'], [
                    'cost_price' => $validated['providerable']['cost_price'],
                    'margin_value' => $validated['providerable']['margin_value'],
                    'margin_type' => $validated['providerable']['margin_type'],
                    'server_id' => $validated['providerable']['server_id'],
                ]);
            }
        });

        return back()->with('success', 'Cable plan created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CablePlan $cablePlan)
    {
        $networkTypes = NetworkType::where('type', 'cable')->get();
        $providers = Provider::where('is_active', true)->get();
        $transformedPlan = [
            'id' => $cablePlan->id,
            'cable_network' => $cablePlan->cable_network,
            'plan_name' => $cablePlan->plan_name,
            'is_active' => $cablePlan->is_active ?? true,
            'providerable' => $cablePlan->providers->first() ? [
                'provider_id' => $cablePlan->providers->first()->id,
                'server_id' => $cablePlan->providers->first()->pivot->server_id,
                'cost_price' => $cablePlan->providers->first()->pivot->cost_price,
                'margin_value' => $cablePlan->providers->first()->pivot->margin_value,
                'margin_type' => $cablePlan->providers->first()->pivot->margin_type,
            ] : [
                'provider_id' => "1",
                'server_id' => null,
                'cost_price' => '0.00',
                'margin_value' => '0.00',
                'margin_type' => 'fixed',
            ],
        ];

        return inertia('pricing/edit-cable-plan', [
            'cablePlan' => $transformedPlan,
            'networkTypes' => $networkTypes,
            'providers' => $providers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCablePlansRequest $request, CablePlan $cablePlan)
    {
        $validated = $request->validated();

        $cablePlan->update($validated);

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
            $cablePlan->providers()->sync($providerables);
        }

        return back()->with('success', 'Cable plan updated successfully.');
    }

    /**
     * Toggle the active status of the specified resource.
     */
    public function toggleStatus(Request $request, CablePlan $cablePlan)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $cablePlan->update(['is_active' => $validated['is_active']]);

        return redirect()->back()->with('success', 'Cable plan status updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CablePlan $cablePlan)
    {
        $cablePlan->delete();

        return redirect()->route('pricing.index')->with('success', 'Cable plan deleted successfully.');
    }
}
