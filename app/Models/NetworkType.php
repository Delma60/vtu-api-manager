<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use App\Traits\TenantEnvironmentScope;


class NetworkType extends Model
{
    use BelongsToBusiness, TenantEnvironmentScope;

    protected $fillable = ['name', 'is_active', 'type', 'business_id'];

    public function typeable()
    {
        // This tells Laravel to look at typeable_id and typeable_type
        return $this->morphTo(); 
    }


    public function scopeAirtime($query)
    {
        return $query->where('type', 'airtime');
    }

    function provider(){
        return $this->belongsTo(Provider::class);
    }

    function dataPlans(){
        return $this->hasMany(DataPlan::class, 'plan_type');
    }
    function cablePlans(){
        return $this->hasMany(CablePlan::class, 'cable_network');
    }

}
