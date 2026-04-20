<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Http\Requests\StoreSystemSettingRequest;
use App\Http\Requests\UpdateSystemSettingRequest;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {
        // Pluck returns an associative array: ['site_name' => 'NexusVTU', 'maintenance_mode' => '0']
        $settings = SystemSetting::pluck('value', 'key')->toArray();

        return Inertia::render('super-admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function store(StoreSystemSettingRequest $request)
    {
        // We exclude inertia system fields and update all others dynamically
        $data = $request->except(['_token', '_method']);

        foreach ($data as $key => $value) {
            SystemSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_bool($value) ? ($value ? '1' : '0') : $value]
            );
        }

        return back()->with('success', 'System settings updated successfully.');
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemSetting $systemSetting)
    {
        //
    }
}
