<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\EnvironmentAwareConnection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataPlan extends Model
{
    /** @use HasFactory<\Database\Factories\DataPlanFactory> */
    use HasFactory, BelongsToBusiness, EnvironmentAwareConnection;

    protected $fillable = [
        'network',
        'plan_type',
        'plan_name',
        'plan_size',
        'validity',
        'is_active'
    ];

    public function providers()
    {
        return $this->morphToMany(Provider::class, 'providerable', 'providerables', 'providerable_id', 'provider_id')
            ->withPivot(['cost_price', 'margin_value', 'margin_type', 'server_id'])
            ->withTimestamps();
    }

    function planType():BelongsTo
    {
        return $this->belongsTo(NetworkType::class, 'plan_type');
    }
}
