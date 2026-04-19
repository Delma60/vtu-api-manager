<?php

use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\ApiLogController;
use App\Http\Controllers\Bot\TelegramController;
use App\Http\Controllers\CablePlanController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DataPlanController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\NetworkController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\NetworkTypeController;
use App\Http\Controllers\PaymentLinkController;
use App\Http\Controllers\ServiceControlController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Payment link pay.show
Route::get('pay/{paymentLink}', [PaymentLinkController::class, 'show'])->name('pay.show');
Route::post('/webhook/telegram/sk_super_secret_string', [TelegramController::class, 'handleWebhook']);

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('toggle-mode', [DashboardController::class, 'toggleMode'])->name('toggle-mode');

    Route::resource('transactions', TransactionController::class);
    Route::resource('payment-links', PaymentLinkController::class);
    Route::resource('wallets', WalletController::class);
    Route::resource('networks', NetworkController::class);
    Route::resource('providers', ProviderController::class);
    Route::get("/providers/{provider}/diagnose", [ProviderController::class, "diagnose"])->name("provders.diagnose");
    Route::resource('service-controls', ServiceControlController::class);
    Route::put('/service-controls/bulk-update', [ServiceControlController::class, 'bulkUpdate'])
    ->name('service-controls.bulk-update');
    Route::resource('network-types', NetworkTypeController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('discounts', DiscountController::class);

    Route::post('customers/{customer}/suspend', [CustomerController::class, 'suspend'])->name('customers.suspend');
    Route::post('customers/{customer}/activate', [CustomerController::class, 'activate'])->name('customers.activate');

    Route::get('search', [SearchController::class, 'index'])->name('search');
    // Route::post('/payment-links', [PaymentLinkController::class, 'store'])->name('payment-links.store');

    Route::get('pricing/airtime-data', [PricingController::class, 'airtimeAndData'])->name('pricing.airtime-data');
    Route::get('pricing/airtime-plan/create', [PricingController::class, 'createAirtimePlan'])->name('pricing.airtime-plan.create');
    Route::get('pricing/airtime-plan/edit/{plan}', [PricingController::class, 'editAirtimePlan'])->name('pricing.airtime-plan.edit');
   Route::prefix("pricing")->group(function() {
       Route::resource('data-plans', DataPlanController::class);
       Route::resource('cable-plans', CablePlanController::class)->except(['show']);
       Route::post('/cable-plans/{cablePlan}/toggle-status', [CablePlanController::class, 'toggleStatus'])->name('cable-plans.toggle-status');
   });

    Route::prefix('developers')->group(function() {
        Route::resource('api-keys', ApiKeyController::class);
        Route::resource('api-logs', ApiLogController::class);
        Route::resource('webhooks', WebhookController::class);
        Route::prefix('bots')->name("bots.")->group(function(){
            Route::prefix("telegram-bot")->name("telegram.")->group(function(){
                Route::get('/', [TelegramController::class, 'settings'])->name('index');
                Route::post('/sync', [TelegramController::class, 'syncWebhook'])->name('sync');
                Route::put('/update-merchant', [TelegramController::class, 'updateMerchant'])->name('update-merchant');
            });
        })->name('bots');

    });

    Route::prefix('metrics')->group(function() {
        Route::get('/dashboard', [MetricsController::class, 'dashboard'])->name('metrics.dashboard');
        Route::get('/service-types/success-rate', [MetricsController::class, 'serviceTypeSuccessRate'])->name('metrics.service-type.success-rate');
        Route::get('/services/{service}/success-rate', [MetricsController::class, 'serviceSuccessRate'])->name('metrics.service.success-rate');
        Route::get('/networks/success-rate', [MetricsController::class, 'networkSuccessRate'])->name('metrics.network.success-rate');
        Route::get('/service-types/compare', [MetricsController::class, 'compareServiceTypes'])->name('metrics.service-types.compare');
        Route::get('/service-types/rankings', [MetricsController::class, 'serviceTypeRankings'])->name('metrics.service-types.rankings');
        Route::post('/regenerate', [MetricsController::class, 'regenerate'])->name('metrics.regenerate');
    });

});

// routes/web.php
Route::prefix('docs')->group(function () {
    Route::get('/introduction', function () {
        return Inertia::render('docs/introduction');
    })->name('docs.introduction');

    Route::get('/quick-start', function () {
        return Inertia::render('docs/quick-start');
    })->name('docs.quick-start');

    Route::get('/airtime', function () {
        return Inertia::render('docs/airtime');
    })->name('docs.airtime');
    // Add more doc routes here as you build them
    // authentication
    Route::get('/authentication', function () {
        return Inertia::render('docs/authentication');
    })->name('docs.authentication');

    Route::get('/api-keys', function () {
        return Inertia::render('docs/api-keys');
    })->name('docs.api-keys');

    // data
    Route::get('/data', function () {
        return Inertia::render('docs/data');
    })->name('docs.data');

    Route::get('/data-plans', function () {
        return Inertia::render('docs/data-plans');
    })->name('docs.data-plans');
    //

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
