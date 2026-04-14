<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    //
    protected $fillable = [
        'name',
        'support_email',
        'is_active',
        'slug',
    ];
}
