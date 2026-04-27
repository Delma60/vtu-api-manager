<?php

use App\Class\PaymentProvider\Provider\FlutterWave;
use App\Class\PaymentProvider\Provider\Monnify;
use App\Class\PaymentProvider\Provider\PaymentPoint;

return [
    //
    'providers' => [
        'flutterwave'   => FlutterWave::class,
        'monnify'       => Monnify::class,
        'payment_point' => PaymentPoint::class
    ]
];
