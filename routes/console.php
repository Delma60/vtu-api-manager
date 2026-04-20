<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

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
