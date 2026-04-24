<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_cycle',
        'features',
        'is_active',
        'is_default',
        'settings'
        
    ];

    protected $casts = [
        'features' => 'array', // Automatically cast the JSON column to an array
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'settings' => 'array',
        'is_default' => 'boolean'
    ];

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }
}