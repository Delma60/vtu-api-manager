<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddUuidToProvidersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Provider::whereNull('uuid')->each(function ($provider) {
            $provider->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
        });
    }
}
