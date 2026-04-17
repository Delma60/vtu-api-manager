<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
            return [
                'id' => $token->id,
                'name' => $token->name,
                // In production, Laravel Sanctum ONLY shows the plain text token once upon creation. 
                // Since this UI handles toggling, we will rely on a custom attribute or just return the hash structure for demonstration.
                // *Note: If you have a custom api_keys table where you store keys symmetrically encrypted, you would decrypt them here.*
                'token' => 'sk_' . ($user->business->mode === 'live' ? 'live' : 'test') . '_' . hash('crc32', $token->token), 
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

        // Create Sanctum Token
        // You can attach abilities depending on user roles
        $token = $user->createToken($request->name, ['*']);

        // The plainTextToken is ONLY shown ONCE and must be used in API requests
        // Format: Authorization: Bearer {plainTextToken}
        // WARNING: The display version (sk_test_xxx) is for UI only, NOT for authentication
        $message = "✅ API Key created successfully!\n\n"
            . "🔐 Use THIS token in your API requests (shown only once):\n"
            . "Authorization: Bearer " . $token->plainTextToken . "\n\n"
            . "❌ DO NOT use the display version (sk_test_xxx) for authentication—it's just a reference.\n"
            . "📝 Store the token safely now, you won't see it again.";

        return redirect()->back()->with('success', $message);
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
