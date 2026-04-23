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

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                // Get the model name (e.g., App\Models\Network -> Network)
                $model = class_basename($e->getModel());
                return response()->json([
                    'status'  => false,
                    'message' => "The requested {$model} was not found.",
                ], 404);
            }
        });

        // 3. Handle Bad Routes / Endpoints
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'The requested API endpoint does not exist.',
                ], 404);
            }
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
