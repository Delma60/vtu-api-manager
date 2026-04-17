<?php

namespace App;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    protected function successResponse(mixed $data = null, string $message = 'Success', int $code = 200, array|object|null $meta = null): JsonResponse
    {
        return $this->buildResponse(
            status: true,
            message: $message,
            code: $code,
            data: $data,
            meta: $meta,
        );
    }

    protected function errorResponse(string $message, int $code = 400, array|object|null $errors = null, array|object|null $meta = null): JsonResponse
    {
        return $this->buildResponse(
            status: false,
            message: $message,
            code: $code,
            errors: $errors,
            meta: $meta,
        );
    }

    protected function failedResponse(string $message, int $code = 400, array|object|null $errors = null, array|object|null $meta = null): JsonResponse
    {
        return $this->errorResponse(message: $message, code: $code, errors: $errors, meta: $meta);
    }

    protected function success(mixed $data = null, string $message = 'Success', int $code = 200, array|object|null $meta = null): JsonResponse
    {
        return $this->successResponse(data: $data, message: $message, code: $code, meta: $meta);
    }

    protected function fail(string $message, int $code = 400, array|object|null $errors = null, array|object|null $meta = null): JsonResponse
    {
        return $this->failedResponse(message: $message, code: $code, errors: $errors, meta: $meta);
    }

    protected function createResponse(mixed $data = null, string $message = 'Resource created', array|object|null $meta = null): JsonResponse
    {
        return $this->successResponse(data: $data, message: $message, code: 201, meta: $meta);
    }

    protected function buildResponse(bool $status, string $message, int $code, mixed $data = null, array|object|null $errors = null, array|object|null $meta = null): JsonResponse
    {
        $payload = [
            'status'  => $status,
            'message' => $message,
        ];

        if ($status || $data !== null) {
            $payload['data'] = $data;
        }

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $code);
    }
}