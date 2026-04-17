<?php

namespace App;

use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToBusiness
{
    protected static function bootedBelongsToBusiness()
    {
        static::addGlobalScope('business_tenant', function (Builder $builder) {
            if ($user = static::getTenantUser()) {
                if ($user->business_id !== null) {
                    $builder->where((new static)->getTable() . '.business_id', $user->business_id);
                }
            }
        });

        // Automatically assign the business_id when creating new records
        static::creating(function ($model) {
            if (empty($model->business_id)) {
                if ($user = static::getTenantUser()) {
                    $model->business_id = $user->business_id;
                }
            }
        });
    }


    protected static function getTenantUser()
    {
        return Auth::guard('sanctum')->user() 
            ?? Auth::guard('auth')->user() 
            ?? Auth::user();
    }


    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}