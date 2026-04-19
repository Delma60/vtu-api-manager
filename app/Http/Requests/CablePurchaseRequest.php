<?php

namespace App\Http\Requests;

use App\Models\CablePlan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

// cable
// iuc
// cable_plan
// bypass (boolean)
// request-id (unique)
class CablePurchaseRequest extends FormRequest
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
            'cable' => ['required', 'string', 'exists:network_types,name'],
            'iuc' => ['required', 'string'],
            'cable_plan' => ['required', 'string', function ($attribute, $value, $fail) {
                // Custom validation logic for cable_plan
                $cableNetwork = $this->input('cable');

                $networkType = \App\Models\NetworkType::where('name', strtoupper($cableNetwork))->first();
                if (!$networkType) {
                    $fail("The selected cable network is invalid.");
                    return;
                }
                
                $cablePlan = CablePlan::where('id', $value)
                    ->where('cable_network', $networkType->id)
                    ->first();
                if (!$cablePlan) {
                    $fail("The selected cable plan is invalid for the chosen cable network.");
                }

            }],
            'bypass' => ['sometimes', 'boolean'],
            'tx_ref' => 'required|string|unique:transactions,transaction_reference',
        ];
    }

    protected function prepareForValidation()
    {
        // Ensure bypass is treated as a boolean
        if ($this->has('bypass')) {
            $this->merge([
                'bypass' => filter_var($this->input('bypass'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }
        if(!$this->has('tx_ref')) {
            $this->merge([
                "tx_ref" => 'vtm_' . uniqid(),
            ]);
        }

    }
}
