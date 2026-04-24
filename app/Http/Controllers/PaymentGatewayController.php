<?php

namespace App\Http\Controllers;

use App\Class\Payment\PaymentFactory;
use App\Models\PaymentGateway;
use App\Http\Requests\StorePaymentGatewayRequest;
use App\Http\Requests\UpdatePaymentGatewayRequest;
use App\Models\PaymentLink;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
                'logo_url' => $gateway->logo_image,
                'base_url' => $gateway->base_url,
                'api_key' => $gateway->api_key,
                'api_secret' => $gateway->api_secret,
                'connected' => $gateway->connected,
                'is_active' => (bool) $gateway->is_active,
                'is_default' => (bool) $gateway->is_default,
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

    public function checkout(Request $request, PaymentLink $paymentLink, TransactionService $transactionService){
        $data = $request->validate([
            "amount" => ['required', 'numeric', 'min:0.01'],
            "customer_name" => ['required', 'string'],
            "customer_email" => ['required', 'email'],
            "description" => ['nullable', 'string'],
        ]);
        
        try {
            # code...
            $default_provider = PaymentGateway::default();
            $paymentLink->load('business.owner');
            $reference = $paymentLink->tx_ref ?? Transaction::generateTransactionId();

            $transactionService->initializeCheckout($paymentLink->business->owner, [
                'provider' => $default_provider->code,
                'transaction_reference' => $reference,
                'platform' => 'web',
                'transaction_type' => 'payment_link',
                'account_or_phone' => $data['customer_email'],
                'amount' => $data['amount'],
                'description' => $data['description'] ?? null,
            ]);

            $data['paymentLink'] = $paymentLink->id;
            $data['transaction_reference'] = $reference;
            $data['redirect_url'] = route('pay.success', ['paymentLink' => $data['paymentLink'], 'tx_ref' => $data['transaction_reference']]);

            $provider = PaymentFactory::make($default_provider)->checkout($data);
            return Inertia::location($provider['checkout_url']);
        } catch (\Throwable $e) {
            # code...\
            Log::error("Checkout error", ['error' => $e]);
            return back()->with('error', 'An error occurred during checkout. Please try again.');
        }
    }
}
