<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiLog extends Model
{
    //
    use BelongsToBusiness;

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

    public function scopeEntry(array $data){
        return self::create($data);
    }
}
