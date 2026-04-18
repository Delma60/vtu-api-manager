<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ApiMetric;
use App\Models\Provider;
use App\Models\Transaction;
use App\Services\MetricsService;
use App\Services\ProviderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected MetricsService $metricsService;

    public function __construct(MetricsService $metricsService)
    {
        $this->metricsService = $metricsService;
    }

    public function index(Request $request)
    {
        $business = $request->user()->business;
        $today = now()->toDateString();

        $metrics = [
            'totalBalance' => (float) ProviderService::sumAllBalances(),
            'todayVolume' => (int) ApiMetric::where('business_id', $business->id)
                ->where('period_type', 'daily')
                ->where('period_date', $today)
                ->sum('total_requests'),
            'successRate' => (float) $this->metricsService->getAggregatedSuccessRate(
                business: $business,
                days: 7,
            )['success_rate_raw'] ?? 0,
            'activeProviders' => (int) Provider::where('is_active', true)->count(),
            'totalProviders' => (int) Provider::count(),
            'hourlyVolume' => (int) ApiMetric::where('business_id', $business->id)
                ->where('period_type', 'hourly')
                ->where('period_date', $today)
                ->sum('total_requests'),
        ];

        $providerHealth = Provider::with('transactions')
            ->orderBy('name')
            ->get()
            ->map(function (Provider $provider) {
                return [
                    'name' => $provider->name,
                    'status' => $provider->connection ? 'operational' :($provider->is_active ? 'degraded' : 'offline'),
                    'latency' => 0,
                ];
            })
            ->take(5)
            ->all();

        $recentTransactions = Transaction::with('provider')
            ->latest()
            ->take(5)
            ->get()
            ->map(function (Transaction $transaction) {
                return [
                    'reference' => $transaction->reference,
                    'network' => $transaction->network,
                    'destination' => $transaction->destination,
                    'amount' => (float) $transaction->amount,
                    'status' => $transaction->status === 'successful' ? 'success' : $transaction->status,
                    'time' => $transaction->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'providerHealth' => $providerHealth,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
