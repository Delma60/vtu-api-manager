<?php

namespace App;

use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait BelongsToBusiness
{
    // Flag to prevent infinite loops when Auth::user() triggers a database query
    protected static $isResolvingTenantScope = false;

    protected static function bootBelongsToBusiness()
    {
        static::addGlobalScope('business_tenant', function (Builder $builder) {
            // 1. BYPASS FOR CONSOLE: Allow Artisan commands, migrations, and jobs to run freely
            if (app()->runningInConsole()) {
                return;
            }

            // 2. PREVENT INFINITE LOOPS: Stop recursion if Auth is currently querying the User
            if (static::$isResolvingTenantScope) {
                return;
            }


            static::$isResolvingTenantScope = true;
            $user = static::getTenantUser();
            static::$isResolvingTenantScope = false;
            
            $tableName = (new static)->getTable();
            
            // 3. BYPASS
            //  FOR SUPER ADMIN: Allow admins to see everything
            if ($user && $user->user_type === 'admin') {
                return;
            }
            
            // 4. STANDARD TENANT LOGIC
            if ($user && $user->business_id !== null) {
                // User is authenticated and has a business_id - filter by it
                $builder->where("{$tableName}.business_id", $user->business_id);
            } else {
                // No authenticated user. 
                // IMPORTANT: We must skip this fallback for the `users` table, 
                // otherwise login attempts will fail because Laravel won't be able to find the user!
                if ($tableName !== 'users') {
                    $builder->whereNull("{$tableName}.id");
                }
            }
        });

        // Automatically assign the business_id when creating new records
        static::creating(function ($model) {
            if (empty($model->business_id)) {
                
                static::$isResolvingTenantScope = true;
                $user = static::getTenantUser();
                static::$isResolvingTenantScope = false;
                
                // Ensure we don't apply super admin's null business_id
                if ($user && $user->user_type !== 'admin' && $user->business_id) {
                    $model->business_id = $user->business_id;
                }
            }
        });
    }

    protected static function getTenantUser()
    {
        // Note: 'web' is the standard default guard, 'auth' is usually not a valid guard name
        return Auth::guard('sanctum')->user() 
            ?? Auth::guard('web')->user() 
            ?? Auth::user();
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}