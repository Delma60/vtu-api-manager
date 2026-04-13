<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NetworkType extends Model
{

    protected $fillable = ['name', 'is_active', 'type'];

    public function typeable()
    {
        // This tells Laravel to look at typeable_id and typeable_type
        return $this->morphTo(); 
    }


    public function scopeAirtime($query)
    {
        return $query->where('type', 'airtime');
    }

}
