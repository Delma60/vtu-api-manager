<?php

namespace App\Http\Controllers;

use App\Models\ApiMetric;
use App\Models\Provider;
use App\Models\Service;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetricsController extends Controller
{
    protected MetricsService $metricsService;

    public function __construct(MetricsService $metricsService)
    {
        $this->metricsService = $metricsService;
    }

    /**
     * Display metrics dashboard
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $business = $user->business;

        // Get aggregated metrics for the past 30 days
        $overallMetrics = $this->metricsService->getAggregatedSuccessRate(
            business: $business,
            days: 30
        );

        // Get provider rankings
        $providerRankings = $this->metricsService->getRankedProviders(
            business: $business,
            periodType: 'daily',
            days: 30
        );

        // Get today's metrics
        $todayMetrics = ApiMetric::where('business_id', $business->id)
            ->where('period_date', now()->toDateString())
            ->where('period_type', 'daily')
            ->get();

        // Get weekly trends
        $weeklyTrends = ApiMetric::where('business_id', $business->id)
            ->where('period_type', 'daily')
            ->where('period_date', '>=', now()->subDays(7)->toDateString())
            ->orderBy('period_date', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'overallMetrics' => $overallMetrics,
            'providerRankings' => $providerRankings,
            'todayMetrics' => $todayMetrics,
            'weeklyTrends' => $weeklyTrends,
        ]);
    }

    /**
     * Get service type success rates
     */
    public function serviceTypeSuccessRate(Request $request)
    {
        $validated = $request->validate([
            'service_type' => 'required|string|in:airtime,data,cable,electricity,exam,bulksms,data_card,recharge_card',
            'period_type' => 'in:hourly,daily,weekly,monthly',
            'days' => 'integer|min:1|max:365',
        ]);

        $periodType = $validated['period_type'] ?? 'daily';
        $days = $validated['days'] ?? 30;

        $metrics = $this->metricsService->getServiceTypeSuccessRate(
            serviceType: $validated['service_type'],
            business: $request->user()->business,
            periodType: $periodType,
            days: $days
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'service_type' => $validated['service_type'],
                'metrics' => $metrics,
                'aggregated' => $this->metricsService->getAggregatedSuccessRate(
                    serviceType: $validated['service_type'],
                    business: $request->user()->business,
                    days: $days
                ),
            ],
        ]);
    }

    /**
     * Get service success rates
     */
    public function serviceSuccessRate(Request $request, Service $service)
    {
        $validated = $request->validate([
            'provider_id' => 'nullable|exists:providers,id',
            'period_type' => 'in:hourly,daily,weekly,monthly',
            'days' => 'integer|min:1|max:365',
        ]);

        $periodType = $validated['period_type'] ?? 'daily';
        $days = $validated['days'] ?? 30;
        $provider = $validated['provider_id'] ? Provider::find($validated['provider_id']) : null;

        $metrics = $this->metricsService->getServiceSuccessRate(
            service: $service,
            provider: $provider,
            business: $request->user()->business,
            periodType: $periodType,
            days: $days
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'service' => $service,
                'provider' => $provider,
                'metrics' => $metrics,
                'aggregated' => $this->metricsService->getAggregatedSuccessRate(
                    service: $service,
                    provider: $provider,
                    business: $request->user()->business,
                    days: $days
                ),
            ],
        ]);
    }

    /**
     * Get network success rates
     */
    public function networkSuccessRate(Request $request)
    {
        $validated = $request->validate([
            'network' => 'required|string',
            'provider_id' => 'nullable|exists:providers,id',
            'period_type' => 'in:hourly,daily,weekly,monthly',
            'days' => 'integer|min:1|max:365',
        ]);

        $periodType = $validated['period_type'] ?? 'daily';
        $days = $validated['days'] ?? 30;
        $provider = $validated['provider_id'] ? Provider::find($validated['provider_id']) : null;

        $metrics = $this->metricsService->getNetworkSuccessRate(
            network: $validated['network'],
            provider: $provider,
            business: $request->user()->business,
            periodType: $periodType,
            days: $days
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'network' => $validated['network'],
                'provider' => $provider,
                'metrics' => $metrics,
                'aggregated' => $this->metricsService->getAggregatedSuccessRate(
                    network: $validated['network'],
                    provider: $provider,
                    business: $request->user()->business,
                    days: $days
                ),
            ],
        ]);
    }

    /**
     * Compare multiple service types
     */
    public function compareServiceTypes(Request $request)
    {
        $validated = $request->validate([
            'service_types' => 'required|array|min:2',
            'service_types.*' => 'string|in:airtime,data,cable,electricity,exam,bulksms,data_card,recharge_card',
            'period_type' => 'in:hourly,daily,weekly,monthly',
            'days' => 'integer|min:1|max:365',
        ]);

        $periodType = $validated['period_type'] ?? 'daily';
        $days = $validated['days'] ?? 30;

        $comparison = $this->metricsService->compareServiceTypes(
            serviceTypes: $validated['service_types'],
            business: $request->user()->business,
            periodType: $periodType,
            days: $days
        );

        return response()->json([
            'status' => 'success',
            'data' => $comparison,
        ]);
    }

    /**
     * Get service type rankings
     */
    public function serviceTypeRankings(Request $request)
    {
        $validated = $request->validate([
            'period_type' => 'in:hourly,daily,weekly,monthly',
            'days' => 'integer|min:1|max:365',
        ]);

        $periodType = $validated['period_type'] ?? 'daily';
        $days = $validated['days'] ?? 30;

        $rankings = $this->metricsService->getRankedServiceTypes(
            business: $request->user()->business,
            periodType: $periodType,
            days: $days
        );

        return response()->json([
            'status' => 'success',
            'data' => $rankings,
        ]);
    }

    /**
     * Regenerate metrics from existing transactions
     * POST endpoint for admin use only
     */
    public function regenerate(Request $request)
    {
        $validated = $request->validate([
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);

        $this->metricsService->regenerateMetrics(
            business: $request->user()->business,
            fromDate: $validated['from_date'] ?? null,
            toDate: $validated['to_date'] ?? null
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Metrics have been regenerated successfully',
        ]);
    }
}
