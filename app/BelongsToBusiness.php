<?php

namespace App;

use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToBusiness
{
    protected static function bootedBelongsToBusiness()
    {
        static::addGlobalScope('business_tenant', function (Builder $builder) {
            $user = static::getTenantUser();
            $tableName = (new static)->getTable();
            
            // 1. BYPASS FOR SUPER ADMIN: Allow them to see everything
            if ($user && $user->user_type === 'super_admin') {
                return;
            }
            
            // 2. STANDARD TENANT LOGIC
            if ($user && $user->business_id !== null) {
                // User is authenticated and has a business_id - filter by it
                $builder->where("{$tableName}.business_id", $user->business_id);
            } else {
                // No authenticated user or user has no business_id - return empty results
                $builder->whereNull("{$tableName}.id");
            }
        });

        // Automatically assign the business_id when creating new records
        static::creating(function ($model) {
            if (empty($model->business_id)) {
                $user = static::getTenantUser();
                
                // Ensure we don't apply super admin's null business_id
                if ($user && $user->user_type !== 'super_admin' && $user->business_id) {
                    $model->business_id = $user->business_id;
                }
            }
        });
    }


    protected static function getTenantUser()
    {
        return Auth::guard('sanctum')->user() 
            ?? Auth::guard('auth')->user() 
            ?? Auth::user();
    }


    public function business()
    {
        return $this->setConnection("mysql")->belongsTo(Business::class);
    }
}