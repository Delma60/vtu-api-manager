<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProviderRequest extends FormRequest
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
            //
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255', 
            // rule to ensure code is unique within the same business and environment
            Rule::unique('providers')
                ->where(fn ($query) => $query->where('business_id', auth()->user()->business_id))
                ->where(fn ($query) => $query->where('environment', auth()->user()->business->mode))
            ],
            'base_url' => ['required', 'url', 'max:255'],
            'api_key' => ['required', 'string', 'max:255'],
            'api_secret' => ['nullable', 'string', 'max:255'],
            'priority' => ['nullable', 'integer', 'min:1'],
            'timeout_ms' => ['nullable', 'integer', 'min:1000'],
            'is_active' => ['nullable', 'boolean'],
            'user_id' => ['required', 'string']
        ];
    }
}
