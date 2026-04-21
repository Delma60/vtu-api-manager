<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    /** @use HasFactory<\Database\Factories\WalletFactory> */
    use HasFactory;
    use BelongsToBusiness, TenantEnvironmentScope;

    protected $fillable = [
        'user_id',
        'balance',
        'reserved',
        'total_funded',
        'total_used',
        'status',
        'environment',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (!$model->environment) {
                $model->environment = request()->bearerToken() && str_starts_with(request()->bearerToken(), 'sk_test_') 
                    ? 'test' 
                    : (Auth::user()?->business?->mode ?? 'live');
            }
        });
    }

    protected $casts = [
        'balance' => 'decimal:2',
        'reserved' => 'decimal:2',
        'total_funded' => 'decimal:2',
        'total_used' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

