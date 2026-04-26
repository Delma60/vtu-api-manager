<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Settlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id',
        'amount',
        'reference',
        'description',
        'settles_at',
        'is_settled',
    ];

    protected $casts = [
        'settles_at' => 'datetime',
        'is_settled' => 'boolean',
        'amount' => 'decimal:4',
    ];

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class);
    }
}