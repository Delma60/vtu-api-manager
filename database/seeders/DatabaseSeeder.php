<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed providers after user exists
        $this->call([
            UserSeeder::class,
            ProviderSeeder::class,
            RoleSeeder::class,
            TransactionSeeder::class,
            NetworkSeeder::class,
            DataPlanSeeder::class,
            CablePlanSeeder::class,
            DiscountSeeder::class,
            PaymentGatewaySeeder::class,
            ServiceSeeder::class,
            SystemSettingSeeder::class,
            WalletSeeder::class,
            WebhookSeeder::class,
        ]);

    }
}
