<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Network extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
        'airtime_api_id',
        'airtime_pin_api_id',
        'data_api_id',
        'data_pin_api_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

   
    public function networkTypes()
    {
        // Notice this is morphMany, not morphToMany!
        return $this->morphMany(NetworkType::class, 'typeable');
    }
}

