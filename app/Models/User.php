<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\HasRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\BelongsToBusiness;
use App\Services\ApiKeyManager;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRole, BelongsToBusiness;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

 


    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id');
    }

    public function providers()
    {
        return $this->hasMany(Provider::class);
    }

   

    public function isSuperAdmin(): bool
    {
        return $this->user_type === "admin";
    }

    public function isBusinessAdmin(): bool
    {
        return $this->user_type === "tenant";
    }
    
    public function isCustomer(): bool
    {
        return $this->user_type === 'tentant_customer';
    }

    function tokens():HasMany
    {
        return $this->hasMany(ApiCredential::class);
    }

    function createToken(string $name, array $abilities = ['*']): string
    {
        $key = ApiKeyManager::generateKey($this->id, $this->business?->mode, $name);
        return $key;
    }


    

}

