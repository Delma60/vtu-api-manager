<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Fetch Sanctum tokens for the user
        $tokens = $user->tokens()->orderBy('created_at', 'desc')->get()->map(function ($token) use($user) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'token' => $token->plain_text_token ?? '••••••••••••••••••••••••••••••••',
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_live' => $user->business->mode === 'live',
            ];
        });

        return Inertia::render('developers/api-keys', [
            'keys' => $tokens,
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
    public function store(Request $request)
    {
        // 1. Validate the request. Ensure 'name' is provided.
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // 2. Safely retrieve the validated input string
        $keyName = trim($request->input('name', 'API Key'));

        try {
            // 3. Use Sanctum's createToken method which handles token creation properly
            $newToken = $user->createToken($keyName);
            
            // 4. Get the plain text token (format: "id|hash")
            $plainToken = $newToken->plainTextToken;
            
            // 5. Grab the correct prefix based on business mode
            $prefix = $user->business->mode === 'live' ? 'sk_live_' : 'sk_test_';
            
            // 6. Create the final API key with custom prefix
            $apiKey = $prefix . $plainToken;
            
            return redirect()->back()
                ->with('success', "API Key created successfully. Your key is: {$apiKey} (Copy this now, you won't be able to see it again.)");
        } catch (\Throwable $e) {
            Log::error('Failed to create API token', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);
            return redirect()->back()->with('error', 'Failed to create API key. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        //
        $request->user()->tokens()->where('id', $id)->delete();

        return redirect()->back()->with('success', 'API Key revoked successfully.');
    }
}
