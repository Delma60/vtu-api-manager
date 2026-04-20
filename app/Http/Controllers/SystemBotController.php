<?php

namespace App\Http\Controllers;

use App\Models\SystemBot;
use App\Http\Requests\StoreSystemBotRequest;
use App\Http\Requests\UpdateSystemBotRequest;
use Inertia\Inertia;

class SystemBotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $bots = SystemBot::latest()->get()->map(function ($bot) {
            return [
                'id' => $bot->id,
                'name' => $bot->name,
                'platform' => $bot->platform,
                'credentials' => $bot->credentials,
                'is_active' => $bot->is_active,
                'created_at' => $bot->created_at->format('M d, Y'),
            ];
        });

        return Inertia::render('super-admin/bots/index', [
            'bots' => $bots,
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
    public function store(StoreSystemBotRequest $request)
    {
        //
        $validated = $request->validated();

        SystemBot::create([
            'name' => $validated['name'],
            'platform' => $validated['platform'],
            'credentials' => $validated['credentials'],
            'is_active' => true,
        ]);

        return back()->with('success', ucfirst($validated['platform']) . ' Bot configured successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SystemBot $systemBot)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SystemBot $systemBot)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSystemBotRequest $request, SystemBot $systemBot)
    {
        //
    }

    public function toggleStatus(SystemBot $bot)
    {
        $bot->update(['is_active' => !$bot->is_active]);
        return back()->with('success', "Bot has been " . ($bot->is_active ? 'activated' : 'disabled') . ".");
    }

    public function destroy(SystemBot $bot)
    {
        $bot->delete();
        return back()->with('success', 'Bot configuration deleted.');
    }
}
