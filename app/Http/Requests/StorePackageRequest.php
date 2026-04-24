<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePackageRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|in:monthly,yearly,lifetime',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'settings' => 'nullable|array', // <-- Add validation for settings
            'settings.api_access' => 'boolean',
            'settings.custom_domain' => 'boolean',
            'settings.staff_limit' => 'numeric|min:1',
        ];
    }
}
