<?php

namespace App\Http\Controllers;

use App\Models\Settlement;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettlementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Assuming the logged-in user belongs to a business/tenant which has a wallet
        $wallet = Wallet::where('user_id', auth()->id())->firstOrFail();

        // Get paginated settlements for this wallet
        $settlements = Settlement::where('wallet_id', $wallet->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Find the next upcoming settlement
        $nextSettlement = Settlement::where('wallet_id', $wallet->id)
            ->where('is_settled', false)
            ->orderBy('settles_at', 'asc')
            ->first();

        return Inertia::render('settlements/index', [
            'balances' => [
                'available' => $wallet->balance,
                'pending'   => $wallet->pending_balance,
            ],
            'nextSettlement' => $nextSettlement ? [
                'amount'     => $nextSettlement->amount,
                'settles_at' => $nextSettlement->settles_at->diffForHumans(),
                'exact_date' => $nextSettlement->settles_at->format('M d, Y h:i A')
            ] : null,
            'settlements' => $settlements
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Settlement $settlement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Settlement $settlement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Settlement $settlement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Settlement $settlement)
    {
        //
    }
}
