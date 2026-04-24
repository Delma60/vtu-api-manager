<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Http\Requests\StoreSystemSettingRequest;
use App\Http\Requests\UpdateSystemSettingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {
        // Pluck returns an associative array: ['site_name' => 'NexusVTU', 'maintenance_mode' => '0']
        $settings = SystemSetting::pluck('value', 'key')->toArray();

        $defaultSettings = [
            'site_name' => SystemSetting::getKeyValue('site_name', 'NexusVTU'),
            'support_email' => SystemSetting::getKeyValue('support_email', ''),
            'support_phone' => SystemSetting::getKeyValue('support_phone', ''),
            'company_address' => SystemSetting::getKeyValue('company_address', ''),
            'maintenance_mode' => SystemSetting::getKeyValue('maintenance_mode', '0'),
            'bank_transfer_charge' => [
                'value' => SystemSetting::getKeyValue("bank_transfer_charge_value", 0),
                'type' => SystemSetting::getKeyValue("bank_transfer_charge_type", 'fixed'),
            ],
            'wallet_transfer_charge' => [
                'value' => SystemSetting::getKeyValue("wallet_transfer_charge_value", 0),
                'type' => SystemSetting::getKeyValue("wallet_transfer_charge_type", 'fixed'),
            ],
        ];

        return Inertia::render('super-admin/settings/index', [
            'settings' => $defaultSettings,
        ]);
    }

    public function store(StoreSystemSettingRequest $request)
    {
        // We exclude inertia system fields and update all others dynamically
        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            $processedValue = $value;
            
            // Handle boolean values
            if (is_bool($value)) {
                $processedValue = $value ? '1' : '0';
            }
            // Handle array values (like bank_transfer_charge)
            elseif (is_array($value)) {
                $processedValue = json_encode($value);
            }
            
            SystemSetting::updateOrCreate(
                ['key' => $key, 'business_id' => auth()->user()->business_id],
                ['value' => $processedValue]
            );
        }

        return back()->with('success', 'System settings updated successfully.');
    }

    /**
     * Get charge setting with proper JSON decoding and defaults
     */
    private function getChargeSetting(string $key): array
    {
        $value = SystemSetting::getKeyValue($key, null);
        
        if ($value) {
            $decoded = json_decode($value, true);
            if (is_array($decoded) && isset($decoded['value']) && isset($decoded['type'])) {
                return $decoded;
            }
        }
        
        // Return default values
        return [
            'value' => 0,
            'type' => 'fixed',
        ];
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
    // public function store(StoreSystemSettingRequest $request)
    // {
    //     //
    // }

    /**
     * Display the specified resource.
     */
    public function show(SystemSetting $systemSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SystemSetting $systemSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSystemSettingRequest $request, SystemSetting $systemSetting)
    {
        //
    }

    // In App\Http\Controllers\SystemSettingController.php
    
    public function updateSingle(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required'
        ]);

        $businessId = auth()->user()->business_id ?? 1; // Fallback or retrieve dynamically
        $environment = auth()->user()->business?->mode ?? 'live';

        \App\Models\SystemSetting::updateOrCreate(
            [
                'key' => $request->key,
                'business_id' => $businessId,
                'environment' => $environment,
                // We explicitly look for global settings where settingable is null
                'settingable_id' => null, 
                'settingable_type' => null
            ],
            ['value' => (string) $request->value]
        );

        return back()->with('success', 'Routing setting updated successfully');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemSetting $systemSetting)
    {
        //
    }
}
