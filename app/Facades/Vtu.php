<?php

namespace App\Facades;

use App\Services\Vtu\VtuManager;
use Illuminate\Support\Facades\Facade;

class Vtu extends Facade
{
   protected static function getFacadeAccessor()
    {
        return VtuManager::class;
    }
}
