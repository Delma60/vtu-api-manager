<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;

trait EnvironmentAware
{
    protected static function booted()
    {
        // 1. Automatically filter reads based on the active business mode
        static::addGlobalScope('environment', function (Builder $builder) {
            if (auth()->check() && auth()->user()->business) {
                $currentMode = auth()->user()->business->mode;
                $builder->where('mode', $currentMode);
            }
        });

        // 2. Automatically append the mode when creating new records
        static::creating(function ($model) {
            if (auth()->check() && auth()->user()->business && !isset($model->mode)) {
                $model->mode = auth()->user()->business->mode;
            }
        });
    }
}