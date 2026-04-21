<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class ApiCredential extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'environment',
        'key_prefix',
        'hashed_key',
        'last_used_at',
    ];

    protected $appends = ["plain_token"];

    protected $casts = [
        'last_used_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }



    function getPlainTokenAttribute()
    {
        // This is a virtual attribute to return the decrypted key if needed
        return $this->hashed_key ? Crypt::decryptString($this->hashed_key) : null;
    }
}