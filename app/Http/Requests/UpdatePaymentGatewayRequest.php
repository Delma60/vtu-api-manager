<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentGatewayRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50'],
            'base_url' => ['nullable', 'url'],
            'logo_url' => ['nullable', 'url'],
            'is_active' => ['boolean'],
            'is_default' => ['boolean'],
            'api_secret' => ['required', 'string', 'max:255'],
            'api_key' => ['required', 'string', 'max:255'],
        ];
    }
}
