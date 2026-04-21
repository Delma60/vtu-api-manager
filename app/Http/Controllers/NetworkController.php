<?php

namespace App\Http\Controllers;

use App\Models\Network;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NetworkController extends Controller
{
    //
        public function store(Request $request)
        {
            $businessId = auth()->user()->business_id;
            $mode = auth()->user()->business->mode;

            $request->validate([
                'name' => [
                    'required', 'string', 'max:255',
                    Rule::unique('networks')
                    ->where(fn ($query) => $query->where('business_id', $businessId))
                    ->where(fn ($query) => $query->where('environment', $mode))

                ],
                'code' => [
                    'required', 'string', 'max:255', 'regex:/^[a-z0-9_]+$/',
                    Rule::unique('networks')
                    ->where(fn ($query) => $query->where('business_id', $businessId))
                    ->where(fn ($query) => $query->where('environment', $mode))

                ],
                'description' => 'nullable|string',
                // 'is_active' => 'boolean',
                'airtime_api_id' => 'nullable|string|max:255',
                'data_api_id' => 'nullable|string|max:255',
                'airtime_pin_api_id' => 'nullable|string|max:255',
                'data_pin_api_id' => 'nullable|string|max:255',

            ]);

            $network = new \App\Models\Network();
            $network->create([
                'name' => $request->name,
                'code' => $request->code,
                'description' => $request->description,
                // 'is_active' => $request->is_active,
                'airtime_api_id' => $request->airtime_api_id,
                'data_api_id' => $request->data_api_id,
                'airtime_pin_api_id' => $request->airtime_pin_api_id,
                'data_pin_api_id' => $request->data_pin_api_id,
                'environment' => $mode,
            ]);

            return redirect()->back()->with('success', 'Network created successfully!');
        }

        // patch/update
        public function update(Request $request, Network $network)
        {
            $validated = $request->validate([
                'name' => 'nullable|string|max:255|unique:networks,name,' . $network->id,
                'code' => 'nullable|string|max:255|unique:networks,code,' . $network->id . '|regex:/^[a-z0-9_]+$/',
                'description' => 'nullable|string',
                'is_active' => 'boolean',
                'airtime_api_id' => 'nullable|string|max:255',
                'data_api_id' => 'nullable|string|max:255',
                'airtime_pin_api_id' => 'nullable|string|max:255',
                'data_pin_api_id' => 'nullable|string|max:255',
            ]);

            $network->update($validated);

            return redirect()->back()->with('success', 'Network updated successfully!');
        }

    public function destroy(Network $network)
    {
        //
        $network->delete();
        return back()->with('success', 'Network deleted successfully');
    }
}
