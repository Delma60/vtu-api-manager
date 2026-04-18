<?php

namespace App\Http\Controllers;

use App\Models\CablePlan;
use App\Models\NetworkType;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CablePlanController extends Controller
{

    public function index()
    {
        $cablePlans = CablePlan::with(['networkType', 'provider'])->latest()->get();
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
            'providers' => $providers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'network_type_id' => 'required|exists:network_types,id',
            'provider_id' => 'required|exists:providers,id',
            'plan_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        CablePlan::create($validated);

        return redirect()->route('pricing.index')->with('success', 'Cable plan created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CablePlan $cablePlan)
    {
        $networkTypes = NetworkType::where('type', 'cable')->get();
        $providers = Provider::where('is_active', true)->get();

        return inertia('pricing/edit-cable-plan', [
            'cablePlan' => $cablePlan,
            'networkTypes' => $networkTypes,
            'providers' => $providers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CablePlan $cablePlan)
    {
        $validated = $request->validate([
            'network_type_id' => 'required|exists:network_types,id',
            'provider_id' => 'required|exists:providers,id',
            'plan_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $cablePlan->update($validated);

        return redirect()->route('pricing.index')->with('success', 'Cable plan updated successfully.');
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
