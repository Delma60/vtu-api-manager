<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Http\Requests\StoreProviderRequest;
use App\Http\Requests\UpdateProviderRequest;
use App\Models\Service;
use App\Services\ProviderService;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all providers ordered by their routing priority
        $providers = Provider::orderBy('priority', 'asc')->get();

        return Inertia::render('infrastructure/providers', [
            'providers' => $providers,
            'routingConfig' => [
                'auto_failover' => true,
                'timeout_ms' => 5000, // If a vendor doesn't reply in 5s, switch
            ]
        ]);
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
    public function store(StoreProviderRequest $request)
    {
        //
        Log::info("Creating provider with data: " . json_encode($request->validated()));
        ProviderService::createProvider($request->validated());
        return redirect()->route('providers.index')->with('success', 'Provider created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Provider $provider)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {
        //
        // $services = Service::where('network', 'mtn')->get(); // Example filtering

        // In a real app, you'd fetch this from your api_logs table
        $recentErrors = [
            ['time' => '10 mins ago', 'endpoint' => '/api/b2b/vtu', 'error' => 'HTTP 504 Gateway Timeout'],
            ['time' => '2 hours ago', 'endpoint' => '/api/b2b/data', 'error' => 'Insufficient Balance'],
        ];

        return Inertia::render('infrastructure/provider-config', [
            'provider' => $provider,
            // 'services' => $services,
            'recentErrors' => $recentErrors
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProviderRequest $request, Provider $provider)
    {
        //
        Log::info("Updating provider [{$provider->name}] with data: " . json_encode($request->validated()));
        ProviderService::updateProvider(array_merge($request->validated(), ['id' => $provider->id]));
        return back()->with('success', 'Provider updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Provider $provider)
    {
        //
    }
}
