<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Services\ProviderService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory;
    use BelongsToBusiness;

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

    protected $appends = ['connection', 'balance'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getConnectionAttribute()
    {
        $key = md5($this->base_url . $this->username . $this->password."-123");
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addMinutes(5), function() use($provider) {
            return $provider->isHealthy();
        });
    }

    public function getBalanceAttribute()
    {
        $key = md5($this->base_url . $this->username . $this->password ."_balance");
        Log:info(["key" => $key]);
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addMinutes(60), function() use($provider) {
            return $provider->checkBalance();
        });
    }


}
