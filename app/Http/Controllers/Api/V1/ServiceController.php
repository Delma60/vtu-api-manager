<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    //
    function airtime(Request $request){
        $response = service()->airtime()->process($request);
        return response()->json($response, 201);
    }
}
