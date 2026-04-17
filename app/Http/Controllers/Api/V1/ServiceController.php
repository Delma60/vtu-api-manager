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
        return $this->success(
            $data = $response['data'] ?? null, 
            $message = $response['message'] ?? 'Airtime purchase successful', 
            $code = $response['code'] ?? 200,
            $meta = $response
        );
    }
}
