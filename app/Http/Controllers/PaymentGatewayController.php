<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Http\Requests\StorePaymentGatewayRequest;
use App\Http\Requests\UpdatePaymentGatewayRequest;

class PaymentGatewayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $gateways = PaymentGateway::latest()->get()->map(function ($gateway) {
            return [
                'id' => $gateway->id,
                'name' => $gateway->name,
                'code' => $gateway->code, // e.g., 'paystack', 'monnify'
                'logo_url' => $gateway->logo_url,
                'is_active' => (bool) $gateway->is_active,
                'tenant_count' => $gateway?->businesses()?->count() ?? 0, // Optional: How many tenants use this
                'created_at' => $gateway->created_at->format('M d, Y'),
            ];
        });

        return inertia('super-admin/gateways/index', [
            'gateways' => $gateways,
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
    public function store(StorePaymentGatewayRequest $request)
    {
        //
        $validated = $request->validated();
        PaymentGateway::create($validated);
        return back()->with('success', 'Payment Gateway added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentGateway $paymentGateway)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentGateway $paymentGateway)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentGatewayRequest $request, PaymentGateway $paymentGateway)
    {
        //
        $validated = $request->validated();

        $paymentGateway->update($validated);

        return back()->with('success', 'Payment Gateway updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentGateway $paymentGateway)
    {
        //
    }

    public function toggleStatus(PaymentGateway $paymentGateway)
    {
        $paymentGateway->update(['is_active' => !$paymentGateway->is_active]);
        
        return back()->with('success', "Gateway globally " . ($paymentGateway->is_active ? 'enabled' : 'disabled') . ".");
    }
}
