<?php

namespace App\Models;

use App\Class\Payment\PaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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
        'is_default',
    ];
    protected $appends = [
        "connected"
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
    // CONNECTED ATTRIBUTE
    public function getConnectedAttribute(): bool
    {
        $user = auth()->user();
        
       $provider = PaymentFactory::make($this);
       $provider->isHealthy();
        $key = md5($this->base_url . $this->api_key . $this->api_secret . ($user?->id ?? "") );
        return $provider->isHealthy();
        // return Cache::remember($key, now()->addMinutes(60), function() use($provider) {
        // });
    }

    /**
     * Optional: If you eventually create a pivot table or configuration table 
     * where tenants save their API keys for this gateway, you define the relationship here.
     */
    //
    public function businesses()
    {
        // Assuming you create a 'business_payment_gateways' or 'gateway_configs' table later
        // return $this->belongsToMany(Business::class, 'gateway_configs');
        
        // For now, to prevent the UI from crashing before you build tenant configs, 
        // we can just return a fake empty relationship or comment it out if not strictly needed yet.
    }
}