<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('settings/business', [
            'business' => $request->user()->business,
        ]);
    }

    public function update(Request $request)
    {
        $business = $request->user()->business;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'support_email' => 'nullable|email|max:255',
            'support_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $business->update($validated);

        return back()->with('success', 'Business profile updated successfully.');
    }

    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        $business = $request->user()->business;

        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($business->logo_path) {
                Storage::disk('public')->delete($business->logo_path);
            }

            $path = $request->file('logo')->store('business-logos', 'public');
            $business->update(['logo_path' => $path]);
        }

        return back()->with('success', 'Business logo updated.');
    }
}