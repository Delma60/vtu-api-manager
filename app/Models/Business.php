<?php

namespace
 App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Transaction;
use App\Models\User;
class Business extends Model
{
    protected $fillable = [
        'name',
        'support_email',
        'is_active',
        'slug',
        'bot_code',
        'telegram_is_active',
        'telegram_welcome_message',
        'mode',
    ];

    public function owner(): HasOne
    {
        return $this->hasOne(User::class)
        ->where("user_type", "tenant");
    }
    
    // You might also want a general users relationship for all customers/staff
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
