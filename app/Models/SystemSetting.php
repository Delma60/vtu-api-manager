<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    /** @use HasFactory<\Database\Factories\SystemSettingFactory> */
    use HasFactory, BelongsToBusiness, TenantEnvironmentScope;
    protected $fillable = ['key', 'value', 'business_id', 'environment', 'settingable_id', 'settingable_type'];

    // Helper method to get setting value by key
    public static function getKeyValue($key, $default = null, ?array $options = [  ])
    {
        if(isset($options['ignore-scopes']) && $options['ignore-scopes'] === true)
            return static::withoutGlobalScopes()
        ->where('key', $key)
        ->value('value') ?? $default;
        else
            return static::where('key', $key)->value('value') ?? $default;
            // return static::where('key', $key)->value('value') ?? $default;
    }
}
