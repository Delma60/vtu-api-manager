<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Business extends Model
{
    //
    protected $fillable = [
        'name',
        'support_email',
        'is_active',
        'slug',
    ];

    public function owner(): HasOne
    {
        return $this->hasOne(User::class)
        ->whereHas('role', function ($query) {
            $query->where('slug', 'owner');
        });
    }
    
    // You might also want a general users relationship for all customers/staff
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
