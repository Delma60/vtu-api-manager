<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BotSession;
use App\Models\Business;
use App\Models\Provider;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // app/Http/Controllers/SuperAdmin/DashboardController.php

public function index()
    {
        // 1. Top Level Metrics
        $metrics = [
            // Aggregate all successful transactions across ALL businesses today
            'totalPlatformVolume' => number_format(Transaction::where('status', 'successful')->whereDate('created_at', today())->sum('amount'), 2),
            'activeBusinesses' => Business::where('is_active', true)->count(),
            'totalSimhosts' => Provider::count(),
            'activeBots' => BotSession::where('is_active', true)->count(), 
        ];

        // 2. Simhost/Provider Health
        $simhostHealth = Provider::where("meta->meta_author", "simhost")->orderBy('priority')
            ->take(5)
            ->get()
            ->map(function ($host) {
                // Map only the necessary data to the frontend to keep the payload clean and secure
                return [
                    'id' => $host->id,
                    'name' => $host->name,
                    'is_active' => $host->is_active,
                    'cached_balance' => $host->cached_balance,
                    'success_rate_7d' => $host->success_rate_7d,
                ];
            });

        // 3. Top Businesses by Volume (Aggregation, NO raw transactions exposed)
        $topBusinesses = Business::withSum(['transactions' => function ($query) {
                $query->where('status', 'successful')->whereDate('created_at', today());
            }], 'amount')
            ->orderByDesc('transactions_sum_amount')
            ->take(5)
            ->get()
            ->map(function ($business) {
                return [
                    'id' => $business->id,
                    'name' => $business->name,
                    'status' => $business->is_active ? 'active' : 'suspended',
                    'volume' => number_format($business->transactions_sum_amount ?? 0, 2),
                ];
            });

        // 4. System Alerts (Mocked for now, but you could pull from an api_logs or notifications table)
        $systemAlerts = [
            ['id' => 1, 'type' => 'warning', 'message' => 'Simhost MTN-NG balance below ₦5,000 threshold.', 'time' => '10 mins ago'],
            ['id' => 2, 'type' => 'critical', 'message' => 'Airtel API endpoint timing out consistently.', 'time' => '1 hour ago'],
            ['id' => 3, 'type' => 'info', 'message' => 'New tenant "TechGlobal" successfully onboarded.', 'time' => '3 hours ago'],
        ];

        return Inertia::render('super-admin/dashboard', [
            'metrics' => $metrics,
            'simhostHealth' => $simhostHealth,
            'topBusinesses' => $topBusinesses,
            'systemAlerts' => $systemAlerts,
        ]);
    }
}