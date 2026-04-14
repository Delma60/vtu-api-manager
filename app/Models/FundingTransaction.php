<?php

namespace App\Models;

use App\BelongsToBusiness;
use Illuminate\Database\Eloquent\Model;

class FundingTransaction extends Model
{
    use BelongsToBusiness;

    //
    protected $table = "transactions";

}
