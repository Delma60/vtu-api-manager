<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePackageFeature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string $feature The setting key to check (e.g., 'allow_airtime', 'api_access')
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $business = $request->user()?->business;

        // 1. Safety check: Ensure they belong to a business and have a package
        if (!$business || !$business->package) {
            return $this->denyAccess($request, 'No active subscription package found.');
        }

        // 2. Fetch the settings array (falling back to empty if missing)
        $settings = $business->package->settings ?? [];

        // 3. Check if the specific feature is enabled (true or > 0)
        // Note: For numerical limits like 'staff_limit', any number > 0 passes this basic gate.
        // You would write a separate check for exact numeric limits inside the controller.
        if (!isset($settings[$feature]) || empty($settings[$feature])) {
            return $this->denyAccess($request, "This feature is not available on your current plan. Please upgrade to access it.");
        }

        return $next($request);
    }

    /**
     * Helper to return the correct response format based on the request type.
     */
    private function denyAccess(Request $request, string $message): Response
    {
        // If this is an API call or Axios/Inertia JSON request, return a 403 JSON error
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 403);
        }

        // Otherwise, redirect back with an Inertia Flash Error
        return redirect()->back()->with('error', $message);
    }
}