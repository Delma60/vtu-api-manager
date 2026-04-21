<?php

namespace App\Http\Middleware;

use App\Models\ApiLog;
use App\Services\MetricsService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ApiLoggerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->attributes->set('api_start_time', microtime(true));
        return $next($request);
    }

    public function terminate(Request $request, $response): void
    {
        // Calculate duration in milliseconds
        $startTime = $request->attributes->get('api_start_time');
        $duration = $startTime ? round((microtime(true) - $startTime) * 1000) : 0;

        // 1. Sanitize the Request Payload (Never store sensitive data!)
        $requestPayload = $request->except([
            'password',
            'password_confirmation',
            'pin',
            'transaction_pin',
            'api_key'
        ]);

        // 2. Decode the response content if it's JSON
        $responseContent = $response->getContent();
        // get api key from request header
        $apiKey = $request->header('Authorization');
        
        $responsePayload = json_decode($responseContent, true) ?? $responseContent;
        // user active token
        $activeToken = $request->user()?->activeToken();

        ApiLog::create([
            'user_id'          => $request->user()?->id,
            'business_id'      => $request->user()?->business_id,
            'provider_id'      => null,
            'method'           => $request->method(),
            'endpoint'         => $request->path(),
            'status_code'      => $response->getStatusCode(),
            'ip_address'       => $request->ip(),
            'duration_ms'      => $duration,
            'request_payload'  => $requestPayload,
            'response_payload' => $responsePayload,
            'mode'             => $activeToken?->environment ?? 'test' ,
        ]);

        try {
            $business = $request->user()?->business;
            if ($business) {
                $endpoint = $request->route()?->getName() ?? $request->path();
                $statusCode = $response->getStatusCode();
                $isSuccess = $statusCode >= 200 && $statusCode < 400;

                app(MetricsService::class)->recordRouteMetric(
                    business: $business,
                    endpoint: $endpoint,
                    isSuccess: $isSuccess
                );
            }
        } catch (\Exception $e) {
            Log::error('Failed to record API route metric', [
                'endpoint' => $request->path(),
                'error' => $e->getMessage(),
            ]);
        }
    }
}
