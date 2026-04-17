<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Services\ProviderService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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
        'meta',
        'logo_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cached_balance' => 'decimal:2',
        'success_rate_7d' => 'decimal:2',
        'meta' => 'array',
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
        $key = md5($this->base_url . $this->api_key . $this->api_secret . "=password=");
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addSeconds(10), function() use($provider) {
            // Log::info(["key" => $provider]);
            return $provider->isHealthy();
        });
    }

    public function getBalanceAttribute()
    {
        $key = md5($this->base_url . $this->api_key . $this->api_secret . "__");
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addMinutes(10), function() use($provider) {
            return $provider->checkBalance();
        });
    }

    function scopeServiceProvider($query, $service)
    {
        return $query->whereHas('id', function ($q) use ($service) {
            $q->netWorkTypeService()->where(function($sub_q) use($service){
                $sub_q->where('name', 'like', '%'.$service.'%')
                ->orWhere('type', 'like', '%'.$service.'%');
            });
        });
    }

    function netWorkTypeService(){
        return $this->hasMany(NetworkType::class);
    }

}
