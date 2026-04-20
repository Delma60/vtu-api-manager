<?php

namespace App\Http\Controllers;

use App\Models\PaymentLink;
use App\Http\Requests\StorePaymentLinkRequest;
use App\Http\Requests\UpdatePaymentLinkRequest;
use App\Models\CablePlan;
use App\Models\DataPlan;
use App\Models\Network;
use App\Models\NetworkType;
use App\Models\Transaction;
use App\Notifications\PaymentSuccessful;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            'tx_ref' => !$validated['is_reusable'] && Transaction::generateTransactionId(),
        ]);

        return back()->with('success', 'Payment link created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentLink $paymentLink)
    {
        $paymentLink->load('business.owner');
      
        if ($paymentLink->is_reusable == 0 && $paymentLink->status === 'successful') {
            return abort(403, 'This payment link has already been paid.');
        }

        return Inertia::render('checkout/pay', [
            'paymentLink' => $paymentLink,
            'merchant' => $paymentLink->business?->owner?->name ?? $paymentLink->business?->name ?? 'Unknown Merchant'
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


        $paymentLink->update(['status' => 'successful']);

        // Log transaction to your DB
        // ...

        return redirect()->back()->with('success', 'Payment completed successfully!');
    }

    public function pay(){
    
    }

    public function paymentSuccess(Request $request, PaymentLink $paymentLink, TransactionService $transactionService)
    {
        $data = $request->validate([
            "tx_ref" => ['nullable', 'string'],
        ]);
        // Handle successful payment callback
        $paymentLink->load("business.owner");
        // The callback may provide tx_ref as a route segment or query parameter.
        $tx_ref = $data['tx_ref'] ?? $request->query('tx_ref');
        $transaction  = Transaction::where('transaction_reference', $tx_ref)->first();

        if (!$transaction) {
            Log::warning("Transaction not found for tx_ref: {$tx_ref}");
            return abort(404, 'Transaction not found');
        }

        $transactionService->markAsSuccessful($transaction, [
            'message' => 'Payment completed successfully via callback.',
        ]);

        $paymentLink->updateStatus("successful");

        // notify owner
        $paymentLink->business->owner->notify(new PaymentSuccessful($paymentLink));

        return Inertia::render('pay/success', [
            'paymentLink' => $paymentLink,
            'tx_ref' => $tx_ref,
        ]);
    }

    public function paymentFailed(Request $request, PaymentLink $paymentLink, $tx_ref = null)
    {
        // Handle failed payment callback
        
        return Inertia::render('pay/failed', [
            'paymentLink' => $paymentLink,
            'tx_ref' => $tx_ref,
        ]);
    }
}
