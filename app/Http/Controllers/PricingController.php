<?php

namespace App\Http\Controllers;

use App\Models\CablePlan;
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
            'airtime_pin_discounts' => Discount::where('type', 'airtimePin')->with(['providers'])->get(),
            "plan_types" => NetworkType::airtime()->get(),
            // 'airtime_pin_discounts' => Discount::where('type', 'airtimePin')->with(['planType'])->get(),
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
            'network_types' => NetworkType::with("typeable")->whereHas('typeable', function ($q) {
                $q->whereIn('type', ['airtime', 'data']);
            })->get(),
            'data_plans' => $this->getAllDataPlansFromProviders(),
            'airtime_pin_discounts' => Discount::where('type', 'airtimePin')->with(['providers'])->get(),
            'data_pin_discounts' => \App\Models\Discount::whereIn('type', ['data_pin', 'dataPin'])->with(['providers'])->get(),
        ]);
    }

    /**
     * Get all data plans from all active providers that support data.
     */
    private function getAllDataPlansFromProviders()
    {
        $providers = Provider::withoutGlobalScopes()->where('is_active', true)->get();
        $allDataPlans = [];

        foreach ($providers as $provider) {
            try {
                $providerInstance = ProviderService::make($provider);

                if ($providerInstance && $providerInstance->supportsService('data')) {
                    $plansResponse = $providerInstance->plans(['type' => 'data']);

                    // Handle different response formats
                    $isSuccess = ($plansResponse['status'] ?? false) === true || ($plansResponse['status'] ?? '') === 'success';

                    if ($isSuccess && isset($plansResponse['data'])) {
                        $data = $plansResponse['data'];

                        // Handle SME plug grouped format (status: true, data: {networkId: [...plans]})
                        if (is_array($data) && !isset($data[0]) && ($plansResponse['status'] ?? false) === true) {
                            foreach ($data as $networkId => $plans) {
                                if (!isset($allDataPlans[$networkId])) {
                                    $allDataPlans[$networkId] = [];
                                }

                                // Add provider info to each plan
                                foreach ($plans as $plan) {
                                    $plan['provider_id'] = $provider->id;
                                    $plan['provider_name'] = $provider->name;
                                    $allDataPlans[$networkId][] = $plan;
                                }
                            }
                        }
                        // Handle Adex format (flat array of plans)
                        elseif (is_array($data) && isset($data[0])) {
                            $networkId = '1'; // Default network for Adex
                            if (!isset($allDataPlans[$networkId])) {
                                $allDataPlans[$networkId] = [];
                            }

                            foreach ($data as $plan) {
                                $plan['provider_id'] = $provider->id;
                                $plan['provider_name'] = $provider->name;
                                $allDataPlans[$networkId][] = $plan;
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Failed to get data plans from provider {$provider->name}: " . $e->getMessage());
                continue;
            }
        }

        return $allDataPlans;
    }

    /**
     * Display the cable plans and networks.
     */
    public function cable()
    {
        $cablePlans = \App\Models\CablePlan::with(['networkType', 'provider'])->latest()->get();
        $cableNetworks = \App\Models\NetworkType::where('type', 'cable')->get();

        return inertia('pricing/cable', [
            'cablePlans' => $cablePlans,
            'cableNetworks' => $cableNetworks,
        ]);
    }

    // app/Http/Controllers/PricingController.php

    public function createAirtimePinPlan()
    {
        return \Inertia\Inertia::render('pricing/create-airtime-pin-plan', [
            'networks' => \App\Models\Network::with('networkTypes')->get(),
            'providers' => \App\Models\Provider::all(),
            'plan_types' => \App\Models\NetworkType::airtime()->get(),
        ]);
    }

    public function createDataPinPlan()
    {
        return \Inertia\Inertia::render('pricing/create-data-pin-plan', [
            'networks' => \App\Models\Network::with('networkTypes')->get(),
            'providers' => \App\Models\Provider::all(),
        ]);
    }
}
