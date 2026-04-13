<?php

use App\Http\Controllers\NetworkController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\NetworkTypeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('transactions', TransactionController::class);
    Route::resource('wallets', WalletController::class);
    Route::resource('networks', NetworkController::class);
    Route::resource('providers', ProviderController::class);
    Route::resource('network-types', NetworkTypeController::class);
    Route::get('pricing/airtime-data', [PricingController::class, 'airtimeAndData'])->name('pricing.airtime-data');
    Route::get('pricing/airtime-plan/create', [PricingController::class, 'createAirtimePlan'])->name('pricing.airtime-plan.create');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
