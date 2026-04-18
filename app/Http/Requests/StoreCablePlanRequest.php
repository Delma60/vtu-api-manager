<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCablePlanRequest extends FormRequest
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
            'network_type_id' => 'required|exists:network_types,id',
            'provider_id' => 'required|exists:providers,id',
            'plan_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ];
    }
}
