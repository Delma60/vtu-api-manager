<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\HasDefaultProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Traits\TenantEnvironmentScope;


class Network extends Model
{
    use BelongsToBusiness, TenantEnvironmentScope, HasDefaultProvider;

    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
        'airtime_api_id',
        'airtime_pin_api_id',
        'data_api_id',
        'data_pin_api_id',
        'environment',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function networkTypes():MorphMany
    {
        // Notice this is morphMany, not morphToMany!
        return $this->morphMany(NetworkType::class, 'typeable');
    }
}

