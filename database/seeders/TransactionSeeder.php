<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get user with ID 1
        $user = User::find(1);

        if (!$user) {
            $this->command->error('User with ID 1 not found. Please run DatabaseSeeder first.');
            return;
        }

        // Create 50 mock transactions for user 1
        Transaction::factory(50)->create([
            'user_id' => $user->id,
        ]);

        $this->command->info('Successfully created 50 transactions for user: ' . $user->name);
    }
}
