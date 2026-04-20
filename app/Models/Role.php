<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\EnvironmentAwareConnection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use BelongsToBusiness, EnvironmentAwareConnection;
    // protected $connection = 'mysql';
    
    protected $fillable = ['name', 'slug', 'service_cost_margins'];

    protected $casts = [
        'service_cost_margins' => 'array', // Automatically casts the JSON column to a PHP array
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
