<?php

namespace App\Class\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Vtpass extends ProviderAbstract
{
    protected string $providerName = 'vtpass';

    /**
     * Resolves the Base URL dynamically based on the sandbox state
     */
    protected function baseUrl(): string
    {
        return $this->isSandbox 
            ? 'https://sandbox.vtpass.com/api' 
            : 'https://vtpass.com/api';
    }

    /**
     * Required by Abstract: Returns standard auth headers
     */
    protected function getAuthHeaders(): array
    {
        return [
            'api-key'      => $this->provider->api_key,
            'secret-key'   => $this->provider->secret_key,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Required by Abstract: Build the endpoint path for a specific service
     */
    protected function endpoint(string $service): string
    {
        return match (strtolower($service)) {
            'airtime', 'data', 'cable', 'electricity', 'education' => '/pay',
            'balance' => '/balance',
            'verify'  => '/merchant-verify',
            'requery' => '/requery',
            default   => '/pay',
        };
    }

    protected function buildEndpoint(string $service): string
    {
        return $this->baseUrl() . $this->endpoint($service);
    }

    /**
     * Required by Abstract: Ping endpoint for health checks
     */
    protected function pingEndpoint(): string
    {
        return $this->buildEndpoint('balance');
    }

    /**
     * Required by Interface: Formats payload directly to VTPass requirements
     */
    public function formatPayload(string $service, array $payload): array
    {
        $requestId = now()->timezone('Africa/Lagos')->format('YmdHi') . strtolower(Str::random(10));
        $txRef = $payload['tx_ref'] ?? $requestId;

        if ($service === 'airtime') {
            return [
                'request_id' => $txRef,
                'serviceID'  => $this->getServiceNetworkName($payload['network'] ?? '', 'airtime'),
                'amount'     => $payload['amount'],
                'phone'      => $payload['phone'],
            ];
        }

        if ($service === 'data') {
            return [
                'request_id'     => $txRef,
                'serviceID'      => $this->getServiceNetworkName($payload['network'] ?? '', 'data'),
                'billersCode'    => $payload['phone'], 
                'variation_code' => $payload['plan_id'] ?? $payload['data_plan'] ?? '', 
                'phone'          => $payload['phone'],
                'amount'         => $payload['amount'] ?? null, 
            ];
        }

        if ($service === 'cable') {
            return [
                'request_id'        => $txRef,
                'serviceID'         => strtolower($payload['cable_network'] ?? $payload['cable_name'] ?? ''), 
                'billersCode'       => $payload['iuc'] ?? $payload['smartcard_number'] ?? '',
                'variation_code'    => $payload['plan_id'] ?? $payload['cable_plan'] ?? '', 
                'phone'             => $payload['phone'] ?? '08011111111', 
                'subscription_type' => $payload['subscription_type'] ?? 'change',
            ];
        }

        if ($service === 'electricity') {
            return [
                'request_id'     => $txRef,
                'serviceID'      => $payload['disco'] ?? '',
                'billersCode'    => $payload['meter_number'] ?? '',
                'variation_code' => strtolower($payload['meter_type'] ?? 'prepaid'),
                'amount'         => $payload['amount'],
                'phone'          => $payload['phone'] ?? '08011111111',
            ];
        }

        return $payload;
    }

    /**
     * Helper to map internal networks to VTPass exact Service IDs
     */
    protected function getServiceNetworkName(string|int $network, string $type): string
    {
        // Support parsing mapped IDs as fallback
        $networkMap = [1 => 'mtn', 2 => 'airtel', 3 => 'glo', 4 => 'etisalat'];
        
        $networkName = is_numeric($network) && isset($networkMap[$network]) 
            ? $networkMap[$network] 
            : strtolower((string)$network);

        if (in_array($networkName, ['9mobile', 'etisalat'])) {
            $networkName = 'etisalat';
        }

        return $type === 'data' ? "{$networkName}-data" : $networkName;
    }

    /**
     * Required by Abstract: Executes the HTTP call
     */
    public function sendRequest(string $service, array $payload): array
    {
        $response = Http::withHeaders($this->getAuthHeaders())
            ->timeout($this->getTimeout())
            ->post($this->buildEndpoint($service), $payload);

        return $response->json() ?? [];
    }

    /**
     * Required by Abstract: Parses VTPass API response to system standard
     */
    protected function formatResponse(string $service, array $response): array
    {
        $isSuccess = isset($response['code']) && in_array($response['code'], ['000', '099']);
        
        $default = [
            'provider'              => $this->providerName,
            'status'                => $isSuccess ? 'success' : 'fail',
            'transaction_reference' => $response['requestId'] ?? null,
            'payment_reference'     => $response['content']['transactions']['transactionId'] ?? null,
            'response_message'      => $response['response_description'] ?? 'Transaction processed',
            'completed_at'          => now(),
            'service_fee'           => 0.00,
            'platform'              => 'api',
        ];

        // Service specific mappings
        $transaction = $response['content']['transactions'] ?? [];
        switch ($service) {
            case 'airtime':
                $default['transaction_type'] = 'airtime_recharge';
                $default['amount'] = $transaction['amount'] ?? 0.00;
                $default['receiver'] = $transaction['unique_element'] ?? null;
                break;
            case 'data':
                $default['transaction_type'] = 'data_subscription';
                $default['amount'] = $transaction['amount'] ?? 0.00;
                $default['receiver'] = $transaction['unique_element'] ?? null;
                break;
            case 'cable':
                $default['transaction_type'] = 'cable_subscription';
                $default['amount'] = $transaction['amount'] ?? 0.00;
                $default['receiver'] = $transaction['unique_element'] ?? null;
                break;
            case 'electricity':
                $default['transaction_type'] = 'electricity_bill';
                $default['amount'] = $transaction['amount'] ?? 0.00;
                $default['receiver'] = $transaction['unique_element'] ?? null;
                $default['token'] = $response['purchased_code'] ?? $response['token'] ?? null;
                break;
        }

        return $default;
    }

    /**
     * Required by Abstract: Verify User (Cable / Electricity)
     */
    public function verifyUser(string $service, string $identifier, array $payload): mixed
    {
        if (!in_array($service, ['cable', 'electricity'])) {
            return [
                'status'  => 'error',
                'message' => "Verification not supported for service: {$service}",
                'data'    => null,
            ];
        }

        $serviceId = $service === 'cable' 
            ? strtolower($payload['cable_network'] ?? $payload['cable_name'] ?? '')
            : strtolower($payload['disco'] ?? '');

        $type = $payload['meter_type'] ?? 'prepaid';

        try {
            $response = Http::withHeaders($this->getAuthHeaders())
                ->timeout($this->getTimeout())
                ->post($this->buildEndpoint('verify'), [
                    'billersCode' => $identifier,
                    'serviceID'   => $serviceId,
                    'type'        => $type,
                ]);

            $data = $response->json();

            if (isset($data['code']) && $data['code'] === '000') {
                return [
                    'status'  => 'success',
                    'message' => 'Verification successful',
                    'data'    => [
                        'name' => $data['content']['Customer_Name'] ?? 'Verified Customer',
                        'raw'  => $data
                    ]
                ];
            }

            return [
                'status'  => 'error',
                'message' => $data['response_description'] ?? 'Invalid Account / Smartcard details',
                'data'    => null
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'error',
                'message' => $e->getMessage(),
                'data'    => null
            ];
        }
    }

    /**
     * Required by Interface: Check Wallet Balance
     */
    public function checkBalance(): string
    {
        try {
            $response = Http::withHeaders($this->getAuthHeaders())
                ->timeout($this->getTimeout())
                ->get($this->buildEndpoint('balance'));

            $data = $response->json();

            if (isset($data['code']) && $data['code'] === '000') {
                return (string) ($data['contents']['balance'] ?? '0.00');
            }

            return '0.00';
        } catch (\Exception $e) {
            Log::error('VTPass Check Balance Error: ' . $e->getMessage());
            return '0.00';
        }
    }

    /**
     * Required by Abstract: Verify/Requery Transaction
     */
    public function verifyTransaction(string $tx_ref): array
    {
        try {
            $response = Http::withHeaders($this->getAuthHeaders())
                ->timeout($this->getTimeout())
                ->post($this->buildEndpoint('requery'), [
                    'request_id' => $tx_ref
                ]);

            $data = $response->json();

            if (isset($data['code']) && in_array($data['code'], ['000', '099'])) {
                return [
                    'status'  => 'success',
                    'message' => $data['response_description'] ?? 'Transaction verified successfully',
                    'data'    => $data
                ];
            }

            return [
                'status'  => 'failed',
                'message' => $data['response_description'] ?? 'Transaction failed',
                'data'    => $data
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'pending',
                'message' => 'Could not verify transaction at this time.',
                'data'    => []
            ];
        }
    }

    /**
     * Required by Abstract: Standardize Callback Format
     */
    protected function callback(Request $request): array
    {
        $payload = $request->all();
        
        return [
            "status" => (isset($payload['code']) && $payload['code'] === '000') ? 'success' : 'failed',
            "tx_ref" => $payload['requestId'] ?? null,
        ];
    }

    /**
     * Required by Abstract: Fetch and format plans
     */
    protected function getPlans(?array $payload = null): mixed
    {
        $serviceId = $payload['service_id'] ?? 'mtn-data';

        $response = Http::withHeaders($this->getAuthHeaders())
            ->timeout($this->getTimeout())
            ->get($this->baseUrl() . '/service-variations?serviceID=' . $serviceId);

        $data = $response->json();

        if (!isset($data['content']['variations'])) {
            return [];
        }

        return collect($data['content']['variations'])->map(function ($plan) {
            return [
                'provider_plan_id' => $plan['variation_code'],
                'name'             => $plan['name'],
                'amount'           => (float) $plan['variation_amount'],
                'validity'         => '30 Days', 
            ];
        })->toArray();
    }

    /**
     * Required by Abstract: Normalize API Errors to standard readable format
     */
    protected function normalizeError(array $responseData, string $service): string
    {
        $rawMessage = $responseData['response_description'] ?? $responseData['message'] ?? '';

        if (empty($rawMessage)) {
            return 'Transaction failed due to an unknown provider error.';
        }

        $messageLower = strtolower($rawMessage);

        if (str_contains($messageLower, 'low wallet balance') || str_contains($messageLower, 'insufficient balance')) {
            $this->diagnose($service, 'Insufficient Balance', $rawMessage, 'warning');
            return 'This service is currently unavailable due to provider capacity. Please try again later.';
        }

        return $rawMessage;
    }

    /**
     * Required by Abstract: Diagnostics Log
     */
    public function diagnose(string $service, string $title, string $body, ?string $type = "error"): void
    {
        $meta = $this->provider->meta ?? [];
        $diagnostics = $meta['diagnostics'] ?? [];

        $diagnostics[] = [
            "time"     => now()->toDateTimeString(),
            "endpoint" => $this->endpoint($service),
            "body"     => $body,
            'title'    => $title,
            'type'     => $type,
        ];

        if (count($diagnostics) > 10) {
            $diagnostics = array_slice($diagnostics, -10);
        }

        $meta['diagnostics'] = $diagnostics;

        $this->provider->update([
            'meta' => $meta
        ]);
    }

    /**
     * Required by Interface: Login Method
     */
    public function login(): mixed
    {
        // VTPass handles auth via Keys natively, so we default to returning success mock
        return ['status' => 'success'];
    }

    /**
     * Required by Abstract
     */
    protected function getSupportedServices(): array
    {
        return ['airtime', 'data', 'cable', 'electricity', 'education'];
    }
}