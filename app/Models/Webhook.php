<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\BelongsToBusiness;


class Webhook extends Model
{
    /** @use HasFactory<\Database\Factories\WebhookFactory> */
   use HasFactory, BelongsToBusiness;

    protected $fillable = ['url', 'secret', 'is_active', 'business_id'];
}
