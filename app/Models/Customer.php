<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\EnvironmentAware;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends User
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use BelongsToBusiness, HasFactory;
    
    protected $table = 'users';

    protected static function booted(): void
    {
        static::addGlobalScope('customer_scope', function (Builder $builder) {
            $builder->whereHas('role', function ($query) {
                $query->where('slug', 'customer'); 
            });
        });
    }

    // You can put Customer-specific methods here without cluttering the User model!
    public function calculateLifetimeValue()
    {
        return $this->transactions()->where('status', 'successful')->sum('amount');
    }
}
