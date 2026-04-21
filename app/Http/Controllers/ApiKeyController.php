<?php

namespace App\Http\Controllers;

use App\Services\ApiKeyManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    public function index(Request $request)
    {
        $businessId = auth()->user()->business_id;
        $apiKeys = ApiKeyManager::getTokensForBusiness($businessId);

        return Inertia::render('developers/api-keys', [
            'keys' => $apiKeys,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();
        $keyName = trim($request->input('name', 'API Key'));

        // Determine the environment mode
        $mode = $user->business->mode === 'live' ? 'live' : 'test';

        try {
            $newToken = $user->createToken($keyName);

            return redirect()->back()
                ->with('success', "API Key created successfully. Your new key is ready to use.");
        } catch (\Throwable $e) {
            Log::error('Failed to create API token', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            return redirect()->back()->with('error', 'Failed to create API key. Please try again.');
        }
    }

    public function destroy(Request $request, string $id)
    {
        $request->user()->tokens()->where('id', $id)->delete();
        return redirect()->back()->with('success', 'API Key revoked successfully.');
    }
}
