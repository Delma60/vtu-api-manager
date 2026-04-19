<?php

namespace App\Http\Controllers;

use App\Models\PaymentLink;
use App\Http\Requests\StorePaymentLinkRequest;
use App\Http\Requests\UpdatePaymentLinkRequest;
use App\Models\CablePlan;
use App\Models\DataPlan;
use App\Models\Network;
use App\Models\NetworkType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PaymentLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $links = PaymentLink::latest()->get();

        return Inertia::render('payment-links/index', [
            'paymentLinks' => $links,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $networks = Network::with("networkTypes")->orderBy('name')->get();
        $dataPlans = DataPlan::orderBy('plan_name')->get();
        $cablePlans = CablePlan::orderBy('plan_name')->get();
        $cableNetworks = NetworkType::where('type', 'cable')->orderBy('name')->get();
            return Inertia::render('payment-links/create', [
                'networks' => $networks,
                'dataPlans' => $dataPlans,
                'cablePlans' => $cablePlans,
                'cableNetworks' => $cableNetworks,
            ]);

        // return Inertia::render('payment-links/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentLinkRequest $request)
    {
        //
        $validated = $request->validated();
        $link = PaymentLink::create([
            'business_id' => $request->user()->business_id,
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'customer_name' => $validated['customer_name'] ?? null,
            'customer_email' => $validated['customer_email'] ?? null,
            'is_reusable' => $validated['is_reusable'] ?? false,
            'tx_ref' => 'PL_' . strtoupper(Str::random(12)),
        ]);

        return back()->with('success', 'Payment link created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentLink $paymentLink)
    {
        //
        $paymentLink->load('business:id,name,business_name');

        // If it's a one-time link and already paid, don't allow payment again
        if (!$paymentLink->is_reusable && $paymentLink->status === 'successful') {
            return abort(403, 'This payment link has already been paid.');
        }

        return Inertia::render('pay/show', [
            'paymentLink' => $paymentLink,
            'merchant' => $paymentLink->user->business_name ?? $paymentLink->user->name
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PaymentLink $paymentLink)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentLinkRequest $request, PaymentLink $paymentLink)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentLink $paymentLink)
    {
        //
    }

    public function verify(Request $request, $id)
    {
        $paymentLink = PaymentLink::findOrFail($id);

        // Example: Verify transaction ref from Flutterwave/Paystack here
        // If successful:

        $paymentLink->update(['status' => 'successful']);

        // Log transaction to your DB
        // ...

        return redirect()->back()->with('success', 'Payment completed successfully!');
    }
}
