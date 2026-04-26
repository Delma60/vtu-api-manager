<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    // TODO:: #4 Missing Database Indexes on References - Index transaction_reference column for fast lookups at scale
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, BelongsToBusiness, TenantEnvironmentScope;

    protected $fillable = [
        'user_id', 'transaction_type', 'provider', 'account_or_phone', 'amount',
        'quantity', 'status', 'transaction_reference', 'payment_reference',
        'funding_method', 'balance_before', 'balance_after', 'completed_at',
        'response_message', 'service_fee', 'platform', 'receiver', 'plan_type', 'token',
        'promotion_id', 'discount_amount', 'mode', 'business_id', 'environment'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'meta_data' => 'json',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationships for future models
    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
    
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public static function generateTransactionId(): string
    {
        return strtoupper('TXN-' . now()->format('YmdHis') . '-' . Str::random(6));
    }
}
