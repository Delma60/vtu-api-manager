<?php

namespace App;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRole
{
    /**
     * Get the role associated with the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if the user has a specific role by slug.
     */
    public function hasRole(string|array $roles): bool
    {
        if (!$this->role) {
            return false;
        }

        if (is_array($roles)) {
            return in_array($this->role->slug, $roles);
        }

        return $this->role->slug === $roles;
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string|Role $role): void
    {
        if (is_string($role)) {
            $role = Role::withoutGlobalScope('business_tenant')->where('slug', $role)->where('business_id', $this->business_id)->firstOrFail();
        }

        $this->role_id = $role->id;
        $this->save();
    }

    /**
     * Quick helpers for specific business logic
     */
    public function isAgent(): bool
    {
        return $this->hasRole('agent');
    }

    public function isApiUser(): bool
    {
        return $this->hasRole('api');
    }

    /**
     * Retrieve the profit margin for a specific service type (e.g., 'data', 'airtime')
     * This reads from the JSON column created in the Role migration.
     */
    public function getServiceMargin(string $serviceType, float $baseCost = 0): float
    {
        if (!$this->role || empty($this->role->service_cost_margins)) {
            return $baseCost; // Default fallback
        }

        $margins = collect($this->role->service_cost_margins);
        
        $serviceMargin = $margins->firstWhere('service_type', $serviceType);

        if (!$serviceMargin) {
            return $baseCost;
        }

        $marginValue = (float) ($serviceMargin['margin_profit'] ?? 0);
        $marginType = $serviceMargin['margin_type'] ?? 'fiat';

        // Calculate based on flat fee (fiat) or percentage
        if ($marginType === 'percentage') {
            return $baseCost * (1 + ($marginValue / 100));
        }

        return $baseCost + $marginValue;
    }
}
