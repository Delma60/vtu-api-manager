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
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\UserController as SuperAdminUserController;
use App\Http\Controllers\MetricsController;
use App\Http\Controllers\NetworkController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\NetworkTypeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentGatewayController;
use App\Http\Controllers\PaymentLinkController;
use App\Http\Controllers\ServiceControlController;
use App\Http\Controllers\SuperAdmin\BusinessController;
use App\Http\Controllers\WebhookController;
use App\Http\Middleware\SuperAdminMiddleware;
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
            Route::prefix("telegram-bot")->controller(TelegramController::class)->name("telegram.")->group(function(){
                Route::get('/', 'settings')->name('index');
                Route::post('/sync', 'syncWebhook')->name('sync');
                Route::put('/update-merchant', 'updateMerchant')->name('update-merchant');
            });
        })->name('bots');
    });
    Route::prefix("notifications")->controller(NotificationController::class)->name("notifications.")->group(function(){
        Route::post('mark-all-as-read', "markAllAsRead")->name('mark-all-as-read');
        Route::post('/{id}/mark-as-read', "markAsRead")->name('mark-as-read');

    });
    Route::prefix('metrics')->controller(MetricsController::class)->name("metrics.")->group(function() {
        Route::get('/dashboard', 'dashboard')->name('dashboard');
        Route::get('/service-types/success-rate', 'serviceTypeSuccessRate')->name('service-type.success-rate');
        Route::get('/services/{service}/success-rate', 'serviceSuccessRate')->name('service.success-rate');
        Route::get('/networks/success-rate', 'networkSuccessRate')->name('network.success-rate');
        Route::get('/service-types/compare', 'compareServiceTypes')->name('service-types.compare');
        Route::get('/service-types/rankings', 'serviceTypeRankings')->name('service-types.rankings');
        Route::post('/regenerate', 'regenerate')->name('regenerate');
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

Route::middleware(['auth', SuperAdminMiddleware::class])
    ->prefix('admin')
    ->name('super-admin.')
    ->group(function () {
        
        Route::get('/dashboard', [SuperAdminDashboardController::class, 'index'])->name('dashboard');
        
        // Future routes go here:
        Route::post('businesses/{business}/toggle', [BusinessController::class, 'toggleStatus'])
        ->name('businesses.toggle');

    // 2. The standard resource route generates index, show, create, etc.
        Route::resource('businesses', BusinessController::class);
        Route::resource('users', SuperAdminUserController::class);
        Route::post('users/{user}/toggle', [SuperAdminUserController::class, 'toggleStatus'])->name('users.toggle');
        // Route::resource('global-providers', GlobalProviderController::class);
        Route::post('payment-gateways/{paymentGateway}/toggle', [PaymentGatewayController::class, 'toggleStatus'])
        ->name('payment-gateways.toggle');
    Route::resource('payment-gateways', PaymentGatewayController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
