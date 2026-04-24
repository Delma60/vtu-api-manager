<?php

namespace App\Class\PaymentProvider;

use App\Class\PaymentProvider\PaymentFactory;
use App\Models\PaymentGateway;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;

class Payment
{


    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }


    static function generateAccount(User $user){
        $providers = Provider::getPaymentProviders()->get();
        $providers->map(function ($provider) use($user){
            PaymentFactory::make($provider)->generateAccount($user);
        });
    }

     static function webhook(Request $request, $identifier){
        $vendor = Provider::whereIdentifier($identifier)->first();
        $vendorInstance = PaymentFactory::make($vendor);
        $vendorInstance->webhook($request);
        return response()->noContent();

    }

    // banks
    static function banks(){
        $default_provider = PaymentGateway::default();
        $providerInstance = PaymentFactory::make($default_provider);
        return $providerInstance->banks();
    }
}
