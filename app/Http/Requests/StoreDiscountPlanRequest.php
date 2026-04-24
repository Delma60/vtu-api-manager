<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscountPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'network_id' => 'required|exists:networks,id',
            'type' => 'required|in:airtime,exam,airtimeToCash,user_upgrade,bulksms,airtimePin,electricity,airtime2cash',
            'plan_type' => 'nullable',//'required_unless:type,airtimePin|exists:network_types,id',
            'min_amount' => 'numeric|min:0',
            'max_amount' => 'numeric|min:0',
            'pin_source' => 'nullable|in:api,local',
            'pins' => 'nullable|string|required_if:pin_source,local',

            // Make providerable strictly required ONLY if we are using an API provider
            'providerable' => 'nullable|array|required_unless:pin_source,local',
            'providerable.provider_id' => 'nullable|required_unless:pin_source,local',
            'providerable.cost_price' => 'nullable|numeric|min:0',
            'providerable.margin_value' => 'nullable|numeric|min:0',
            'providerable.margin_type' => 'nullable|in:percentage,fixed',
            'providerable.server_id' => 'nullable',
        ];
    }

    public function messages(){
        return [
            'network_id.required' => 'The network ID is required.',
            'network_id.exists' => 'The selected network does not exist.',
            'type.required' => 'The type is required.',
            'type.in' => 'The type must be one of: airtime, exam, airtimeToCash, user_upgrade, bulksms, airtimePin, electricity, airtime2cash.',
            'plan_type.required' => 'The plan type is required.',
            'plan_type.exists' => 'The selected plan type does not exist.',
            'min_amount.numeric' => 'The minimum amount must be a number.',
            'min_amount.min' => 'The minimum amount must be at least 0.',
            'max_amount.numeric' => 'The maximum amount must be a number.',
            'max_amount.min' => 'The maximum amount must be at least 0.',
            'providerable.provider_id.required' => 'The provider ID is required.',
            'providerable.provider_id.exists' => 'The selected provider does not exist.',
            'providerable.cost_price.required' => 'The cost price is required.',
            'providerable.cost_price.numeric' => 'The cost price must be a number.',
            'providerable.cost_price.min' => 'The cost price must be at least 0.',
            'providerable.margin_value.required' => 'The margin value is required.',
            'providerable.margin_value.numeric' => 'The margin value must be a number.',
            'providerable.margin_value.min' => 'The margin value must be at least 0.',
            'providerable.margin_type.required' => 'The margin type is required.',
            'providerable.margin_type.in' => 'The margin type must be either percentage or fixed.',
        ];
    }
}
