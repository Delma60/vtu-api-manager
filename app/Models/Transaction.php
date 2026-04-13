<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'reference',
        'vendor_reference',
        'user_id',
        'provider_id',
        'service_id',
        'type',
        'network',
        'destination',
        'amount',
        'cost',
        'previous_balance',
        'new_balance',
        'status',
        'meta_data',
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
}
