<?php

namespace App\Traits;

use App\Models\Provider;

trait HasDefaultProvider
{
    /**
     * Boot the trait to automatically assign a default provider.
     */
    protected static function bootHasDefaultProvider()
    {
        static::creating(function ($model) {
            // If provider_id is empty or null before saving to the DB, force it to 1
            if (empty($model->provider_id) || is_null($model->provider_id)) {
                $businessId = $model->business_id ?? auth()->user()?->business_id;
                $environment = $model->environment ?? auth()->user()?->business?->mode ?? 'live';

                // Find the first valid provider for this tenant/environment
                $defaultProvider = Provider::where('business_id', $businessId)
                    ->where('environment', $environment)
                    ->first();
                    
                $model->provider_id = $defaultProvider ? $defaultProvider->id : 1;
            }
        });
    }
}
