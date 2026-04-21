<?php

namespace App\Http\Controllers;

use App\Models\Network;
use App\Models\NetworkType;
use App\Models\Provider;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ServiceControlController extends Controller
{
    public function index()
    {
        $providers = Provider::where('is_active', true)->get();


        // Data Types (SME, Gifting, CG)
        $networkTypes = NetworkType::with('typeable')->orderBy('name')->get();

        // Specific brands (DSTV, GOTV, MTN, Airtel)
        $networks = Network::orderBy('name')->get();

        return Inertia::render('infrastructure/service-control', [
            'providers' => $providers,
            'networkTypes' => $networkTypes,
            'networks' => $networks,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'services' => 'array',
            'networkTypes' => 'array',
            'networks' => 'array',
        ]);

        DB::transaction(function () use ($request) {
           
            // Update Data Types (SME, Gifting)
            foreach ($request->networkTypes as $id => $providerId) {
                NetworkType::where('id', $id)->update(['provider_id' => $providerId === 'none' ? null : $providerId]);
            }

            // Update Networks (DSTV, GOTV)
            foreach ($request->networks as $id => $providerId) {
                Network::where('id', $id)->update(['provider_id' => $providerId === 'none' ? null : $providerId]);
            }
        });

        return redirect()->back()->with('success', 'Global Routing updated successfully.');
    }

    public function bulkUpdate(Request $request)
{
    $validated = $request->validate([
        'services' => 'array',
        'networkTypes' => 'array',
        'networks' => 'array',
    ]);

    DB::transaction(function () use ($validated) {
        // Update Services
        foreach ($validated['services'] as $id => $providerId) {
            Log::info("Updating Service ID $id to Provider ID $providerId");
            \App\Models\Service::where('id', $id)->update([
                'provider_id' => $providerId === 'none' ? null : $providerId
            ]);
        }

        // Update Network Types (SME/CG/Gifting)
        foreach ($validated['networkTypes'] as $id => $providerId) {
            \App\Models\NetworkType::where('id', $id)->update([
                'provider_id' => $providerId === 'none' ? null : $providerId
            ]);
        }

        // Update Brands (MTN/Airtel)
        foreach ($validated['networks'] as $id => $providerId) {
            \App\Models\Network::where('id', $id)->update([
                'provider_id' => $providerId === 'none' ? null : $providerId
            ]);
        }
    });

    return back()->with('message', 'Routing engine synchronized.');
}
}
