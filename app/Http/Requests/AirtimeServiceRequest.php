<?php

namespace App\Http\Requests;

use App\Models\Network;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AirtimeServiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Assuming authorization is handled by middleware (e.g., auth:sanctum)
        return true; 
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
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

        // add tx_ref
        if(!$this->has('tx_ref')) {
            $this->merge([
                "tx_ref" => 'vtm_' . uniqid(),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
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

                    // Map your DB network codes to the prefix array keys 
                    // (e.g., if your DB uses '9MOB' instead of '9mobile', map it here)
                    

                    $networkMap = [
                        'mtn' => 'mtn',
                        'glo' => 'glo',
                        'airtel' => 'airtel',
                        '9mobile' => '9mobile',
                        'etisalat' => '9mobile',
                    ];

                    // Get the string value directly and make sure it's lowercase to match your array keys
                    // ->value() directly queries and returns just the string column value
                    $mappedNetwork = strtolower(Network::where('code', $networkCode)->value('code'));
                    // $mappedNetwork =  Network::where('code', $networkCode)->firstOrFail()->pluck("code");
                    // $networkMap[$networkCode] ?? null;

                    // Validate the prefix
                    if ($mappedNetwork && isset($prefixes[$mappedNetwork])) {
                        if (!in_array($prefix, $prefixes[$mappedNetwork])) {
                            $fail("The phone number {$value} does not appear to be a valid {$this->input('network')} number. If this is a ported number, please use the bypass option.");
                        }
                    }
                },],
            'plan_type' => ['required', 'string', function (string $attribute, mixed $value, Closure $fail) {
                    $networkCode = $this->input('network');
                    
                    // Fetch the network using the code provided in the request
                    $network = Network::where('code', $networkCode)->first();

                    // If network doesn't exist, skip this check (the 'network' exists rule will catch it)
                    if (!$network) {
                        return;
                    }

                    // Check if this specific Network has a NetworkType with the provided name
                    // This automatically scopes to typeable_id and typeable_type behind the scenes!
                    $isValidPlan = $network->networkTypes()->where('name', $value)->exists();

                    if (!$isValidPlan) {
                        $fail("The selected plan type '{$value}' is not available for the {$network->name} network.");
                    }
                }],
            'amount'    => ['required', 'integer', 'min:1'], 
            'bypass'    => ['sometimes', 'boolean'],
            'tx_ref'    => ['required', 'string', 'unique:transactions,transaction_reference'],
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
            'phone.regex' => 'Please enter a valid Nigerian phone number (e.g., 08012345678).',
            'network.exists' => 'The selected network provider is currently not supported.',
            'plan_type.exists' => 'The selected plan type is invalid.',
        ];
    }
}