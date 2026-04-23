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
    public function scopeGetKeyValue($query, $key, $default=null){
        return $query->where('key', $key)->value('value') ?? $default;
    }
}
