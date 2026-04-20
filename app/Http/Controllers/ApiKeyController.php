<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tokens = $user->tokens()->orderBy('created_at', 'desc')->get()->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'token' => Crypt::decryptString($token->hashed_key) ?? "Unavailable",
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_live' => $token->environment === 'live',
            ];
        });

        return Inertia::render('developers/api-keys', [
            'keys' => $tokens,
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
