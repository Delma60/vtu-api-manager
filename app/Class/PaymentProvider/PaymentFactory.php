<?php

namespace App\Class\PaymentProvider;

use App\Class\PaymentProvider\Provider\FlutterWave;
use App\Class\PaymentProvider\Provider\Monnify;
use App\Class\PaymentProvider\Provider\PaymentPoint;
use App\Models\PaymentGateway;
// use App\Models\Provider;
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
        return match($provider->code){
            "flutterwave" => new FlutterWave($provider),
            "monnify" => new Monnify($provider),
            "payment point" => new PaymentPoint($provider),
        };
    }


    static function banks(){
        Payment::defualt();
    }
}
