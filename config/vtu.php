<?php

return [
    //
    'default_timeout_ms' => 5000,
    
    'providers' => [
        'ADEX DEVELOPER' => \App\Class\Providers\Adex::class,
        'sandbox'        => \App\Class\Providers\Sandbox::class,
        "SMEPLUG"        => \App\Class\Providers\Smeplug::class,
        "VTPASS"         => \App\Class\Providers\Vtpass::class,

    ],
];
