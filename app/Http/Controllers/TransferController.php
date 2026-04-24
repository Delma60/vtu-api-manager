<?php

namespace App\Http\Controllers;

use App\Class\PaymentProvider\Payment;
use App\Models\Customer;
use App\Models\SystemSetting;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Log;

class TransferController extends Controller
{
    

    public function index(Request $request)
    {
        $user = $request->user();

        // Get transfers from the last 30 days
        $recentTransfers = Transaction::where('business_id', $user->business_id)
            ->whereIn('transaction_type', ['transfer_out', 'payout', 'debit'])
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->get();

        // Get Beneficiaries (For now, your wallet customers. You can expand to saved banks later)
         $beneficiaries = Customer::with('wallet')
            ->select('id', 'name', 'email')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'wallet_balance' => $customer->wallet?->balance ?? 0,
                ];
            });

        return Inertia::render('transfers/index', [
            'transfers' => $recentTransfers,
            'beneficiaries' => $beneficiaries,
            'walletBalance' => $user->wallet->balance ?? 0,
        ]);
    }

    // 2. Handles the "Select Type" page AND the "Transfer Form" page
    public function create(Request $request)
    {
        $type = $request->query('type');
        $user = $request->user();

        // If no type is selected yet, show the Selection Page
        if (!$type) {
            return Inertia::render('transfers/select', [
                'walletBalance' => $user->wallet->balance ?? 0,
            ]);
        }

        $setting = [
            'bank' => [
                'value' => SystemSetting::getKeyValue("site_name", 0),
                'type' => SystemSetting::getKeyValue("bank_transfer_charge_type", 'fixed'),
            ],
            'wallet' => [
                'value' => SystemSetting::getKeyValue("wallet_transfer_charge_value", 0),
                'type' => SystemSetting::getKeyValue("wallet_transfer_charge_type", 'fixed'),
            ],
        ];
        Log::info($setting);

        // If 'wallet' is selected, fetch customers and go to the form
        if ($type === 'wallet') {
            $customers = Customer::where('business_id', $user->business_id)
                ->select('id', 'name', 'email', 'wallet_balance')
                ->get();

            return Inertia::render('transfers/create', [
                'type' => 'wallet',
                'customers' => $customers,
                'walletBalance' => $user->wallet->balance ?? 0,
                'settings' => $setting,
            ]);
        }

        // If 'bank' is selected, fetch banks and go to the form
        if ($type === 'bank') {
            $banks = cache()->remember('flw_banks', 86400, function () {
                
                return Payment::banks();// : [];
            });

            return Inertia::render('transfers/create', [
                'type' => 'bank',
                'banks' => $banks,
                'walletBalance' => $user->wallet->balance ?? 0,
                'settings' => $setting,

            ]);
        }

        return redirect()->route('transfers.index')->with('error', 'Invalid transfer type.');
    }

    // 2. Resolve Bank Account Name
    public function resolveAccount(Request $request)
    {
        $request->validate([
            'account_number' => 'required|string|size:10',
            'account_bank' => 'required|string',
        ]);

        // Log::info('Resolving bank account:', $request->only(['account_number', 'account_bank']));

        $response = Payment::resolveBank([
                'account_number' => $request->account_number,
                'account_bank' => (int)$request->account_bank,
            ]);

        if ($response->successful()) {
            return response()->json(['success' => true, 'data' => $response->json()['data']]);
        }

        return response()->json(['success' => false, 'message' => 'Could not verify account number.'], 404);
    }

    // 3. Process the Transfer
    public function process(Request $request)
    {
        $request->validate([
            'transfer_type' => 'required|in:wallet,bank',
            'amount' => 'required|numeric|min:50',
            'narration' => 'nullable|string|max:100',
            
            // Wallet Specific
            'customer_id' => 'required_if:transfer_type,wallet',
            
            // Bank Specific
            'account_bank' => 'required_if:transfer_type,bank|string',
            'account_number' => 'required_if:transfer_type,bank|string|size:10',
        ]);

        try {
            if ($request->transfer_type === 'wallet') {
                return $this->processWalletTransfer($request);
            } else {
                return $this->processBankTransfer($request);
            }
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // --- PRIVATE HELPER METHODS ---

    private function processWalletTransfer(Request $request)
    {
        $user = $request->user();
        $amount = $request->amount;

        DB::transaction(function () use ($user, $request, $amount) {
            $tenantWallet = Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if ($tenantWallet->balance < $amount) {
                throw new Exception("Insufficient balance to fund this customer.");
            }

            $customer = Customer::where('id', $request->customer_id)
                ->where('business_id', $user->business_id)
                ->firstOrFail();

            // 1. Math
            $tenantWallet->balance -= $amount;
            $tenantWallet->save();

            $customerLocked = Customer::where('id', $customer->id)->lockForUpdate()->first();
            $customerLocked->wallet_balance += $amount;
            $customerLocked->save();

            $txRef = 'TRF-' . strtoupper(Str::random(12));

            // 2. Logging
            Transaction::create([
                'business_id' => $user->business_id,
                'user_id' => $user->id,
                'transaction_reference' => $txRef,
                'amount' => $amount,
                'type' => 'transfer_out',
                'status' => 'successful',
                'description' => "Funded Customer: {$customer->name}",
            ]);

            Transaction::create([
                'business_id' => $user->business_id,
                'customer_id' => $customer->id,
                'transaction_reference' => $txRef,
                'amount' => $amount,
                'type' => 'transfer_in',
                'status' => 'successful',
                'description' => $request->narration ?? "Wallet funded by Admin",
            ]);
        });

        return back()->with('success', "Successfully transferred ₦{$amount} to customer's wallet.");
    }

    private function processBankTransfer(Request $request)
    {
        $user = $request->user();
        $amount = $request->amount;
        $feeValue = SystemSetting::getKeyValue("bank_transfer_charge_value", 0);
        $feeType = SystemSetting::getKeyValue("bank_transfer_charge_type", 'fixed');
        $fee = $feeType === 'percentage' ? ($amount * ($feeValue / 100)) : $feeValue;
        $totalDeduction = $amount + $fee;

        DB::transaction(function () use ($user, $request, $amount, $totalDeduction, $fee) {
            $wallet = Wallet::where('user_id', $user->id)->lockForUpdate()->firstOrFail();

            if ($wallet->balance < $totalDeduction) {
                throw new Exception("Insufficient balance. You need ₦{$totalDeduction} (including ₦{$fee} fee).");
            }

            $wallet->balance -= $totalDeduction;
            $wallet->save();

            $txRef = 'EXT-' . strtoupper(Str::random(12));

            Transaction::create([
                'business_id' => $user->business_id,
                'user_id' => $user->id,
                'transaction_reference' => $txRef,
                'amount' => $amount,
                'fee' => $fee,
                'type' => 'payout',
                'status' => 'pending', 
                'description' => "Bank Transfer to {$request->account_number} ({$request->narration})",
            ]);

         $response = Payment::transfer([
                    'account_bank' => $request->account_bank,
                    'account_number' => $request->account_number,
                    'amount' => $amount,
                    'narration' => $request->narration ?? 'Wallet Withdrawal',
                    'currency' => 'NGN',
                    'reference' => $txRef,
                    'callback_url' => route('webhook.flutterwave'),
                    'debit_currency' => 'NGN'
                ]);// : [];

            if (!$response->successful()) {
                throw new Exception("Gateway error: " . ($response->json()['message'] ?? 'Transfer failed.'));
            }
        });

        return back()->with('success', 'Bank transfer initiated. It will be processed shortly.');
    }
}