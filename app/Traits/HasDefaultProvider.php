<?php

namespace App\Traits;

trait HasDefaultProvider
{
    /**
     * Boot the trait to automatically assign a default provider.
     */
    protected static function bootHasDefaultProvider()
    {
        static::creating(function ($model) {
            // If provider_id is empty or null before saving to the DB, force it to 1
            if (empty($model->provider_id)) {
                $model->provider_id = 1;
            }
        });
    }
}
