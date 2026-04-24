<?php

namespace App\Http\Controllers;

use App\Class\Payment\PaymentFactory;
use App\Models\Package;
use App\Models\PaymentGateway;
use App\Models\User;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BillingController extends Controller
{
    //

    public function index(Request $request)
    {
        $business = $request->user()->business->load('package');
        $packages = Package::where('is_active', true)->get();

        return Inertia::render('settings/billing/index', [
            'currentBusiness' => $business,
            'packages' => $packages,
        ]);
    }

    public function subscribe(Request $request, TransactionService $payment)
    {
        // Validate request
        $request->validate(['package_id' => 'required|exists:packages,id']);

        $business = $request->user()->business;
        $package = Package::find($request->package_id);

        if ($package->price == 0) {
            $business->update([
                'package_id' => $package->id,
                'subscription_ends_at' => null,
                'subscription_status' => 'active',
            ]);
            return back()->with('success', "Successfully activated the {$package->name} plan!");
        }

        $reference = 'SUB-' . strtoupper(Str::random(10));

        // 1. Log the pending attempt in the database
        DB::table('subscription_payments')->insert([
            'business_id' => $business->id,
            'package_id' => $package->id,
            'reference' => $reference,
            'amount' => $package->price,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $default_provider = PaymentGateway::default();
        $adminUser = User::withoutGlobalScopes()->where("user_type", "admin")->first();
        $customer = auth()->user();

        $payment->initializeCheckout($adminUser, [
            'provider' => $default_provider->code,
            'transaction_reference' => $reference,
            'platform' => 'web',
            'transaction_type' => 'payment_link',
            'account_or_phone' => $customer->phone ?? null,
            'customer_email' => $customer->email,
            'amount' => $package->price,
            'description' => "Subscription payment for {$package->name} plan",
        ]);

        $provider = PaymentFactory::make($default_provider)->checkout([
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'amount' => $package->price,
            'description' => "Subscription payment for {$package->name} plan",
            'transaction_reference' => $reference,
            'redirect_url' => route('billing.verify', [
                'transaction' => $reference, 
                'package_id' => $package->id
            ]),
            // 'redirect_url' => route('pay.success', ['paymentLink' => '', 'transaction' => $reference, 'package_id' => $package->id, 'type' => 'subscription']),
        ]);

    
        


        if (isset($provider['checkout_url'])) {
            return Inertia::location($provider['checkout_url']);
        }

        return back()->with('success', "Successfully subscribed to {$package->name}!");
    }

    public function verify(Request $request, TransactionService $transactionService)
    {
        $status = $request->query('status');
        $tx_ref = $request->query('tx_ref') ?? $request->query('transaction');
        $package_id = $request->query('package_id');

        if ($status !== 'successful' && $status !== 'completed') {
            return redirect()->route('billing.index')->with('error', 'Payment was cancelled or failed.');
        }

        // Find the transaction you created via TransactionService
        $transaction = \App\Models\Transaction::withoutGlobalScopes()
        ->where('transaction_reference', $tx_ref)->firstOrFail();

        if ($transaction->status === 'successful') {
            return redirect()->route('settings.billing.index')->with('success', 'Subscription is already active.');
        }

        // Mark transaction as successful using your existing service
        $transactionService->markAsSuccessful($transaction, [
            'message' => 'Subscription payment completed successfully.',
        ]);

        // Apply the package to the Business Tenant
        $package = Package::findOrFail($package_id);
        $business = $request->user()->business;

        $business->update([
            'package_id' => $package->id,
            'subscription_ends_at' => $package->billing_cycle === 'yearly' ? now()->addYear() : now()->addMonth(),
            'subscription_status' => 'active',
        ]);

        return redirect()->route('settings.billing.index')->with('success', "Successfully activated your {$package->name} subscription!");
    }
}
