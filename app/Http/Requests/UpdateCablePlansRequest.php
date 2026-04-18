<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCablePlansRequest extends FormRequest
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
            'cable_network' => 'sometimes|exists:network_types,id',
            'plan_name' => 'sometimes|string|max:255',
            'is_active' => 'boolean',
            // Provider Setup Validation
            'providerable' => ['array'],
            'providerable.provider_id' => ['nullable', 'exists:providers,id'],
            'providerable.server_id' => [
                'nullable', 
                'string', 
                Rule::requiredIf(fn () => !empty($this->input('providerable.provider_id')))
            ],
            'providerable.cost_price' => [
                'nullable', 
                'numeric', 
                'min:0', 
                Rule::requiredIf(fn () => !empty($this->input('providerable.provider_id')))
            ],
            'providerable.margin_value' => [
                'nullable', 
                'numeric', 
                'min:0', 
                Rule::requiredIf(fn () => !empty($this->input('providerable.provider_id')))
            ],
            'providerable.margin_type' => [
                'nullable', 
                'string', 
                Rule::in(['fixed', 'percentage']), 
                Rule::requiredIf(fn () => !empty($this->input('providerable.provider_id')))
            ],
        
        ];
    }
}
