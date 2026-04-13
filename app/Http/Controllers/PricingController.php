<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Network;
use App\Models\NetworkType;
use App\Models\Provider;
use Inertia\Inertia;

class PricingController extends Controller
{
    //
    // app/Http/Controllers/PricingController.php

    public function createAirtimePlan()
    {
        return Inertia::render('pricing/create-airtime-plan', [
            'networks' => Network::with('networkTypes')->get(),
            'providers' => Provider::all(),
        ]);
    }

    public function airtimeAndData()
    {

        $pricingData = [
            'mtn' => [
                'name' => 'MTN',
                'airtime_discount' => 2.5, // You give users 2.5% off
                'airtime_pin_discount' => 2.0,
                'data_plans' => [
                    ['id' => 1, 'name' => '1GB SME', 'type' => 'SME', 'cost' => 235, 'price' => 245, 'active' => true],
                    ['id' => 2, 'name' => '2GB SME', 'type' => 'SME', 'cost' => 470, 'price' => 490, 'active' => true],
                    ['id' => 3, 'name' => '1GB Corporate', 'type' => 'CG', 'cost' => 240, 'price' => 250, 'active' => false],
                ],
                'data_pins' => [
                    ['id' => 4, 'name' => '1.5GB Data Pin', 'cost' => 340, 'price' => 350, 'active' => true],
                ]
            ],
            'airtel' => [
                'name' => 'Airtel',
                'airtime_discount' => 3.0,
                'airtime_pin_discount' => 2.5,
                'data_plans' => [
                    ['id' => 5, 'name' => '1GB Corporate', 'type' => 'CG', 'cost' => 220, 'price' => 235, 'active' => true],
                ],
                'data_pins' => []
            ],
            // ... glo, 9mobile
        ];

        return Inertia::render('pricing/airtime-data', [
            'initialPricing' => $pricingData,
            'airtime_discounts' => Discount::where('type', 'airtime')->get(),
            'networks' => Network::all(),
            'network_types' => NetworkType::with("typeable")->get(),
        ]);
    }
}
