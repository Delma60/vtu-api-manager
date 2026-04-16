<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Transaction;
use App\Models\Provider;
use App\Models\Network;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Perform a global search across multiple entities.
     */
    public function index(Request $request)
    {
        $query = trim($request->get('q', ''));

        if (strlen($query) < 3) {
            return response()->json([]);
        }

        $results = collect();

        $transactions = Transaction::with(['user', 'provider'])
            ->where(function ($q) use ($query) {
                $q->where('reference', 'like', "%{$query}%")
                  ->orWhere('vendor_reference', 'like', "%{$query}%")
                  ->orWhere('destination', 'like', "%{$query}%")
                  ->orWhere('status', 'like', "%{$query}%")
                  ->orWhere('amount', 'like', "%{$query}%")
                  ->orWhereHas('user', function ($q) use ($query) {
                      $q->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%");
                  })
                  ->orWhereHas('provider', function ($q) use ($query) {
                      $q->where('name', 'like', "%{$query}%");
                  });
                  
            })
            ->limit(6)
            ->get()
            ->map(fn ($t) => [
                'type' => 'transaction',
                'id' => $t->id,
                'title' => "Transaction: {$t->reference}",
                'description' => trim(implode(' • ', [
                    $t->destination,
                    '₦' . number_format($t->amount, 2),
                    ucfirst($t->status),
                ])),
                'url' => route('transactions.show', $t->reference),
            ]);

        $customers = Customer::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%")
                  ->orWhere('phone', 'like', "%{$query}%");
            })
            ->limit(5)
            ->get()
            ->map(fn ($c) => [
                'type' => 'customer',
                'id' => $c->id,
                'title' => $c->name,
                'description' => "Customer: {$c->email} • {$c->phone}",
                'url' => route('customers.show', $c->id),
            ]);

        $providers = Provider::where('name', 'like', "%{$query}%")
            ->limit(4)
            ->get()
            ->map(fn ($p) => [
                'type' => 'provider',
                'id' => $p->id,
                'title' => "Provider: {$p->name}",
                'description' => $p->is_active ? 'Active provider' : 'Inactive provider',
                'url' => route('providers.show', $p->id),
            ]);

        $networks = Network::where('name', 'like', "%{$query}%")
            ->limit(3)
            ->get()
            ->map(fn ($n) => [
                'type' => 'network',
                'id' => $n->id,
                'title' => "Network: {$n->name}",
                'description' => "Network code: {$n->code}",
                'url' => route('networks.show', $n->id),
            ]);

        return response()->json($results->concat($transactions)->concat($customers)->concat($providers)->concat($networks));
    }
}