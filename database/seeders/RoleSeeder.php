<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Standard Customer',
                'slug' => 'customer',
                
            ],
            [
                'name' => 'Verified Agent',
                'slug' => 'agent',
                
            ],
            [
                'name' => 'API Partner',
                'slug' => 'api',
               
            ]
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['slug' => $role['slug']], // Search by this unique slug
                $role                      // If not found, create with this data
            );
        }
    }
}
