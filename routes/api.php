<?php

use App\Http\Controllers\Api\V1\ServiceController;
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

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::post('/airtime', [ServiceController::class, 'airtime']);
});