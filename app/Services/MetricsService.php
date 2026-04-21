<?php

namespace App\Services;

use App\Models\ApiMetric;
use App\Models\Business;
use App\Models\Provider;
use App\Models\Service;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MetricsService
{
    /**
     * Record a transaction and update metrics
     */
    public function recordTransaction(
        Transaction $transaction,
        ?Business $business = null
    ): void {
        $business = $business ?? $transaction->user?->business ?? Business::first();
        $isSuccess = $transaction->status === 'successful';

        $this->updateMetrics(
            business: $business,
            serviceType: $transaction->type,
            provider: $transaction->provider,
            service: $transaction->service,
            network: $transaction->network ?? null,
            isSuccess: $isSuccess
        );
    }

    /**
     * Record an API route metric by endpoint/route name
     */
    public function recordRouteMetric(
        Business $business,
        string $endpoint,
        ?string $serviceType = null,
        ?Service $service = null,
        ?string $network = null,
        bool $isSuccess = true
    ): void {
        $this->updateMetrics(
            business: $business,
            serviceType: $serviceType ?? 'api',
            endpoint: $endpoint,
            provider: null,
            service: $service,
            network: $network,
            isSuccess: $isSuccess
        );
    }

    /**
     * Update metrics for a given combination of filters
     */
    public function updateMetrics(
        Business $business,
        string $serviceType,
        ?string $endpoint = null,
        ?Provider $provider = null,
        ?Service $service = null,
        ?string $network = null,
        bool $isSuccess = true
    ): void {
        $date = Carbon::now()->toDateString(); 

        // Update daily metrics
        // $hourStart = now()->hour()->toDateString();
        // $this->updatePeriodMetrics($business, $serviceType, $endpoint, $provider, $service, $network, $hourStart, 'hourly', $isSuccess);

        $this->updatePeriodMetrics($business, $serviceType, $endpoint, $provider, $service, $network, $date, 'daily', $isSuccess);

        // Update weekly metrics
        // $weekStart = now()->startOfWeek()->toDateString();
        // $this->updatePeriodMetrics($business, $serviceType, $endpoint, $provider, $service, $network, $weekStart, 'weekly', $isSuccess);

        // // Update monthly metrics
        // $monthStart = now()->startOfMonth()->toDateString();
        // $this->updatePeriodMetrics($business, $serviceType, $endpoint, $provider, $service, $network, $monthStart, 'monthly', $isSuccess);

        // Update hourly metrics (optional performance optimization - only if needed)
        // $hourStart = now()->startOfHour()->toDateTimeString();
    }

    /**
     * Update or create metric for a specific period
     */
    private function updatePeriodMetrics(
        Business $business,
        string $serviceType,
        ?string $endpoint,
        ?Provider $provider,
        ?Service $service,
        ?string $network,
        string $date,
        string $periodType,
        bool $isSuccess
    ): void {
        $attributes = [
            'business_id'  => $business->id,
            'service_type' => $serviceType,
            'endpoint'     => $endpoint,
            'provider_id'  => $provider?->id,
            'service_id'   => $service?->id,
            'network'      => $network,
            'period_date'  => $date,
            'period_type'  => $periodType,
        ];

        $connection = $business->mode === 'test' ? 'mysql_test' : null;

        // 1. Prevent "Row Creation" Race Condition
        try {
            $metric = ApiMetric::on($connection)->firstOrCreate(
                $attributes,
                [
                    'total_requests'      => 0,
                    'successful_requests' => 0,
                    'failed_requests'     => 0,
                    'success_rate'        => 0,
                ]
            );
        } catch (\Illuminate\Database\QueryException $e) {
            // Error 1062 means another concurrent request just inserted the row
            if ($e->errorInfo[1] == 1062) {
                $metric = ApiMetric::on($connection)->where($attributes)->first();
                if (!$metric) throw $e; 
            } else {
                throw $e;
            }
        }

        // 2. Prevent "Lost Updates" Counter Race Condition via Atomic DB Updates
        $successInc = $isSuccess ? 1 : 0;
        $failedInc  = $isSuccess ? 0 : 1;

        ApiMetric::on($connection)->where('id', $metric->id)->update([
            'total_requests'      => DB::raw('total_requests + 1'),
            'successful_requests' => DB::raw("successful_requests + {$successInc}"),
            'failed_requests'     => DB::raw("failed_requests + {$failedInc}"),
            // Atomically recalculate success rate inside SQL
            'success_rate'        => DB::raw("((successful_requests + {$successInc}) / (total_requests + 1)) * 100")
        ]);
    }

    /**
     * Get success rate for a service type over a period
     */
    public function getServiceTypeSuccessRate(
        string $serviceType,
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::where('service_type', $serviceType)
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->orderBy('period_date', 'desc')->get();
    }

    /**
     * Get success rate for a specific service
     */
    public function getServiceSuccessRate(
        Service $service,
        ?Provider $provider = null,
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::where('service_id', $service->id)
            ->where('period_type', $periodType);

        if ($provider) {
            $query->where('provider_id', $provider->id);
        }

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->orderBy('period_date', 'desc')->get();
    }

    /**
     * Get success rate by network
     */
    public function getNetworkSuccessRate(
        string $network,
        ?Provider $provider = null,
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::where('network', $network)
            ->where('period_type', $periodType);

        if ($provider) {
            $query->where('provider_id', $provider->id);
        }

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->orderBy('period_date', 'desc')->get();
    }

    /**
     * Get endpoint success rate over a period
     */
    public function getEndpointSuccessRate(
        string $endpoint,
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::where('endpoint', $endpoint)
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->orderBy('period_date', 'desc')->get();
    }

    /**
     * Get ranked endpoints by success rate
     */
    public function getRankedEndpoints(
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::whereNotNull('endpoint')
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->groupBy('endpoint')
            ->select(
                'endpoint',
                DB::raw('AVG(success_rate) as avg_success_rate'),
                DB::raw('SUM(total_requests) as total_requests'),
                DB::raw('SUM(successful_requests) as successful_requests'),
                DB::raw('SUM(failed_requests) as failed_requests')
            )
            ->orderBy('avg_success_rate', 'desc')
            ->get();
    }

    /**
     * Get aggregated success rate for the requested business and filters.
     */
    public function getAggregatedSuccessRate(
        ?Business $business = null,
        ?string $serviceType = null,
        ?Service $service = null,
        ?Provider $provider = null,
        ?string $network = null,
        ?string $endpoint = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): array {
        $query = ApiMetric::query()
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($serviceType) {
            $query->where('service_type', $serviceType);
        }

        if ($service) {
            $query->where('service_id', $service->id);
        }

        if ($provider) {
            $query->where('provider_id', $provider->id);
        }

        if ($network) {
            $query->where('network', $network);
        }

        if ($endpoint) {
            $query->where('endpoint', $endpoint);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        $metrics = $query->select(
                DB::raw('SUM(total_requests) as total_requests'),
                DB::raw('SUM(successful_requests) as successful_requests'),
                DB::raw('SUM(failed_requests) as failed_requests')
            )
            ->first();

        $totalRequests = (int) ($metrics->total_requests ?? 0);
        $successfulRequests = (int) ($metrics->successful_requests ?? 0);
        $failedRequests = (int) ($metrics->failed_requests ?? 0);
        $successRateRaw = $totalRequests > 0
            ? round(($successfulRequests / $totalRequests) * 100, 2)
            : 0;

        return [
            'total_requests' => $totalRequests,
            'successful_requests' => $successfulRequests,
            'failed_requests' => $failedRequests,
            'success_rate_raw' => $successRateRaw,
        ];
    }

    /**
     * Get provider rankings by average success rate.
     */
    public function getRankedProviders(
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::whereNotNull('provider_id')
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->groupBy('provider_id')
            ->select(
                'provider_id',
                DB::raw('AVG(success_rate) as avg_success_rate'),
                DB::raw('SUM(total_requests) as total_requests'),
                DB::raw('SUM(successful_requests) as successful_requests'),
                DB::raw('SUM(failed_requests) as failed_requests')
            )
            ->orderBy('avg_success_rate', 'desc')
            ->get();
    }

    /**
     * Get success rate comparison between service types
     */
    public function compareServiceTypes(
        array $serviceTypes,
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::whereIn('service_type', $serviceTypes)
            ->where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->groupBy('service_type')
            ->select('service_type', DB::raw('AVG(success_rate) as avg_success_rate'), DB::raw('SUM(total_requests) as total_requests'))
            ->get();
    }

    /**
     * Get service types ranked by success rate
     */
    public function getRankedServiceTypes(
        ?Business $business = null,
        string $periodType = 'daily',
        ?int $days = 30
    ): Collection {
        $query = ApiMetric::where('period_type', $periodType);

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($days) {
            $query->where('period_date', '>=', now()->subDays($days)->toDateString());
        }

        return $query->groupBy('service_type')
            ->select(
                'service_type',
                DB::raw('AVG(success_rate) as avg_success_rate'),
                DB::raw('SUM(total_requests) as total_requests'),
                DB::raw('SUM(successful_requests) as successful_requests'),
                DB::raw('SUM(failed_requests) as failed_requests')
            )
            ->orderBy('avg_success_rate', 'desc')
            ->get();
    }

    /**
     * Regenerate metrics from transactions (useful for backfilling data)
     */
    public function regenerateMetrics(
        ?Business $business = null,
        ?string $fromDate = null,
        ?string $toDate = null
    ): void {
        // Clear existing metrics for the date range
        $query = ApiMetric::query();

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($fromDate) {
            $query->where('period_date', '>=', $fromDate);
        }

        if ($toDate) {
            $query->where('period_date', '<=', $toDate);
        }

        $query->delete();

        // Regenerate from transactions
        $query = Transaction::query();

        if ($business) {
            $query->where('business_id', $business->id);
        }

        if ($fromDate) {
            $query->where('created_at', '>=', $fromDate);
        }

        if ($toDate) {
            $query->where('created_at', '<=', $toDate);
        }

        $transactions = $query->with(['user', 'provider', 'service'])->get();

        foreach ($transactions as $transaction) {
            $this->recordTransaction($transaction, $business);
        }
    }
}
