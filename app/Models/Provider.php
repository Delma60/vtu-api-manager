<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'code',
        'base_url',
        'api_key',
        'api_secret',
        'priority',
        'timeout_ms',
        'is_active',
        'cached_balance',
        'success_rate_7d',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cached_balance' => 'decimal:2',
        'success_rate_7d' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

}
