<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $connection = "mysql";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'base_url',
        'logo_url',
        'is_active',
        'api_key',
        'api_secret',
        'identifier',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Optional: If you eventually create a pivot table or configuration table 
     * where tenants save their API keys for this gateway, you define the relationship here.
     */
    public function businesses()
    {
        // Assuming you create a 'business_payment_gateways' or 'gateway_configs' table later
        // return $this->belongsToMany(Business::class, 'gateway_configs');
        
        // For now, to prevent the UI from crashing before you build tenant configs, 
        // we can just return a fake empty relationship or comment it out if not strictly needed yet.
    }
}