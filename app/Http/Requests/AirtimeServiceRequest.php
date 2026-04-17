<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AirtimeServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Assuming authorization is handled by middleware (e.g., auth:sanctum)
        return true; 
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('phone')) {
            // Remove spaces, hyphens, and convert +234 or 234 to standard 0 format
            $cleanedPhone = preg_replace('/[^0-9]/', '', $this->phone);
            
            if (str_starts_with($cleanedPhone, '234')) {
                $cleanedPhone = '0' . substr($cleanedPhone, 3);
            }

            $this->merge([
                'phone' => $cleanedPhone,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'network'   => ['required', 'string', 'exists:networks,code'],
            'phone'     => ['required', 'string', 'regex:/^0[789][01]\d{8}$/'],
            'plan_type' => ['required', 'string', 'exists:network_types,name'],
            'amount'    => ['required', 'integer', 'min:1'], 
            'bypass'    => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Please enter a valid Nigerian phone number (e.g., 08012345678).',
            'network.exists' => 'The selected network provider is currently not supported.',
            'plan_type.exists' => 'The selected plan type is invalid.',
        ];
    }
}