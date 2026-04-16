<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Transaction;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q', '');
        $businessId = auth()->user()->business_id;

        $results = [];

        if (strlen($query) > 2) { // Minimum 3 chars
            // Search Transactions
            $transactions = Transaction::where('business_id', $businessId)
                ->where(function ($q) use ($query) {
                    $q->where('reference', 'like', "%{$query}%")
                      ->orWhere('destination', 'like', "%{$query}%")
                      ->orWhere('amount', 'like', "%{$query}%");
                })
                ->with('user')
                ->limit(10)
                ->get();

            foreach ($transactions as $transaction) {
                $results[] = [
                    'type' => 'transaction',
                    'id' => $transaction->id,
                    'title' => 'Transaction ' . $transaction->reference,
                    'description' => $transaction->destination . ' - ' . $transaction->amount,
                    'url' => route('transactions.show', $transaction->reference),
                ];
            }

            // Search Customers
            $customers = Customer::where('business_id', $businessId)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('email', 'like', "%{$query}%")
                      ->orWhere('phone', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();

            foreach ($customers as $customer) {
                $results[] = [
                    'type' => 'customer',
                    'id' => $customer->id,
                    'title' => $customer->name,
                    'description' => $customer->email . ' - ' . $customer->phone,
                    'url' => route('customers.show', $customer->id),
                ];
            }
        }

        return response()->json($results);
    }
}