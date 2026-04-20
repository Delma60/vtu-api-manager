<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSystemBotRequest extends FormRequest
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
        $platform = $this->input('platform');

        // Dynamic validation based on platform
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'platform' => ['required', 'in:telegram,whatsapp'],
        ];

        if ($platform === 'telegram') {
            $rules['credentials.bot_username'] = ['required', 'string'];
            $rules['credentials.bot_token'] = ['required', 'string'];
        } elseif ($platform === 'whatsapp') {
            $rules['credentials.phone_number_id'] = ['required', 'string'];
            $rules['credentials.business_account_id'] = ['required', 'string'];
            $rules['credentials.access_token'] = ['required', 'string'];
            $rules['credentials.webhook_verify_token'] = ['required', 'string'];
        }
        return $rules;
    }
}
