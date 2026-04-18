<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiMetric extends Model
{
    use HasFactory, BelongsToBusiness;

    protected $fillable = [
        'business_id',
        'service_type',
        'endpoint',
        'provider_id',
        'service_id',
        'network',
        'period_date',
        'period_type',
        'total_requests',
        'successful_requests',
        'failed_requests',
        'success_rate',
    ];

    protected $casts = [
        'period_date' => 'date',
        'total_requests' => 'integer',
        'successful_requests' => 'integer',
        'failed_requests' => 'integer',
        'success_rate' => 'float',
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the success rate as a percentage string
     */
    public function getSuccessRatePercentageAttribute(): string
    {
        return number_format($this->success_rate, 2) . '%';
    }

    /**
     * Calculate and update the success rate
     */
    public function calculateSuccessRate(): void
    {
        if ($this->total_requests > 0) {
            $this->success_rate = ($this->successful_requests / $this->total_requests) * 100;
        } else {
            $this->success_rate = 0;
        }
        $this->save();
    }
}
