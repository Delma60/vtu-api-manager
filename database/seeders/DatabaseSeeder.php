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
            ProviderSeeder::class,
            RoleSeeder::class,
            TransactionSeeder::class
        ]);

    }
}
