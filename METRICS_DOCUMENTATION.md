# API Success Rate Monitoring System

This document explains the API Success Rate Monitoring system that has been implemented in the VTU API Manager.

## Overview

The system automatically tracks the success rates of API transactions across different dimensions:
- **Providers** (e.g., Adex, other vendors)
- **Services** (e.g., airtime, data, cable)
- **Networks** (e.g., MTN, Airtel, Glo)
- **Time Periods** (hourly, daily, weekly, monthly)

## Architecture

### Components

1. **ApiMetric Model** (`app/Models/ApiMetric.php`)
   - Stores aggregated metrics data
   - Supports multiple period types
   - Includes helper methods for calculating success rates

2. **MetricsService** (`app/Services/MetricsService.php`)
   - Core service for recording and querying metrics
   - Automatically aggregates data across multiple time periods
   - Provides various query methods for different use cases

3. **TransactionObserver** (`app/Observers/TransactionObserver.php`)
   - Automatically records metrics whenever a transaction is created or updated
   - Integrated with the Transaction model lifecycle

4. **MetricsController** (`app/Http/Controllers/MetricsController.php`)
   - Provides endpoints for querying metrics
   - Supports both web and API requests

## Database Schema

The `api_metrics` table stores:
- `business_id` - Multi-tenancy support
- `provider_id` - The provider (e.g., Adex)
- `service_id` - The service type (optional)
- `network` - The telecom network (optional)
- `period_date` - The date for the metric
- `period_type` - Type of period (hourly, daily, weekly, monthly)
- `total_requests` - Total transactions processed
- `successful_requests` - Successful transactions
- `failed_requests` - Failed transactions
- `success_rate` - Calculated success rate (0-100)

## Features

### Automatic Tracking

Metrics are automatically recorded whenever a transaction is saved:

```php
// When a transaction is created or updated with a status change,
// metrics are automatically recorded for:
// - Daily period
// - Weekly period
// - Monthly period
```

### Query Methods

#### 1. Provider Success Rate
```php
$metrics = $metricsService->getProviderSuccessRate(
    provider: $provider,
    business: $business,
    periodType: 'daily',
    days: 30
);
```

#### 2. Service Success Rate
```php
$metrics = $metricsService->getServiceSuccessRate(
    service: $service,
    provider: $provider, // optional
    business: $business,
    periodType: 'daily',
    days: 30
);
```

#### 3. Network Success Rate
```php
$metrics = $metricsService->getNetworkSuccessRate(
    network: 'mtn',
    provider: $provider, // optional
    business: $business,
    periodType: 'daily',
    days: 30
);
```

#### 4. Aggregated Success Rate
```php
$aggregated = $metricsService->getAggregatedSuccessRate(
    provider: $provider, // optional
    service: $service, // optional
    network: '9mobile', // optional
    business: $business,
    days: 30
);
// Returns: [
//     'total_requests' => 1000,
//     'successful_requests' => 950,
//     'failed_requests' => 50,
//     'success_rate' => '95.00',
//     'success_rate_raw' => 95.0
// ]
```

#### 5. Provider Comparison
```php
$comparison = $metricsService->compareProviders(
    providerIds: [1, 2, 3],
    business: $business,
    periodType: 'daily',
    days: 30
);
```

#### 6. Provider Rankings
```php
$rankings = $metricsService->getRankedProviders(
    business: $business,
    periodType: 'daily',
    days: 30
);
// Returns providers ranked by average success rate
```

## API Endpoints

### Web Endpoints (Require authentication)

- `GET /metrics/dashboard` - View metrics dashboard
- `GET /metrics/providers/{provider}/success-rate` - Get provider success rate
- `GET /metrics/services/{service}/success-rate` - Get service success rate
- `GET /metrics/networks/success-rate` - Get network success rate
- `GET /metrics/providers/compare` - Compare providers
- `GET /metrics/providers/rankings` - Get provider rankings
- `POST /metrics/regenerate` - Regenerate metrics from existing transactions

### API Endpoints (v1 - Require API token)

All metrics endpoints are available under `/api/v1/metrics/`:

```bash
# Get provider success rate
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/metrics/providers/1/success-rate?period_type=daily&days=30"

# Get service success rate
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/metrics/services/1/success-rate"

# Get network success rate
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/metrics/networks/success-rate?network=mtn"

# Compare providers
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/metrics/providers/compare?provider_ids[]=1&provider_ids[]=2"

# Get provider rankings
curl -H "Authorization: Bearer <token>" \
  "https://api.example.com/api/v1/metrics/providers/rankings"
```

## Query Parameters

All metrics endpoints support these parameters:

- `period_type` - One of: `hourly`, `daily`, `weekly`, `monthly` (default: daily)
- `days` - Number of days to look back (default: 30, max: 365)
- `provider_ids[]` - Array of provider IDs (for comparison endpoint)
- `network` - Network code/name (for network endpoint)

## Regenerating Metrics

If you need to recalculate metrics from existing transactions (e.g., after a bug fix):

```php
// Via service
$metricsService->regenerateMetrics(
    business: $business,
    fromDate: '2026-04-01',
    toDate: '2026-04-18'
);

// Via API endpoint
POST /metrics/regenerate
{
    "from_date": "2026-04-01",
    "to_date": "2026-04-18"
}
```

## Usage Examples

### Example 1: Check overall API health for last 30 days
```php
$service = app(MetricsService::class);
$health = $service->getAggregatedSuccessRate(
    business: auth()->user()->business,
    days: 30
);
echo "Success Rate: " . $health['success_rate'] . "%"; // 94.23%
```

### Example 2: Identify problem providers
```php
$rankings = $service->getRankedProviders(
    business: auth()->user()->business,
    days: 30
);

foreach ($rankings as $metric) {
    echo "{$metric->provider->name}: {$metric->avg_success_rate}% success rate";
}
// Output:
// Adex: 98.50% success rate
// Provider B: 87.20% success rate
```

### Example 3: Track daily trends
```php
$dailyMetrics = $service->getProviderSuccessRate(
    provider: $provider,
    business: auth()->user()->business,
    periodType: 'daily',
    days: 7
);

foreach ($dailyMetrics as $metric) {
    echo "{$metric->period_date}: {$metric->success_rate}%";
}
```

## Performance Considerations

- Metrics are calculated in real-time when transactions are recorded
- The `ApiMetric` table uses compound indexes for fast querying
- A unique constraint prevents duplicate metric entries
- Consider archiving old metrics if you have millions of transactions

## Troubleshooting

### No metrics appearing
1. Ensure transactions are being created with status changes
2. Check that the `TransactionObserver` is registered in `AppServiceProvider`
3. Verify the observer is not silently failing (check logs)

### Historical metrics are missing
Use the regenerate endpoint to recalculate metrics from existing transactions:
```bash
POST /metrics/regenerate
```

### High database usage
The system creates metrics for daily, weekly, and monthly periods. If you have thousands of providers/services/networks, consider adjusting which period types to track.

## Future Enhancements

Potential improvements to consider:
- Hourly metrics for real-time monitoring
- Metrics alerts when success rate drops below threshold
- Custom metric aggregations
- Metrics export to analytics platforms
- Historical data archiving
- Machine learning-based anomaly detection
