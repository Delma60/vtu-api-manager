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
        //
        $user = $request->user();
        
        // Fetch Sanctum tokens for the user
        $tokens = $user->tokens()->orderBy('created_at', 'desc')->get()->map(function ($token) use($user) {
            Log::info($token);
            return [
                'id' => $token->id,
                'name' => $token->name,
                
                'token' => 'sk_' . ($user->business->mode === 'live' ? 'live' : 'test') . '_' . $user->id . "|" . $token->token, 
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_live' => $user->business->mode === 'live', // Assuming mode is tracked on Business model
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
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();
        
        $newToken = $user->createToken($request->name);
        
        // 2. Grab the correct prefix
        $prefix = $user->business->mode === 'live' ? 'sk_live_' : 'sk_test_';

        // 3. Prepend the prefix to the native plain text token
        // $newToken->plainTextToken already looks like "1|random40characterstring"
        $apiKey = $prefix . $newToken->plainTextToken;
        
        return redirect()->back()->with('success', "API Key created successfully. Your key is: " . $apiKey . " (Copy this now, you won't be able to see it again.)");
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
