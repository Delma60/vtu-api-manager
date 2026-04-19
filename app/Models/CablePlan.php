<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class CablePlan extends Model
{
    /** @use HasFactory<\Database\Factories\CablePlanFactory> */
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'cable_network',
        'provider_id',
        'plan_name',
        'is_active',
    ];

    protected $appends = ['provider', 'amount'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function providers():MorphToMany
    {
        return $this->morphToMany(Provider::class, 'providerable', 'providerables', 'providerable_id', 'provider_id')
            ->withPivot(['cost_price', 'margin_value', 'margin_type', 'server_id'])
            ->withTimestamps();
    }

    // amount attribute
    public function getAmountAttribute()
    {
        $provider = $this->providers()->first();
        if ($provider) {
            $costPrice = $provider->pivot->cost_price;
            $marginValue = $provider->pivot->margin_value;
            $marginType = $provider->pivot->margin_type;

            if ($marginType === 'percentage') {
                return round($costPrice + ($costPrice * ($marginValue / 100)), 2);
            } else {
                return round($costPrice + $marginValue, 2);
            }
        }
        return null; // or some default value
    }

    public function networkType():BelongsTo
    {
        return $this->belongsTo(NetworkType::class, "cable_network");
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function getProviderAttribute(){
        return $this->providers()->first();
    }
}
