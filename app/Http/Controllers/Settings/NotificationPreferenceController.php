<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationPreferenceController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();
        
        // Fetch all settings specific to this user as key => value pairs
        $userSettings = $user->settings()->pluck('value', 'key')->toArray();

        // Map the database values (strings) back to their proper types for React
        $preferences = [
            'email_low_balance' => isset($userSettings['email_low_balance']) ? $userSettings['email_low_balance'] === '1' : true,
            'low_balance_threshold' => isset($userSettings['low_balance_threshold']) ? (int) $userSettings['low_balance_threshold'] : 5000,
            'email_failed_transactions' => isset($userSettings['email_failed_transactions']) ? $userSettings['email_failed_transactions'] === '1' : true,
            'email_webhook_failures' => isset($userSettings['email_webhook_failures']) ? $userSettings['email_webhook_failures'] === '1' : true,
            'marketing_updates' => isset($userSettings['marketing_updates']) ? $userSettings['marketing_updates'] === '1' : false,
        ];

        return Inertia::render('settings/notifications', [
            'preferences' => $preferences,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
            'preferences.email_low_balance' => 'boolean',
            'preferences.low_balance_threshold' => 'numeric|min:0',
            'preferences.email_failed_transactions' => 'boolean',
            'preferences.email_webhook_failures' => 'boolean',
            'preferences.marketing_updates' => 'boolean',
        ]);

        $user = $request->user();
        $businessId = $user->business_id ?? 1; // Fallback if needed
        $environment = $user->business?->mode ?? 'live';

        // Loop through the preferences and save them as individual settings
        foreach ($validated['preferences'] as $key => $value) {
            
            // Your DB stores values as text. Convert booleans to '1' or '0'.
            $valToSave = is_bool($value) ? ($value ? '1' : '0') : (string) $value;

            // This automatically sets settingable_id and settingable_type to the User
            $user->settings()->updateOrCreate(
                [
                    'key' => $key,
                    'business_id' => $businessId,
                    'environment' => $environment,
                ],
                [
                    'value' => $valToSave
                ]
            );
        }

        return back()->with('success', 'Notification preferences updated successfully.');
    }
}