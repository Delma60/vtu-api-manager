<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AirtimeServiceRequest;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    //
    function airtime(AirtimeServiceRequest $request){

        $response = service()->airtime()->process($request->validated());
        return response()->json($response, 201);
    }
}
