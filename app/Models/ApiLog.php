<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\EnvironmentAware;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class ApiLog extends Model
{
    // use ;
    use HasFactory, HasUuids, Prunable, BelongsToBusiness, TenantEnvironmentScope;


    protected $fillable = [
        'user_id',
        'provider_id',
        'business_id',
        'method',
        'endpoint',
        'status_code',
        'ip_address',
        'duration_ms',
        'request_payload',
        'response_payload',
        'mode',
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

    protected function casts(): array
    {
        return [
            'request_payload' => 'array',
            'response_payload' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }
    
    public function scopeEntry(array $data){
        return self::create($data);
    }
}
