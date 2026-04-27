<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'discount', // New
        'allow_telegram_bot', // New
        'allow_whatsapp_bot', // New
        'billing_cycle',
        'features',
        'is_active',
        'is_default',
        'settings',
        'is_featured'

    ];

    protected $casts = [
        'features' => 'array', // Automatically cast the JSON column to an array
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'settings' => 'array',
        'is_default' => 'boolean',
        'is_featured' => 'boolean',
        'allow_telegram_bot' => 'boolean',
        'allow_whatsapp_bot' => 'boolean',
        'discount' => 'decimal:2',
    ];

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }

    public function hasTelegramBotAccess(): bool
    {
        return $this->settings['telegram_bot_access'] ?? false;
    }

    public function hasWhatsappBotAccess(): bool
    {
        return $this->settings['whatsapp_bot_access'] ?? false;
    }
}
