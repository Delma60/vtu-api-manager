<?php

use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\MetricsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Debug endpoint - test token without middleware
Route::post('/debug', function (Request $request) {
    $token = $request->bearerToken();
    return response()->json([
        'bearer_token_present' => !!$token,
        'token_length' => $token ? strlen($token) : 0,
        'auth_header' => $request->header('Authorization') ? true : false,
        'user_authenticated' => !!$request->user(),
    ]);
});

Route::prefix('v1')->middleware(['api_key_auth', 'api.monthly_limit'])->group(function () {
    Route::post('/airtime', [ServiceController::class, 'airtime']);
    Route::prefix("data")->group(function(){
        Route::post('', [ServiceController::class, 'data'])->name('data.purchase');
        Route::get('/plans', [ServiceController::class, 'dataPlans'])->name('data.plans');
    });

    Route::prefix("cable")->group(function(){
        Route::post('', [ServiceController::class, 'cable'])->name('cable');
        Route::get('/plans', [ServiceController::class, 'cablePlans'])->name('cable.plans');
        Route::get('/verify', [ServiceController::class, 'cablePlans'])->name('cable-plans.verify');
    });

    // Metrics API endpoints
    Route::prefix('metrics')->group(function () {
        Route::get('/service-types/success-rate', [MetricsController::class, 'serviceTypeSuccessRate']);
        Route::get('/services/{service}/success-rate', [MetricsController::class, 'serviceSuccessRate']);
        Route::get('/networks/success-rate', [MetricsController::class, 'networkSuccessRate']);
        Route::get('/service-types/compare', [MetricsController::class, 'compareServiceTypes']);
        Route::get('/service-types/rankings', [MetricsController::class, 'serviceTypeRankings']);
    });
});
