<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\EnvironmentAwareConnection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory, BelongsToBusiness, EnvironmentAwareConnection;

    protected $fillable = [
        'user_id', 'transaction_type', 'provider', 'account_or_phone', 'amount',
        'quantity', 'status', 'transaction_reference', 'payment_reference',
        'funding_method', 'balance_before', 'balance_after', 'completed_at',
        'response_message', 'service_fee', 'platform', 'receiver', 'plan_type', 'token',
        'promotion_id', 'discount_amount', 'mode', 'business_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'meta_data' => 'json',
    ];

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
