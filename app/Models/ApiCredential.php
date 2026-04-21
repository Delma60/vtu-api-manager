<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;


class ApiCredential extends Model
{
    use HasFactory, BelongsToBusiness, TenantEnvironmentScope;

    protected $fillable = [
        'user_id',
        'business_id',
        'name',
        'environment',
        'key_prefix',
        'hashed_key',
        'last_used_at',
        'mode',
        'is_active',
    ];

    protected $appends = ["plain_token", "prefix_plain_token"];

    protected $casts = [
        'last_used_at' => 'datetime',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }



    function getPlainTokenAttribute()
    {
        // This is a virtual attribute to return the decrypted key if needed
        return $this->hashed_key ? Crypt::decryptString($this->hashed_key) : null;
    }

    function getPrefixPlainTokenAttribute()
    {
        // This is a virtual attribute to return the decrypted key if needed
        return $this->hashed_key ?  $this->key_prefix . Crypt::decryptString($this->hashed_key) : null;
    }
}