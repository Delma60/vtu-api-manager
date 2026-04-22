<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\Traits\TenantEnvironmentScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentLink extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentLinkFactory> */
    use HasFactory, BelongsToBusiness, HasUuids, TenantEnvironmentScope;

    protected $fillable = [
        'business_id', 'customer_name', 'customer_email', 'amount',
        'description', 'currency', 'status', 'tx_ref', 'is_reusable',
        'meta', 'service_type',
    ];


    protected $casts = [
        'is_reusable' => 'boolean',
        'meta' => 'array',
    ];

    // success, pending, failed
    // updating status
    function updateStatus($status){
        $this->update(['status' => $status]);
    }

}
