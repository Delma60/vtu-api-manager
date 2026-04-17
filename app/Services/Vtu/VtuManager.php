<?php

namespace App\Services\Vtu;

class VtuManager
{
    public function airtime(): AirtimeProcessor
    {
        return app(AirtimeProcessor::class);
    }

    public function data(): DataProcessor
    {
        return app(DataProcessor::class);
    }
}
