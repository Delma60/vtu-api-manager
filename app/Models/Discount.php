<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use BelongsToBusiness;

    //
    protected $fillable = [
        'name',
        // 'network_id',
        'type',
        'min_amount',
        'max_amount',
        'plan_type',
    ];
    
    protected $append = ['active_provider'];
    
    
    public function providers()
    {
        return $this->morphToMany(Provider::class, 'providerable', 'providerables', 'providerable_id', 'provider_id')
            ->withPivot(['cost_price', 'margin_value', 'margin_type', 'server_id'])
            ->withTimestamps();
    }

    public function setActiveProviderAttribute(){
        $providerable = $this->providers()->first();
        return $providerable ? $providerable : null;
    }

    public function planType(){
        return $this->belongsTo(NetworkType::class, 'plan_type');
    }

    // public function network (){}

    function scopeAirtime(){
        return $this->where("type", "airtime");
    }
}
