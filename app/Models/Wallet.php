<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SystemSetting;
use App\Models\Settlement;
use Illuminate\Support\Str;


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

    public function creditPending(float $amount, string $description = 'Tenant Earnings'): void
    {
        // Get the probation period in hours from system settings (default to 24 hours if not set)
        $probationHours = SystemSetting::getKeyValue('settlement_probation_hours', 24);

        $this->increment('pending_balance', $amount);

        Settlement::create([
            'wallet_id'   => $this->id,
            'amount'      => $amount,
            'reference'   => 'SET-' . strtoupper(Str::random(10)),
            'description' => $description,
            'settles_at'  => now()->addHours($probationHours),
            'is_settled'  => false,
        ]);
    }
}

