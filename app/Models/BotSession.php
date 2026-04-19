<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BotSession extends Model
{
    //
    protected $fillable = ['platform', 'chat_id', 'customer_id', 'current_state', 'payload'];

    // Automatically cast the JSON payload to a PHP array
    protected $casts = [
        'payload' => 'array',
    ];
}
