<?php

namespace App\Http\Requests;

use App\Models\Network;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

// 
// network
// phone
// data_plan
// bypass (boolean)
// request-id (unique)
class DataPurchaseRequest extends FormRequest
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
        Log::info("Validating data purchase request", ['request' => $this->all()]);
        return [
            //
            'network'   => ['required', 'string', 'exists:networks,code'],
            'phone'     => ['required', 'string', 'regex:/^0[789][01]\d{8}$/', function (string $attribute, mixed $value, Closure $fail) {
                    // Skip if the user explicitly passes "bypass: true" (useful for ported numbers)
                    if ($this->boolean('bypass')) {
                        return;
                    }

                    $networkCode = strtolower($this->input('network'));
                    $prefix = substr($value, 0, 4);

                    // Standard Nigerian Network Prefixes
                    $prefixes = [
                        'mtn'     => ['0803', '0806', '0810', '0813', '0814', '0816', '0703', '0706', '0903', '0906', '0913', '0916'],
                        'glo'     => ['0805', '0807', '0811', '0815', '0705', '0905', '0915'],
                        'airtel'  => ['0802', '0808', '0812', '0701', '0708', '0902', '0907', '0901', '0912'],
                        '9_mobile' => ['0809', '0817', '0818', '0909', '0908'],
                    ];

                    $mappedNetwork = strtolower(Network::where('code', $networkCode)->value('code'));
                    
                    // Validate the prefix
                    if ($mappedNetwork && isset($prefixes[$mappedNetwork])) {
                        if (!in_array($prefix, $prefixes[$mappedNetwork])) {
                            $fail("The phone number {$value} does not appear to be a valid {$this->input('network')} number. If this is a ported number, please use the bypass option.");
                        }
                    }
                },],
            'data_plan' => ['required', 'string', 'exists:data_plans,id'],
            'bypass' => 'sometimes|boolean',
            'request_id' => 'required|string|unique:transactions,request_id',
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

        if ($this->has('phone')) {
            // Remove spaces, hyphens, and convert +234 or 234 to standard 0 format
            $cleanedPhone = preg_replace('/[^0-9]/', '', $this->phone);
            
            if (str_starts_with($cleanedPhone, '234')) {
                $cleanedPhone = '0' . substr($cleanedPhone, 3);
            }

            $this->merge([
                'phone' => $cleanedPhone,
            ]);
        }

         if(!$this->has('tx_ref')) {
            $this->merge([
                "tx_ref" => 'vtm_' . uniqid(),
            ]);
        }

    }
}
