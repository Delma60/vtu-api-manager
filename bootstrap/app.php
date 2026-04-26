<?php

use App\Http\Middleware\ApiKeyAuth;
use App\Http\Middleware\ApiLoggerMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies('*');
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->append([
            ]);
        $middleware->api(append: [
            ApiLoggerMiddleware::class,
        ]);
        $middleware->alias([
            "api-auth" => ApiKeyAuth::class,
            'package.feature' => \App\Http\Middleware\EnsurePackageFeature::class,
            'api.monthly_limit' => \App\Http\Middleware\MonthlyApiRateLimiter::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Validation failed. Please check the provided data.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            
            // If it's an API request (e.g. from mobile app or external server), return JSON
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Endpoint not found.'
                ], 404);
            }

            // Otherwise, render the beautiful React 404 page!
            return Inertia::render('errors/404')
                ->toResponse($request)
                ->setStatusCode(404);
        });


        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            
            // 1. If it's an API request, return a clean JSON response
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The requested resource or record was not found.',
                ], 404);
            }

            // 2. If it's a web request and previous page exists, you can redirect back with a flash message
            if ($e->getPrevious() instanceof ModelNotFoundException) {
                return back()->with('error', 'Record not found.');
            }

            // Otherwise, let Laravel render the default 404 page (or your Inertia 404 page)
            return null; 
        });

        // 4. Handle Wrong HTTP Methods (e.g., sending GET to a POST route)
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'HTTP Method not allowed for this endpoint.',
                ], 405);
            }
        });

        // 5. Handle Unauthenticated Users
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                // Log auth failures for debugging
                \Illuminate\Support\Facades\Log::warning('API Auth Failed', [
                    'path' => $request->path(),
                    'method' => $request->method(),
                    'has_token' => !!$request->bearerToken(),
                    'auth_header' => $request->header('Authorization') ? 'present' : 'missing',
                    'ip' => $request->ip(),
                    'error' => $e->getMessage(),
                ]);

                return response()->json([
                    'status'  => false,
                    'message' => 'Unauthenticated. Invalid or missing API Key.',
                ], 401);
            }
        });
    })->create();
