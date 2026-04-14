<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
            'name' => 'nullable|string|max:255',
            'email' => [
                'nullable', 
                'email', 
                // Ensure email is unique across the specific business workspace
                Rule::unique('users')->where(fn ($query) => $query->where('business_id', Auth::user()->business_id))
            ],
            'phone' => 'nullable|string|max:20',
        ];
    }
}
