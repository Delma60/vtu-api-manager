<?php

namespace Database\Seeders;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::on('mysql')->first();

        // 3. If the database is completely empty (e.g., fresh migration), create a system admin dummy user
        if (!$user) {
            $user = User::on('mysql')->create([
                'name' => 'System Admin',
                'email' => 'admin@vtu-manager.local',
                'password' => Hash::make('password'),
            ]);

            // If you are still using the HasRole trait from earlier:
            // $user->assignRole(admin);
        }

        $userId = $user->id;
        Log::info('Seeding Providers with user_id: ' . $userId);

        Provider::insert([
            [
                'user_id' => $userId,
                'name' => 'MTN Direct API',
                'code' => 'mtn_direct',
                'base_url' => 'https://api.mtn.com/v1',
                'api_key' => 'mtn_api_key_xxx_yyy_zzz',
                'api_secret' => 'mtn_secret_hash_xxx_yyy_zzz',
                'priority' => 1,
                'timeout_ms' => 5000,
                'is_active' => true,
                'cached_balance' => 450000.00,
                'success_rate_7d' => 99.80,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userId,
                'name' => 'VTpass Aggregator',
                'code' => 'vtpass',
                'base_url' => 'https://api.vtpass.com/api',
                'api_key' => 'vtpass_api_key_xxx_yyy_zzz',
                'api_secret' => 'vtpass_secret_hash_xxx_yyy_zzz',
                'priority' => 2,
                'timeout_ms' => 8000,
                'is_active' => true,
                'cached_balance' => 12500.50,
                'success_rate_7d' => 92.40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userId,
                'name' => 'MobileVTU Backup',
                'code' => 'mobilevtu',
                'base_url' => 'https://api.mobilevtu.com/gateway',
                'api_key' => 'mobile_api_key_xxx_yyy_zzz',
                'api_secret' => 'mobile_secret_hash_xxx_yyy_zzz',
                'priority' => 3,
                'timeout_ms' => 10000,
                'is_active' => false,
                'cached_balance' => 5000.00,
                'success_rate_7d' => 0.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userId,
                'name' => 'Airtel Bulk Access',
                'code' => 'airtel_bulk',
                'base_url' => 'https://api.airtel.com/bulk',
                'api_key' => 'airtel_api_key_xxx_yyy_zzz',
                'api_secret' => 'airtel_secret_hash_xxx_yyy_zzz',
                'priority' => 4,
                'timeout_ms' => 6000,
                'is_active' => true,
                'cached_balance' => 250000.00,
                'success_rate_7d' => 98.50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $userId,
                'name' => 'Glo Direct Feed',
                'code' => 'glo_direct',
                'base_url' => 'https://api.glo.com/direct',
                'api_key' => 'glo_api_key_xxx_yyy_zzz',
                'api_secret' => 'glo_secret_hash_xxx_yyy_zzz',
                'priority' => 5,
                'timeout_ms' => 7000,
                'is_active' => true,
                'cached_balance' => 180000.00,
                'success_rate_7d' => 97.20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

