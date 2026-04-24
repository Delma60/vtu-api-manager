<?php

namespace App\Services\Vtu;

use App\Models\Discount;
use App\Models\Network;
use App\Models\AirtimePin; // Serves as your Local PIN inventory model
use App\Models\User;
use App\Services\ProviderService;
use App\Services\TransactionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PinProcessor
{
    public function __construct(protected TransactionService $transactionService) {}

    /**
     * @param string $serviceType Accepts 'airtime_pin' or 'data_pin'
     */
    public function process(User $user, array $payload, string $serviceType = 'airtime_pin'): array
    {
        $quantity = $payload['quantity'] ?? 1;
        $totalAmount = $payload['amount'] * $quantity;
        $txRef = $payload['tx_ref'] ?? 'PIN_' . uniqid();
        $payload['tx_ref'] = $txRef;
        $networkCode = $payload['network'];

        // 1. Check User Balance
        if ($user->wallet->balance < $totalAmount) {
            return ['status' => 'error', 'message' => 'Insufficient wallet balance.'];
        }

        // 2. Resolve Network & Plan to determine Routing (API vs Local)
        $network = Network::where('code', $networkCode)->first();
        if (!$network) {
            return ['status' => 'error', 'message' => 'Invalid network specified.'];
        }

        $routingMode = 'api'; // Default to API

        // Build query to find the specific PIN plan
        $query = Discount::where('network_id', $network->id)
            ->whereIn('type', ['airtime_pin', 'airtimePin', 'data_pin', 'dataPin'])
            ->with('providers');

        // Data PINs usually match by volume/name (e.g. "MTN 1.5GB"), Airtime matches by amount (e.g. 100)
        if ($serviceType === 'data_pin' && !empty($payload['name'])) {
            $query->where('name', $payload['name']);
        } else {
            $query->where('min_amount', $payload['amount']);
        }

        $discountPlan = $query->first();

        if (!$discountPlan) {
            return ['status' => 'error', 'message' => 'No PIN plan found for this specification.'];
        }

        // If no providers are attached, it means it's a Local Database Upload plan
        if ($discountPlan->providers->isEmpty()) {
            $routingMode = 'local';
        }

        $localPins = collect();

        // 3. Pre-flight Check for Local Inventory
        if ($routingMode === 'local') {
            DB::beginTransaction();
            try {
                // Retrieve unused pins and lock the rows to prevent double-spending
                $localPins = AirtimePin::where('discount_id', $discountPlan->id)
                    ->where('status', 'unused')
                    ->lockForUpdate() 
                    ->limit($quantity)
                    ->get();

                if ($localPins->count() < $quantity) {
                    DB::rollBack();
                    return ['status' => 'error', 'message' => "Only {$localPins->count()} PIN(s) left in inventory. Please reduce quantity."];
                }
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Local PIN Fetch Error ({$serviceType}): " . $e->getMessage());
                return ['status' => 'error', 'message' => 'System busy, unable to allocate PINs.'];
            }
        }

        // 4. Initialize Transaction (This deducts the wallet)
        try {
            $transaction = $this->transactionService->initialize($user, [
                'transaction_reference' => $txRef,
                'provider' => $networkCode,
                'platform' => $payload['platform'] ?? 'api',
                'transaction_type' => $serviceType, // 'airtime_pin' or 'data_pin'
                'account_or_phone' => 'N/A', // PINs don't need a phone number
                'amount' => $totalAmount,
                'quantity' => $quantity,
                'discount_amount' => $payload['discount_amount'] ?? 0.00,
            ]);
        } catch (\Exception $e) {
            if ($routingMode === 'local') DB::rollBack(); // Release locks if deduction fails
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        // 5. Process the Dispensation
        if ($routingMode === 'local') {
            // --- HANDLE LOCAL PINS ---
            try {
                $pinStrings = [];
                foreach ($localPins as $pinModel) {
                    $pinModel->update([
                        'status' => 'used',
                        'transaction_id' => $transaction->id
                    ]);
                    $pinStrings[] = $pinModel->pin;
                }

                DB::commit(); // Save changes and release locks

                $response = [
                    'status' => 'success',
                    'message' => "{$quantity} PIN(s) generated successfully.",
                    'data' => [
                        'pins' => $pinStrings
                    ]
                ];

                $this->transactionService->markAsSuccessful($transaction, $response, ['pins' => $pinStrings]);
                return $response;

            } catch (\Exception $e) {
                DB::rollBack();
                $this->transactionService->markAsFailed($transaction, 'Error allocating local PINs', ['error' => $e->getMessage()]);
                return ['status' => 'error', 'message' => 'An error occurred while dispensing PINs. Wallet refunded.'];
            }

        } else {
            // --- HANDLE EXTERNAL API PINS ---
            if (DB::transactionLevel() > 0) DB::rollBack();

            try {
                // Determine the base provider type required by your system
                $baseTarget = $serviceType === 'data_pin' ? 'data' : 'airtime';
                $provider = ProviderService::getProviderInstance($baseTarget); 
                
                // Format and send request to the external API
                $formattedPayload = $provider->formatPayload($serviceType, $payload);
                $response = $provider->sendRequest($serviceType, $formattedPayload);

                if (isset($response['status']) && $response['status'] === 'success') {
                    $metaData = [];
                    if (isset($response['data']['pins'])) {
                         $metaData['pins'] = $response['data']['pins'];
                    }

                    $this->transactionService->markAsSuccessful($transaction, $response, $metaData);
                    return $response;
                }

                $this->transactionService->markAsFailed($transaction, $response['message'] ?? 'Provider failed to process', $response);
                return $response;

            } catch (\Exception $e) {
                Log::error("API PIN Processing Error ({$serviceType}): " . $e->getMessage());
                $this->transactionService->markAsFailed($transaction, 'An unexpected external provider error occurred.', ['error' => $e->getMessage()]);
                return ['status' => 'error', 'message' => 'An unexpected error occurred. Wallet refunded.'];
            }
        }
    }
}