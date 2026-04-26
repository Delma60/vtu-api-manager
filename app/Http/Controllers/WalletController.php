<?php

namespace App\Http\Controllers;

use App\Class\PaymentProvider\PaymentFactory;
use App\Models\Wallet;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use App\Models\FundingTransaction;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $wallet = $user->wallet; // Assuming a 1-to-1 relationship

        // Create wallet if user doesn't have one
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => 0,
                'reserved' => 0,
                'total_funded' => 0,
                'total_used' => 0,
                'status' => 'active',
            ]);
        }

        // Fetch dedicated virtual accounts assigned to this user
        // e.g., [['bank' => 'Providus', 'account_number' => '9901234567', 'name' => 'Nexus - Acme Corp']]
        $virtualAccounts = $user->virtualAccounts; 

        // Fetch only funding events (deposits, bonuses, manual credits)
        $fundingHistory = FundingTransaction::where('transaction_type', ['wallet_funding', 'bonus_credit', 'manual_credit'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('wallets/index', [
            'wallet' => [
                'balance' => $wallet->balance,
                'total_funded' => $wallet->total_funded,
                'currency' => 'NGN',
                'auto_recharge_enabled' => $wallet->auto_recharge_enabled ?? false,
                'low_balance_threshold' => $wallet->low_balance_threshold ?? 0,
            ],
            'virtualAccounts' => $virtualAccounts,
            'fundingHistory' => $fundingHistory
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
    public function store(StoreWalletRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallet $wallet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wallet $wallet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalletRequest $request, Wallet $wallet)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wallet $wallet)
    {
        //
    }

    public function fund(Request $request, TransactionService $payment)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100', // Minimum NGN 100
        ]);

        $user = $request->user();
        $amount = $request->amount;
        $reference = 'FND-' . strtoupper(Str::random(12));

        $default_provider = PaymentGateway::default();

        $payment->initializeCheckout($user, [
            'business_id' => $user->business_id,
            'user_id' => $user->id,
            'transaction_reference' => $reference,
            'amount' => $amount,
            'type' => 'wallet_funding',
            'status' => 'pending',
            'description' => "Wallet Top-up via Gateway",
            'provider' => $default_provider->code,
            'account_or_phone' => $user->email ?? null,
            'transaction_type' => 'wallet_funding',
        ]);

        $provider = PaymentFactory::make($default_provider)->checkout([
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'amount' => $amount,
            // TODO:: #20 Env() Calls Outside Config Files - env() returns null after config:cache, use config() instead
            'description' => "Wallet Top-up for " . env('APP_NAME'),
            'transaction_reference' => $reference,
            'redirect_url' => route('wallet.fund.verify'),
        ]);

        if (isset($provider['checkout_url'])) {
            return Inertia::location($provider['checkout_url']);
        }

        return back()->with('error', 'Could not connect to payment gateway. Try again later.');
    }

    // 3. Verify Payment and Credit Wallet
    public function verify(Request $request)
    {
        $status = $request->query('status');
        $tx_ref = $request->query('tx_ref');
        $transaction_id = $request->query('transaction_id');

        if ($status !== 'successful' && $status !== 'completed') {
            return redirect()->route('dashboard')->with('error', 'Payment was cancelled or failed.');
        }

        // Find the pending transaction
        $transaction = Transaction::withoutGlobalScopes()->where('transaction_reference', $tx_ref)->first();

        if (!$transaction || $transaction->status === 'successful') {
            return redirect()->route('dashboard')->with('error', 'Invalid or already processed transaction.');
        }

        try {
            // Start a safe database lock to prevent double-funding bugs
            DB::transaction(function () use ($transaction, $request) {
                
                // 1. Mark Transaction as Successful
                $transaction->update(['status' => 'success']);

                // 2. Get or create wallet for user
                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $request->user()->id, 'environment' => $request->user()->business->mode],
                    [
                        'balance' => 0,
                        'reserved' => 0,
                        'total_funded' => 0,
                        'total_used' => 0,
                        'status' => 'active',
                    ]
                );

                // 3. Lock wallet and increment balance
                $wallet = Wallet::where('user_id', $request->user()->id)->lockForUpdate()->firstOrFail();
                $wallet->balance += $transaction->amount;
                $wallet->save();
            });

            return redirect()->route('dashboard')->with('success', "Successfully added ₦" . number_format($transaction->amount) . " to your wallet!");

        } catch (\Exception $e) {
            Log::error("Wallet funding verification failed: " . $e->getMessage());
            return redirect()->route('dashboard')->with('error', 'An internal error occurred while funding your wallet.');
        }

        // If it fails verification
        $transaction->update(['status' => 'failed']);
        return redirect()->route('dashboard')->with('error', 'Payment verification failed.');
    }
}
