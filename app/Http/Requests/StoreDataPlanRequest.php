<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDataPlanRequest extends FormRequest
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
            'network_id' => ['required', 'exists:networks,id'],
            'plan_type' => ['required', 'exists:network_types,id'],
            'plan_size' => ['required', 'in:mb,gb'],
            'validity' => ['nullable', 'string', 'max:100'],
            'volume' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            
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

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'network_id.required' => 'The network is required.',
            'network_id.exists' => 'The selected network is invalid.',
            'plan_type.required' => 'The plan type is required.',
            'plan_type.exists' => 'The selected plan type is invalid.',
            'name.required' => 'The plan name is required.',
            'name.string' => 'The plan name must be a string.',
            'name.max' => 'The plan name may not be greater than 255 characters.',
            'plan_size.required' => 'The plan size is required.',
            'plan_size.in' => 'The plan size must be either MB or GB.',
            'validity.string' => 'The validity must be a string.',
            'validity.max' => 'The validity may not be greater than 100 characters.',
            'cost_price.required' => 'The cost price is required.',
            'cost_price.numeric' => 'The cost price must be a number.',
            'cost_price.min' => 'The cost price must be at least 0.',
            'selling_price.required' => 'The selling price is required.',
            'selling_price.numeric' => 'The selling price must be a number.',
            'selling_price.min' => 'The selling price must be at least 0.',
            'is_active.boolean' => 'The active status must be true or false.',
            'providerable.array' => 'The provider setup must be an array.',
            'providerable.provider_id.exists' => 'The selected provider is invalid.',
            'providerable.server_id.required' => 'The server ID is required when a provider is selected.',
            'providerable.server_id.string' => 'The server ID must be a string.',
            'providerable.cost_price.required' => 'The provider cost price is required when a provider is selected.',
            'providerable.cost_price.numeric' => 'The provider cost price must be a number.',
            'providerable.cost_price.min' => 'The provider cost price must be at least 0.',
            'providerable.margin_value.required' => 'The margin value is required when a provider is selected.',
            'providerable.margin_value.numeric' => 'The margin value must be a number.',
            'providerable.margin_value.min' => 'The margin value must be at least 0.',
            'providerable.margin_type.required' => 'The margin type is required when a provider is selected.',
            'providerable.margin_type.string' => 'The margin type must be a string.',
            'providerable.margin_type.in' => 'The margin type must be either fixed or percentage.',
        ];
    }
}
