<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use App\Models\Provider;
use App\Models\SystemSetting;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Services\MetricsService;
use App\Services\ProviderService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        $user = $request->user();
        $today = now()->toDateString();
        $range = $request->input('range', '7days');

        $range = match($range) {
            '24h' => '24hours',
            '7days' => '7days',
            '30days' => '30days',
            default => '7days'
        };

        $currentMonth = now()->format('Y-m');
        $cacheKey = "api_usage_{$business->id}_{$currentMonth}";
        $apiUsage = Cache::get($cacheKey, 0);
        $apiLimit = $business->package?->settings['monthly_api_limit'] ?? 0;

        // 2. Wallet Balance
        // (Assuming the tenant's wallet is tied to the User model. If it's tied to the Business, change to $business->wallet->balance)
        $walletBalance = (Wallet::whereUserId($user->id)->first()->balance ?? 0);

        $metrics = [
            'totalBalance' => (float) ProviderService::sumAllBalances(),
            'todayVolume' => (int) ApiLog::where('business_id', $business->id)
                ->whereDate('created_at', $today)
                ->count(),
            'successRate' => (float) $this->metricsService->getAggregatedSuccessRate(
                business: $business,
                days: 7,
            )['success_rate_raw'] ?? 0,
            'activeProviders' => (int) Provider::where('is_active', true)->count(),
            'totalProviders' => (int) Provider::count(),
            // should be the sum of api request within the hour, not the sum of hourly metrics because some requests may not have been aggregated into the hourly metrics yet
            'hourlyVolume' => (int) ApiLog::where('business_id', $business->id)
                ->where('created_at', '>=', now()->startOfHour())
                ->count(),
            'availableBalance' => (float) $walletBalance,
            'monthlyApiUsage' => [
                'usage' => (int) $apiUsage,
                'limit' => (int) $apiLimit,
            ],
            
        ];

        $providerHealth = Provider::orderBy('name')
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
            ->get();
            

            // Build volume chart data with aggregation by interval
        $volumeChartData = $this->getAggregatedVolumeData($business->id, $range);


        
        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'providerHealth' => $providerHealth,
            'recentTransactions' => $recentTransactions,
            'volumeChartData' => $volumeChartData,
            'settings' => [
                "low_balance_threshold" => SystemSetting::getKeyValue("low_balance_threshold", 5000)
            ]
        ]);
    }
    // toggleMode
    public function toggleMode(Request $request)
    {
        $user = $request->user();
        $business = $user->business;
        $business->mode = $business->mode === 'live' ? 'test' : 'live';
        $business->save();

        return back()->with('success', 'Mode toggled successfully.');
    }

    private function getAggregatedVolumeData(int $businessId, string $range): array
    {
        $data = [];
        
        if ($range === '24hours') {
            // Group by hour for the past 24 hours from Transaction table
            $transactions = Transaction::whereHas('business', fn($q) => $q->where('id', $businessId))
                ->where('created_at', '>=', now()->subHours(24))
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy(fn($t) => $t->created_at->format('H:00'))
                ->map(function ($group) {
                    return [
                        'date' => $group->first()->created_at->format('H:i'),
                        'requests' => (int) $group->count(),
                        'success' => (int) $group->where('status', 'successful')->count()
                    ];
                })
                ->values()
                ->all();
            $data = $transactions;
        } elseif ($range === '30days') {
            // Group by day for the past 30 days from Transaction table
            $transactions = Transaction::whereHas('business', fn($q) => $q->where('id', $businessId))
                ->where('created_at', '>=', now()->subDays(30))
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy(fn($t) => $t->created_at->toDateString())
                ->map(function ($group) {
                    return [
                        'date' => Carbon::parse($group->first()->created_at)->format('M d'),
                        'requests' => (int) $group->count(),
                        'success' => (int) $group->where('status', 'successful')->count()
                    ];
                })
                ->values()
                ->all();
            $data = $transactions;
        } else {
            // Default to 7 days, group by day from Transaction table
            $transactions = Transaction::whereHas('business', fn($q) => $q->where('id', $businessId))
                ->where('created_at', '>=', now()->subDays(7))
                ->orderBy('created_at', 'asc')
                ->get()
                ->groupBy(fn($t) => $t->created_at->toDateString())
                ->map(function ($group) {
                    return [
                        'date' => Carbon::parse($group->first()->created_at)->format('M d'),
                        'requests' => (int) $group->count(),
                        'success' => (int) $group->where('status', 'successful')->count()
                    ];
                })
                ->values()
                ->all();
            $data = $transactions;
        }

        return $data;
    }
}
