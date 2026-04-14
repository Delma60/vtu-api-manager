<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends User
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use BelongsToBusiness;

    // protected $table = 'users';

    protected static function booted(): void
    {
        static::addGlobalScope('customer_scope', function (Builder $builder) {
            $builder->where('type', 'customer');
        });
    }

    // You can put Customer-specific methods here without cluttering the User model!
    public function calculateLifetimeValue()
    {
        return $this->transactions()->where('status', 'successful')->sum('amount');
    }
}
