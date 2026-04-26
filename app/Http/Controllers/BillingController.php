<?php

namespace App\Http\Controllers;

use App\Class\PaymentProvider\PaymentFactory;
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
        $request->validate(['package_id' => 'required|exists:packages,id,is_active,1']);

        $business = $request->user()->business;
        $package = Package::find($request->package_id);

        if ($package->price == 0) {
            // Prevent immediate downgrade if they have active premium time remaining
            if ($business->subscription_ends_at && $business->subscription_ends_at->isFuture()) {
                return back()->with('error', 'You still have an active premium subscription. Please wait until it expires to switch to the free plan.');
            }

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

        // 1. Fetch the trusted subscription attempt from YOUR database
        $pendingSubscription = DB::table('subscription_payments')
            ->where('reference', $tx_ref)
            ->first();

        if (!$pendingSubscription) {
            abort(404, 'Subscription record not found.');
        }

        if ($status !== 'successful' && $status !== 'completed') {
            // Update subscription_payments status to 'failed'
            DB::table('subscription_payments')->where('id', $pendingSubscription->id)->update(['status' => 'failed']);
            return redirect()->route('billing.index')->with('error', 'Payment failed.');
        }

        $transaction = \App\Models\Transaction::withoutGlobalScopes()
            ->where('transaction_reference', $tx_ref)->firstOrFail();

        // Prevent double processing
        if ($transaction->status === 'successful') {
            return redirect()->route('settings.billing.index')->with('success', 'Subscription is already active.');
        }

        // 2. IMPORTANT: Ensure transactionService actually queries the gateway
        // to verify the exact AMOUNT paid matches $pendingSubscription->amount.
        $transactionService->markAsSuccessful($transaction, [
            'message' => 'Subscription payment completed successfully.',
        ]);

        // 3. Apply the package from the database record, NOT the URL
        $package = Package::findOrFail($pendingSubscription->package_id);
        $business = $request->user()->business;

        $currentExpiration = $business->subscription_ends_at;

        // If they have an active sub, add to it. Otherwise, start from now.
        $startDate = ($currentExpiration && $currentExpiration->isFuture())
            ? $currentExpiration
            : now();

        $business->update([
            'package_id' => $package->id,
            'subscription_ends_at' => $package->billing_cycle === 'yearly' ? $startDate->copy()->addYear() : $startDate->copy()->addMonth(),
            'subscription_status' => 'active',
        ]);

        // 4. Update the subscription_payments table status to 'successful'
        DB::table('subscription_payments')->where('id', $pendingSubscription->id)->update(['status' => 'successful']);

        return redirect()->route('settings.billing.index')->with('success', "Successfully activated your {$package->name} subscription!");
    }
}
