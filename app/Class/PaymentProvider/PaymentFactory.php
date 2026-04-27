<?php

namespace App\Class\PaymentProvider;

use App\Class\PaymentProvider\Provider\FlutterWave;
use App\Class\PaymentProvider\Provider\Monnify;
use App\Class\PaymentProvider\Provider\PaymentPoint;
use App\Models\PaymentGateway;
use App\Models\Provider as ProviderModel;
use Illuminate\Support\Facades\Log;

class PaymentFactory
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    static function make(PaymentGateway $provider){
        $provider = config("payment.providers");
        if(!$provider)return null;
        if(!isset($provider->code))return null;
        $paymentProvider = $provider[$provider?->code] ?? null;
        if(!$paymentProvider) return null;  
        
        return new $paymentProvider($provider);

       
    }


    static function banks(){
        ProviderModel::default();
    }
}
