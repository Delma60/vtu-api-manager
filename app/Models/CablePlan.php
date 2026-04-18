<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CablePlan extends Model
{
    /** @use HasFactory<\Database\Factories\CablePlanFactory> */
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'network_type_id',
        'provider_id',
        'plan_id',
        'name',
        'amount',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'amount' => 'decimal:2',
    ];

    public function networkType()
    {
        return $this->belongsTo(NetworkType::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
