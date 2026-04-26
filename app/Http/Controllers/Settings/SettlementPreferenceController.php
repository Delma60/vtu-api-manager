<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettlementPreferenceController extends Controller
{
    public function edit()
    {
        return Inertia::render('settings/settlements', [
            'business' => auth()->user()->business
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settlement_bank'           => ['nullable', 'string', 'max:255'],
            'settlement_account_number' => ['nullable', 'string', 'max:20'],
            'settlement_account_name'   => ['nullable', 'string', 'max:255'],
            'settlement_schedule'       => ['required', 'in:manual,daily,weekly,monthly'],
        ]);

        $business = auth()->user()->business;
        $business->update($validated);

        return back()->with('success', 'Settlement preferences updated successfully.');
    }
}