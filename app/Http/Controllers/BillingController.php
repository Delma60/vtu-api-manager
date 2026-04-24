<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    //

    public function index(Request $request)
    {
        $business = $request->user()->business->load('package');
        $packages = Package::where('is_active', true)->get();

        return Inertia::render('settings/billing/index', [
            'currentBusiness' => $business,
            'packages' => $packages,
        ]);
    }

    public function subscribe(Request $request)
    {
        // Validate request
        $request->validate(['package_id' => 'required|exists:packages,id']);

        $business = $request->user()->business;
        $package = Package::find($request->package_id);

        // TODO: Integrate Payment Gateway (Flutterwave/Monnify) here
        // If payment is successful:
        
        $business->update([
            'package_id' => $package->id,
            'subscription_ends_at' => now()->addMonth(), // or year based on package
            'subscription_status' => 'active',
        ]);

        return back()->with('success', "Successfully subscribed to {$package->name}!");
    }
}
