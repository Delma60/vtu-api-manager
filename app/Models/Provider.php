<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Services\ProviderService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\TenantEnvironmentScope;

class Provider extends Model
{
    //
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory, BelongsToBusiness, TenantEnvironmentScope;

    protected $fillable = [
        'user_id',
        'business_id',
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
        'environment',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'cached_balance' => 'decimal:2',
        'success_rate_7d' => 'decimal:2',
        'meta' => 'array',
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
        $user = Auth::user();
        // Safely check for mode. Super admins will default to 'live' cache keys
        $mode = ($user && $user->user_type !== 'admin' && $user->business) ? $user->business->mode : 'live';

        $key = md5($this->base_url . $this->api_key . $this->api_secret . ($user?->id ?? "") . $mode);
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addMinutes(60), function() use($provider) {
            return $provider->isHealthy();
        });
    }

    public function getBalanceAttribute()
    {
        $user = Auth::user();
        $mode = ($user && $user->user_type !== 'admin' && $user->business) ? $user->business->mode : 'live';

        $key = md5($this->base_url . $this->api_key . $this->api_secret . ($user?->id ?? "") . $mode);
        $provider = ProviderService::make($this);
        return Cache::remember($key, now()->addMinutes(60), function() use($provider) {
            return $provider->checkBalance();
        });
    }

    function scopeServiceProvider($query, $service)
    {
        Log::info(["service" => $service, "query" => json_encode($query), "request user" => request()->user(), "auth user" => Auth::user()]);
        return $query
        ->with("netWorkTypeService")
        ->whereHas('netWorkTypeService', function ($q) use ($service) {
            Log::info(["Filtering providers that support service:" => $service, "sub_query" => json_encode($q)]);
            $q->where(function($sub_q) use($service){
                $sub_q->where('name', 'like', '%'.$service.'%');
                    //   ->orWhere('type', 'like', '%'.$service.'%');
            });
        });
    }
    function netWorkTypeService():HasMany
    {
        return $this->hasMany(NetworkType::class);
    }

}
