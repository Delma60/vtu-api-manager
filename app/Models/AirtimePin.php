<?php

namespace App\Models;

use App\BelongsToBusiness;
use App\EnvironmentAware;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AirtimePin extends Model
{
    //\
    use BelongsToBusiness, EnvironmentAware;
    protected $fillable = [
        'discount_id',
        'network_id',
        'pin',
        'amount',
        'status',
        'transaction_id',
    ];


    function discount():BelongsTo
    {
        return $this->belongsTo(Discount::class);
    }

    function network():BelongsTo
    {
        return $this->belongsTo(Network::class);
    }

    function transaction():BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
