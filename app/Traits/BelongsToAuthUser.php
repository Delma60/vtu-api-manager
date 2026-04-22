<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToAuthUser
{
    /**
     * Boot the trait to apply the global scope and creating event.
     */
    protected static function bootBelongsToAuthUser(): void
    {
        // 1. Automatically assign user_id when creating a new record
        static::creating(function ($model) {
            if (empty($model->user_id) && auth()->check()) {
                $model->user_id = auth()->id();
            }
        });

        // 2. Automatically filter all queries by the logged-in user
        static::addGlobalScope('auth_user_scope', function (Builder $builder) {
            // Apply the scope ONLY if a user is logged in AND they are not an admin
            if (auth()->check() && auth()->user()->user_type !== 'admin') {
                
                // We grab the table name dynamically so this doesn't cause 
                // "ambiguous column" SQL errors when you use JOINs later.
                $table = $builder->getQuery()->from;
                $builder->where($table . '.user_id', auth()->id());
            }
        });
    }

    /**
     * Optional: A standard relationship back to the user
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}