<?php

namespace App\Http\Controllers;

use App\Models\Webhook;
use App\Http\Requests\StoreWebhookRequest;
use App\Http\Requests\UpdateWebhookRequest;
use Illuminate\Support\Str;

use Inertia\Inertia;

class WebhookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $webhooks = Webhook::orderBy('created_at', 'desc')->get();

        return Inertia::render('developers/webhook', [
            'webhooks' => $webhooks,
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
    public function store(StoreWebhookRequest $request)
    {
        //
        $request->validated();

        // Generate a secure signing secret (similar to Stripe's whsec_ prefix)
        $secret = 'whsec_' . Str::random(32);

        Webhook::create([
            'business_id' => $request->user()->business_id,
            'url' => $request->url,
            'secret' => $secret,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Webhook endpoint added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Webhook $webhook)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Webhook $webhook)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWebhookRequest $request, Webhook $webhook)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Webhook $webhook)
    {
        //
    }
}
