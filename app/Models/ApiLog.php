<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiLog extends Model
{
    use BelongsToBusiness, HasUuids;

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
    ];

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
