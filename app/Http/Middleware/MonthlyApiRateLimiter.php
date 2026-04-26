<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class MonthlyApiRateLimiter
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // TODO:: #17 Rate Limiter Cache Failure - Handle Redis/Memcached restarts that reset rate limit counters
        // 1. Check if this is a test environment - bypass rate limiting entirely
        // TODO:: #16 Test Environment Bypass - FIXED: Added environment check to skip rate limiting in test mode
        $environment = $request->attributes->get('environment') ?? 'live';
        if ($environment === 'test') {
            return $next($request);
        }

        // 2. Get the business from the authenticated user (Set by your ApiKeyAuth middleware)
        $business = $request->user()?->business;

        if (!$business) {
            return $next($request);
        }

        // 2. Get the monthly limit from their package settings
        $monthlyLimit = $business->package->settings['monthly_api_limit'] ?? 0;

        // If the limit is 0, we treat it as "Unlimited"
        if ($monthlyLimit <= 0) {
            return $next($request);
        }

        // 3. Create a unique Cache key for this business for the CURRENT month (e.g., "api_usage_2_2026-04")
        $currentMonth = now()->format('Y-m');
        $cacheKey = "api_usage_{$business->id}_{$currentMonth}";

        // 4. Fetch their current usage (Defaults to 0 if they haven't made any calls yet)
        $currentUsage = Cache::get($cacheKey, 0);

        // 5. Block the request if they hit the limit
        if ($currentUsage >= $monthlyLimit) {
            return response()->json([
                'success' => false,
                'message' => 'Monthly API limit exceeded. Please upgrade your plan to continue making requests.',
                'limit' => (int) $monthlyLimit,
                'usage' => (int) $currentUsage
            ], 429); // 429 is the standard HTTP status for "Too Many Requests"
        }

        // 6. Increment their usage efficiently in the Cache
        // We set the cache key to automatically expire at the end of the month
        Cache::add($cacheKey, 0, now()->endOfMonth()); 
        Cache::increment($cacheKey);

        // 7. Proceed with the API request
        $response = $next($request);

        // 8. (Optional) Add standard Rate Limit headers so the developer knows their limits
        if (method_exists($response, 'header')) {
            $response->header('X-RateLimit-Limit', $monthlyLimit);
            $response->header('X-RateLimit-Remaining', max(0, $monthlyLimit - ($currentUsage + 1)));
        }

        return $response;
    }
}