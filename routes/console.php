<?php

use App\Models\Provider;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $providers = Provider::where('is_active', true)->get();

    foreach ($providers as $provider) {
        $provider->calculateAndUpdateSuccessRate();
    }
})->hourly()->name('update-provider-success-rates');

Artisan::command('migrate:both {--fresh} {--seed} {--force}', function () {
    $connections = ['mysql', 'mysql_test'];
    $migrateCommand = $this->option('fresh') ? 'migrate:fresh' : 'migrate';

    foreach ($connections as $connection) {
        $this->info("Running {$migrateCommand} on {$connection}...");

        $options = ['--database' => $connection];
        if ($this->option('force')) {
            $options['--force'] = true;
        }

        Artisan::call($migrateCommand, $options, $this->getOutput());
        $this->info(Artisan::output());

        if ($this->option('seed')) {
            $this->info("Seeding {$connection}...");
            Artisan::call('db:seed', array_merge($options, ['--force' => true]), $this->getOutput());
            $this->info(Artisan::output());
        }
    }
})->purpose('Run migrations on both mysql and mysql_test connections');

// * * * * * cd /path-to-your-vtu-project && php artisan schedule:run >> /dev/null 2>&1
Schedule::command('subscriptions:deactivate-expired')->dailyAt('00:05');

// Run every hour, or every minute depending on how granular you need it
Schedule::command('settlements:process')->everyMinute()->withoutOverlapping();