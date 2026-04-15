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
            "plan_types" => NetworkType::airtime()->get(),
            // 'airtime_discounts' => Discount::where('type', 'airtime')->with('network', 'plan_type')->get(),
        ]);
    }

    public function airtimeAndData()
    {

        return Inertia::render('pricing/airtime-data', [
            'airtime_discounts' => Discount::where('type', 'airtime')->with(['plan_type'])->get(),
            'networks' => Network::all(),
            'network_types' => NetworkType::with("typeable")->get(),
        ]);
    }
}
