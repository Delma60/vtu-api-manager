<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\NetworkController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
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
    Route::resource('customers', CustomerController::class);
    Route::resource('discounts', DiscountController::class);
    
    Route::post('customers/{customer}/suspend', [CustomerController::class, 'suspend'])->name('customers.suspend');
    Route::post('customers/{customer}/activate', [CustomerController::class, 'activate'])->name('customers.activate');

    Route::get('search', [SearchController::class, 'index'])->name('search');

    Route::get('pricing/airtime-data', [PricingController::class, 'airtimeAndData'])->name('pricing.airtime-data');
    Route::get('pricing/airtime-plan/create', [PricingController::class, 'createAirtimePlan'])->name('pricing.airtime-plan.create');
    Route::get('pricing/airtime-plan/edit/{plan}', [PricingController::class, 'editAirtimePlan'])->name('pricing.airtime-plan.edit');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
