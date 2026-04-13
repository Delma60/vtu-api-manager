<?php

namespace App\Http\Controllers;

use App\Models\Network;
use App\Models\NetworkType;
use Illuminate\Http\Request;

class NetworkTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:network_types,name',
            'is_active' => 'sometimes|boolean',
            'network_id' => 'required|exists:networks,id',
            'type' => 'nullable|string|in:airtime,data',
        ]);

       $network = Network::findOrFail($validated['network_id']);

        // 2. Create the NetworkType directly through the relationship.
        // Laravel automatically fills in `typeable_id` and `typeable_type` for you!
        $networkType = $network->networkTypes()->create([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? true,
            'type' => $validated['type'] ?? null,
        ]);

        return back()->with('success', 'Network type created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(NetworkType $networkType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NetworkType $networkType)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|unique:network_types,name,' . $networkType->id,
            'is_active' => 'sometimes|boolean',
            'network_id' => 'sometimes|exists:networks,id',
            'type' => 'nullable|string|in:airtime,data',
        ]);

        // Update the network type directly
        $networkType->update($validated);

        // If network_id is provided, update the polymorphic relationship
        if (isset($validated['network_id'])) {
            $networkType->typeable()->sync([$validated['network_id']]);
        }

        return back()->with('success', 'Network type updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NetworkType $networkType)
    {
        //
        $networkType->delete();
        return back()->with('success', 'Network type deleted successfully');
    }
}
