<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Transaction::query()
            // Removed ->with('provider') because provider is now a string column, not a relationship
            ->orderBy('created_at', 'desc');

        // Apply Filters if they exist in the request
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('transaction_reference', 'like', "%{$search}%")
                  ->orWhere('payment_reference', 'like', "%{$search}%")
                  ->orWhere('account_or_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            // strictly 'pending', 'success', or 'fail'
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('provider')) {
            $query->where('provider', $request->input('provider'));
        }

        return Inertia::render('transactions/index', [
            // Using Laravel's built-in pagination
            'transactions' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'provider', 'date_range'])
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
    public function store(StoreTransactionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($reference)
    {
        // 1. Fetch the transaction by its public reference
        $transaction = Transaction::where('transaction_reference', $reference)
            ->firstOrFail();

        // Safely decode the response_message (if it's saved as a JSON string)
        $metaData = is_string($transaction->response_message)
            ? json_decode($transaction->response_message, true)
            : $transaction->response_message;

        // If json_decode fails (meaning it's just a raw text message), wrap it in an array
        if (json_last_error() !== JSON_ERROR_NONE && is_string($transaction->response_message)) {
            $metaData = ['response' => $transaction->response_message];
        }

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
            'metaData' => $metaData ?? [
                'request' => 'No data recorded.',
                'response' => 'No data recorded.'
            ],
            // Formatting dates in PHP is often cleaner than doing it in JS
            'formattedDate' => $transaction->created_at->format('M d, Y - H:i:s A')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
