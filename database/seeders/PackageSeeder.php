<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Package::create([
            'name' => 'Free Plan',
            'slug' => 'free-plan',
            'description' => 'Basic plan with limited features',
            'price' => 0,
            'billing_cycle' => 'monthly',
            'features' => [
                'Basic API access',
                'Limited transactions',
                'Standard support'
            ],
            'is_active' => true,
            'is_default' => true,
            'is_featured' => false,
            'settings' => [
                'api_access' => true,
                'custom_domain' => false,
                'staff_limit' => 1,
                'monthly_api_limit' => 100,
                'bot_access' => false,
                'webhook_access' => false,
                'custom_pricing' => false,
                'priority_support' => false,
                'white_label' => false,
            ],
        ]);

        \App\Models\Package::create([
            'name' => 'Premium Plan',
            'slug' => 'premium-plan',
            'description' => 'Full-featured plan for growing businesses',
            'price' => 50,
            'billing_cycle' => 'monthly',
            'features' => [
                'Unlimited API access',
                'Advanced features',
                'Priority support',
                'Custom integrations'
            ],
            'is_active' => true,
            'is_default' => false,
            'is_featured' => true,
            'settings' => [
                'api_access' => true,
                'custom_domain' => true,
                'staff_limit' => 10,
                'monthly_api_limit' => 10000,
                'bot_access' => true,
                'webhook_access' => true,
                'custom_pricing' => true,
                'priority_support' => true,
                'white_label' => true,
            ],
        ]);
    }
}
