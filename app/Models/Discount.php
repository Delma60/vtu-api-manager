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
    // boot ::create convert network_id from request to network name and save to name column
    
    
    public function providers()
    {
        return $this->morphToMany(Provider::class, 'providerable', 'providerables', 'providerable_id', 'provider_id')
            ->withPivot(['cost_price', 'margin_value', 'margin_type', 'server_id'])
            ->withTimestamps();
    }

    public function plan_type(){
        return $this->belongsTo(NetworkType::class, 'plan_type');
    }

    // public function network (){}
}
