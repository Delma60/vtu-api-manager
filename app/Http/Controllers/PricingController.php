<?php

namespace App\Http\Controllers;

use App\Models\DataPlan;
use App\Models\Discount;
use App\Models\Network;
use App\Models\NetworkType;
use App\Models\Provider;
use Illuminate\Support\Facades\Log;
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

    public function editAirtimePlan(Discount $plan)
    {
        $plan->load(['planType', 'providers']);
        $transformedPlan = [
            'id' => $plan->id,
            'name' => $plan->name,
            'type' => $plan->type,
            'network_id' => $plan->planType?->typeable?->id,
            'plan_type' => $plan->planType?->id,
            'min_amount' => $plan->min_amount,
            'max_amount' => $plan->max_amount,
            'is_active' => $plan->is_active ?? true,
            'providerable' => $plan->providers->first() ? [
                'provider_id' => $plan->providers->first()->id,
                'server_id' => $plan->providers->first()->pivot->server_id,
                'cost_price' => $plan->providers->first()->pivot->cost_price,
                'margin_value' => $plan->providers->first()->pivot->margin_value,
                'margin_type' => $plan->providers->first()->pivot->margin_type,
            ] : [
                'provider_id' => null,
                'server_id' => null,
                'cost_price' => '0.00',
                'margin_value' => '0.00',
                'margin_type' => 'fixed',
            ],
        ];

        return Inertia::render('pricing/edit-airtime-plan', [
            'networks' => Network::with('networkTypes')->get(),
            'providers' => Provider::all(),
            "plan_types" => NetworkType::airtime()->get(),
            'plan' => $transformedPlan,
        ]);
    }


    public function airtimeAndData()
    {

        return Inertia::render('pricing/airtime-data', [
            'airtime_discounts' => Discount::where('type', 'airtime')->with(['planType'])->get(),
            'networks' => Network::all(),
            'network_types' => NetworkType::with("typeable")->get(),
            'data_plans' => DataPlan::all(),
        ]);
    }
}
