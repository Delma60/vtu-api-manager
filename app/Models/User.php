<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\HasRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\BelongsToBusiness;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable, HasRole, BelongsToBusiness;


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
        if ($this->relationLoaded('role')) {
            return $this->role && $this->role->slug === 'super_admin';
        }

        return $this->role_id === 1;
    }

    public function isBusinessAdmin(): bool
    {
        if ($this->relationLoaded('role')) {
            return $this->role && $this->role->slug === 'owner';
        }
        // Assuming role_id 2 is ALWAYS Business Admin
        return $this->role_id === 2;
    }
    
    public function isCustomer(): bool
    {
        return $this->type === 'customer';
    }
}

