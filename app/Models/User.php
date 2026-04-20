<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\HasRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\BelongsToBusiness;
use DateTimeInterface;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable, HasRole, BelongsToBusiness;

    protected $connection = 'mysql';

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

    /**
     * Create a new personal access token and keep the display value for later.
     */
    public function createToken(string $name, array $abilities = ['*'], ?DateTimeInterface $expiresAt = null)
    {
        $plainTextToken = $this->generateTokenString();

        $token = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
            'expires_at' => $expiresAt,
            'plain_text_token' => $this->buildPrefixedToken($plainTextToken),
        ]);

        return new NewAccessToken($token, $token->getKey().'|'.$plainTextToken);
    }

    protected function buildPrefixedToken(string $token): string
    {
        return ($this->business->mode === 'live' ? 'sk_live_' : 'sk_test_') . $token;
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

}

