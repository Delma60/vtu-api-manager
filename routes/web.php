<?php

use App\Http\Controllers\ApiKeyController;
use App\Http\Controllers\ApiLogController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\Bot\TelegramController;
use App\Http\Controllers\Bot\WhatsAppController;
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
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PaymentGatewayController;
use App\Http\Controllers\PaymentLinkController;
use App\Http\Controllers\ServiceControlController;
use App\Http\Controllers\SettlementController;
use App\Http\Controllers\SuperAdmin\BusinessController;
use App\Http\Controllers\SystemBotController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\WebhookController;
use App\Http\Middleware\SuperAdminMiddleware;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::get('/pricing', function () {
    $packages = Package::where('is_active', true)->orderBy('price', 'asc')->get();

    return Inertia::render('pricing', [
        'packages' => $packages,
    ]);
})->name('pricing');


Route::get('/run-hosted-migrations/{token}', function ($token) {
    // IMPORTANT: Change this to a very secure, random string
    $secretToken = '1234554321';

    // Verify the token
    if ($token !== $secretToken) {
        abort(403, 'Unauthorized access.');
    }

    try {
        // The --force flag is required to run migrations in a production environment
        Artisan::call('migrate', ['--force' => true]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Database migrations completed successfully!',
            'output' => Artisan::output()
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Migration failed: ' . $e->getMessage()
        ], 500);
    }
});

// Payment link pay.show
Route::get('pay/{paymentLink}', [PaymentLinkController::class, 'show'])->name('pay.show');
Route::post('pay/{paymentLink}', [PaymentGatewayController::class, 'checkout'])->name('pay.submit');
// failed/successful payment
Route::get('pay/{transaction}/success', [PaymentLinkController::class, 'paymentSuccess'])->name('pay.success');
Route::get('pay/{paymentLink}/failed', [PaymentLinkController::class, 'paymentFailed'])->name('pay.failed');

Route::post('/webhook/telegram/{bot_code}/sk_super_secret_string', [TelegramController::class, 'handleWebhook']);

Route::post('/webhook/{uuid}', function (Request $request, string $uuid) {
    return \App\Services\ProviderService::webhook($request, $uuid);
});


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('transfers', \App\Http\Controllers\TransferController::class);
    // ->name('transfers.index');
    Route::post('/transfer/resolve', [\App\Http\Controllers\TransferController::class, 'resolveAccount'])->name('transfer.resolve');
    Route::post('/transfer', [\App\Http\Controllers\TransferController::class, 'process'])->name('transfer.process');

    Route::post('/wallets/fund', [\App\Http\Controllers\WalletController::class, 'fund'])->name('wallet.fund');
    Route::get('/wallets/fund/verify', [\App\Http\Controllers\WalletController::class, 'verify'])->name('wallet.fund.verify');

    Route::post('/settings/billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::get('/settings/billing/verify', [BillingController::class, 'verify'])->name('billing.verify'); // <-- New Route
    // Route::get('/settings/billing/verify', [\App\Http\Controllers\BillingController::class, 'verify'])->name('billing.verify');

    Route::get('toggle-mode', [DashboardController::class, 'toggleMode'])->name('toggle-mode');
    Route::resource('settlements', SettlementController::class);

    Route::resource('system-settings', SystemSettingController::class);
    Route::post('/settings', [SystemSettingController::class, "updateSingle"])
        ->name('settings.update.single');


    Route::resource('transactions', TransactionController::class);

    Route::resource('payment-links', PaymentLinkController::class);
    Route::resource('wallets', WalletController::class);
    Route::resource('networks', NetworkController::class);
    Route::resource('providers', ProviderController::class);
    Route::get("/providers/{provider}/diagnose", [ProviderController::class, "diagnose"])->name("providers.diagnose");
    Route::post('/providers/{provider}/regenerate-uuid', [ProviderController::class, 'regenerateUuid'])->name('providers.regenerate-uuid');

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

   Route::prefix("pricing")->name("pricing.")->group(function() {
       Route::resource('data-plans', DataPlanController::class);
       Route::resource('cable-plans', CablePlanController::class)->except(['show']);
       Route::post('/cable-plans/{cablePlan}/toggle-status', [CablePlanController::class, 'toggleStatus'])->name('cable-plans.toggle-status');
    // routes/web.php
        // routes/web.php
        Route::get('data-pin-plan/create', [\App\Http\Controllers\PricingController::class, 'createDataPinPlan'])->name('data-pin-plan.create');
        Route::get('data-pin-plan/edit/{plan}', [\App\Http\Controllers\PricingController::class, 'editDataPinPlan'])->name('data-pin-plan.edit');
        Route::get('airtime-pin-plan/create', [\App\Http\Controllers\PricingController::class, 'createAirtimePinPlan'])->name('airtime-pin-plan.create');
        Route::get('airtime-pin-plan/edit/{plan}', [\App\Http\Controllers\PricingController::class, 'editAirtimePinPlan'])->name('airtime-pin-plan.edit');
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
            Route::prefix("whatsapp-bot")->controller(WhatsAppController::class)->name("whatsapp.")->group(function(){
                Route::get('/', 'edit')->name('edit');
                Route::post('/', 'update')->name('update');
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

        // Route::resource('settings', SystemSettingController::class)->only(['index', 'store', 'destroy']);
        });


});

// routes/web.php
Route::prefix('docs')
->name("docs.")
->controller(DocumentationController::class)->group(function () {
    Route::redirect('/', '/docs/introduction');
    Route::get('/introduction', 'show')->name('introduction');
    Route::get('/quick-start', 'quickStart')->name('quick-start');
    Route::get('/airtime', 'airtime')->name('airtime');
    Route::get('/authentication', 'authentication')->name('authentication');
    Route::get('/api-keys', 'apiKey')->name('api-keys');
    Route::get('/data', 'data')->name('data');
    Route::get('/data-plans', 'dataPlans')->name('data-plans');
    Route::get('/cable', 'cable')->name('cable');
    Route::get('/cable-plans', 'cablePlans')->name('cable-plans');
    // Route::get('/utilities', 'utilities')->name('utilities');
    Route::get('/pins', 'pins')->name('pins');
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
        Route::resource('packages', PackageController::class);

        Route::post('users/{user}/toggle', [SuperAdminUserController::class, 'toggleStatus'])->name('users.toggle');
        // Route::resource('global-providers', GlobalProviderController::class);
        Route::post('payment-gateways/{paymentGateway}/toggle', [PaymentGatewayController::class, 'toggleStatus'])
        ->name('payment-gateways.toggle');
        Route::resource('payment-gateways', PaymentGatewayController::class)->except(['show']);

        Route::post('bots/{bot}/toggle', [SystemBotController::class, 'toggleStatus'])->name('bots.toggle');
        Route::resource('bots', SystemBotController::class)->only(['index', 'store', 'destroy']);
        Route::resource('settings', SystemSettingController::class)->only(['index', 'store', 'destroy']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
