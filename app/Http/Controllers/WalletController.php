<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use App\Models\FundingTransaction;
use Illuminate\Http\Request;
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

        // Fetch dedicated virtual accounts assigned to this user
        // e.g., [['bank' => 'Providus', 'account_number' => '9901234567', 'name' => 'Nexus - Acme Corp']]
        $virtualAccounts = $user->virtualAccounts; 

        // Fetch only funding events (deposits, bonuses, manual credits)
        $fundingHistory = FundingTransaction::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('wallets/index', [
            'wallet' => [
                'balance' => $wallet->balance,
                'total_funded' => $wallet->total_funded,
                'currency' => 'NGN',
                'auto_recharge_enabled' => $wallet->auto_recharge_enabled,
                'low_balance_threshold' => $wallet->low_balance_threshold,
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
}
