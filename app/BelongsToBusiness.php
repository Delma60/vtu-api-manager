<?php
// app/Traits/BelongsToBusiness.php
namespace App;

use App\Models\Business;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait BelongsToBusiness
{
    protected static function booted()
    {
        // Automatically scope queries to the currently authenticated user's business
        static::addGlobalScope('business_tenant', function (Builder $builder) {
            if (Auth::check() && !Auth::user()->isSuperAdmin()) {
                $builder->where('business_id', Auth::user()->business_id);
            }
        });

        // Automatically assign the business_id when creating new records
        static::creating(function ($model) {
            if (Auth::check() && !Auth::user()->isSuperAdmin() && empty($model->business_id)) {
                $model->business_id = Auth::user()->business_id;
            }
        });
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}