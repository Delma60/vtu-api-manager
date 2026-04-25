<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DataPlan;
use App\Models\Network;
use App\Models\Provider;
use App\Models\SystemSetting;
use App\Models\Transaction;
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
        $app_name = SystemSetting::getKeyValue("app_name", 'Laravel', [ 'ignore-scopes' => true ]);

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

        $docs = collect([
            [
                'type' => 'doc',
                'id' => 1,
                'title' => 'Docs: Introduction',
                'description' => "Read the {$app_name} introduction guide",
                'url' => route('docs.introduction'),
            ],
            [
                'type' => 'doc',
                'id' => 2,
                'title' => 'Docs: Quick Start',
                'description' => "Get started with {$app_name} quickly",
                'url' => route('docs.quick-start'),
            ],
            [
                'type' => 'doc',
                'id' => 3,
                'title' => 'Docs: Airtime & Data',
                'description' => 'Learn how to manage airtime and data',
                'url' => route('docs.airtime'),
            ],
            [
                'type' => 'doc',
                'id' => 4,
                'title' => 'Docs: Authentication',
                'description' => 'Understand API authentication',
                'url' => route('docs.authentication'),
            ],
            [
                'type' => 'doc',
                'id' => 5,
                'title' => 'Docs: API Keys',
                'description' => 'Learn how to manage API keys',
                'url' => route('docs.api-keys'),
            ],
        ])->filter(fn ($item) =>
            str_contains(strtolower($item['title']), strtolower($query)) ||
            str_contains(strtolower($item['description']), strtolower($query))
        );

        $dataPlans = DataPlan::where(function ($q) use($query) {
            $q->where('plan_name', 'like', "%{$query}%")
              ->orWhere('network', 'like', "%{$query}%")
              ->orWhere('plan_type', 'like', "%{$query}%")
              ->orWhere('plan_size', 'like', "%{$query}%");
            //   ->orWhere('price', 'like', "%{$query}%");
        })
            ->limit(4)
            ->get()
            ->map(fn ($d) => [
                'type' => 'data_plan',
                'id' => $d->id,
                'title' => "Data Plan: {$d->network}",
                'description' => '₦' . number_format($d->price, 2) . ' • ' . $d->plan_name,
                'url' => route('data-plans.show', $d->id),
            ]);

        return response()->json($results->concat($transactions)->concat($customers)->concat($providers)->concat($networks)->concat($docs)->concat($dataPlans));
    }
}