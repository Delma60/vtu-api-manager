<?php

namespace App;

use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToBusiness
{
    // Use the Laravel trait naming convention to avoid conflicts!
    protected static function bootedBelongsToBusiness()
    {
        // Automatically scope queries to the currently authenticated user's business
        static::addGlobalScope('business_tenant', function (Builder $builder) {
            // CRITICAL FIX: Use Auth::hasUser() to prevent infinite DB loops!
            if (Auth::hasUser() && !Auth::user()->isSuperAdmin()) {
                $builder->where('business_id', Auth::user()->business_id);
            }
        });

        // Automatically assign the business_id when creating new records
        static::creating(function ($model) {
            // CRITICAL FIX: Use Auth::hasUser()
            if (Auth::hasUser() && !Auth::user()->isSuperAdmin() && empty($model->business_id)) {
                $model->business_id = Auth::user()->business_id;
            }
        });
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}