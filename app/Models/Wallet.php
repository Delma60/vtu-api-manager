<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    /** @use HasFactory<\Database\Factories\WalletFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
        'reserved',
        'total_funded',
        'total_used',
        'status',
    ];

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

