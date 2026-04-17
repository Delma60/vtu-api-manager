<?php

use App\Services\Vtu\VtuManager;

if (!function_exists('service')) {
    /**
     * Get the VTU Service Manager instance.
     */
    function service(): VtuManager
    {
        return app(VtuManager::class);
    }
}