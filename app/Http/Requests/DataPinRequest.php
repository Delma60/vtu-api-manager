<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DataPinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'network' => ['required', 'string', 'exists:networks,code'],
            'name' => ['required', 'string'], // e.g. "MTN 1.5GB 30Days"
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'tx_ref' => ['required', 'string', 'unique:transactions,transaction_reference'],
            'bypass' => ['sometimes', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The data plan name is required to generate a data PIN.',
        ];
    }
}
