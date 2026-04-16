<?php

namespace App\Http\Controllers;

use App\Models\DataPlan;
use App\Http\Requests\StoreDataPlanRequest;
use App\Http\Requests\UpdateDataPlanRequest;
use App\Models\Network;
use App\Models\Provider;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DataPlanController extends Controller
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
        return Inertia::render('pricing/create-data-plan', [
            // Pass any necessary data for the form, e.g., networks, providers, etc.
             'networks' => Network::with('networkTypes')->get(),
            'providers' => Provider::all(),
            // "plan_types" => NetworkType::airtime()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDataPlanRequest $request)
    {
        //
        $validated = $request->validated();
        $network = Network::find($validated['network_id']);
        $networkType = $network->networkTypes()->find($validated['plan_type']);

        DB::transaction(function() use ($validated, $networkType, $network) {
             $dataPlan = DataPlan::create([
            'network' => $network->name,
            'plan_name' => $validated['volume'] . ' ' . $validated['plan_size'],
            'plan_type' => $networkType->name,
            'plan_size' => $validated['plan_size'],
            'validity' => $validated['validity'] ?? null,

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

        return back()->with('success', 'Data plan created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(DataPlan $dataPlan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DataPlan $dataPlan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDataPlanRequest $request, DataPlan $dataPlan)
    {
        //
        $validated = $request->validated();
        $dataPlan->update($validated);
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
            $dataPlan->providers()->sync($providerables);
        }
        return back()->with("success", "Data plan updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DataPlan $dataPlan)
    {
        //
    }
}
