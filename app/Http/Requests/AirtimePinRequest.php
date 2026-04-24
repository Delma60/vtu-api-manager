<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AirtimePinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'network' => ['required', 'string', 'exists:networks,code'],
            'amount' => ['required', 'numeric', 'min:50'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:50'], // Limit max pins per request
            'tx_ref' => ['required', 'string', 'unique:transactions,transaction_reference'],
            'bypass' => ['sometimes', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'network.exists' => 'The provided network code is invalid.',
            'tx_ref.unique' => 'This transaction reference has already been used.'
        ];
    }
}