<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'Airtime', 'type' => 'airtime'],
            ['name' => 'Data', 'type' => 'data'],
            ['name' => 'Cable TV', 'type' => 'cable'],
            ['name' => 'Electricity', 'type' => 'electricity'],
            ['name' => 'Exam Pins', 'type' => 'exam'],
        ];

        foreach ($services as $service) {
            \App\Models\Service::create($service);
        }
    }
}
