<?php

namespace App\Class\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Vtpass extends ProviderAbstract
{
    protected string $baseUrl;
    
    public function __construct($providerModel = null)
    {
        parent::__construct($providerModel);

        // Set the Base URL based on your provider's mode
        $this->baseUrl = $this->provider->mode === 'live' 
            ? 'https://vtpass.com/api' 
            : 'https://sandbox.vtpass.com/api';
    }

    /**
     * VTPass typically uses Basic Auth with Email:Password, 
     * but newer integrations use Api-Key and Secret-Key. 
     * Adjust this based on what you saved in your DB.
     */
    protected function getAuthHeaders(): array
    {
        // Assuming your DB `api_key` column holds the username/email
        // and `secret_key` holds the password
        $credentials = base64_encode("{$this->provider->api_key}:{$this->provider->secret_key}");

        return [
            'Authorization' => 'Basic ' . $credentials,
            'Content-Type'  => 'application/json',
        ];
    }

    // =========================================================================
    // Interface / Abstract Required Methods
    // =========================================================================

    public function login()
    {
        // VTPass uses API Keys per request, so no session login is required.
        return true;
    }

    public function endpoint($path = '')
    {
        return rtrim($this->baseUrl, '/') . '/' . ltrim($path, '/');
    }

    public function pingEndpoint()
    {
        return $this->endpoint('balance');
    }

    public function getSupportedServices()
    {
        return ['airtime', 'data', 'cable', 'electricity', 'education'];
    }

    public function formatPayload($service, $data = [])
    {
        return $data; // VTPass payload formatting is handled inside executePay()
    }

    public function sendRequest($method, $endpoint, $data = [])
    {
        $url = $this->endpoint($endpoint);

        if (strtolower($method) === 'get') {
            return Http::withHeaders($this->getAuthHeaders())->timeout(45)->get($url, $data);
        }

        return Http::withHeaders($this->getAuthHeaders())->timeout(45)->post($url, $data);
    }

    public function formatResponse($response)
    {
        $data = $response->json();

        return [
            'status' => in_array($data['code'] ?? '', ['000', '099']),
            'message' => $data['response_description'] ?? 'No message',
            'data' => $data,
            'raw' => $response->body()
        ];
    }

    public function normalizeError($response)
    {
        $data = is_array($response) ? $response : $response->json();
        return $data['response_description'] ?? 'An error occurred with the provider.';
    }

    public function checkBalance()
    {
        try {
            $response = $this->sendRequest('GET', 'balance');
            $data = $response->json();

            if (isset($data['code']) && $data['code'] === '000') {
                return $data['contents']['balance'] ?? 0.00;
            }
            return 0.00;
        } catch (\Exception $e) {
            return 0.00;
        }
    }

    public function verifyTransaction($reference)
    {
        $response = $this->sendRequest('POST', 'requery', [
            'request_id' => $reference
        ]);

        $data = $response->json();

        if (isset($data['code']) && $data['code'] === '000') {
            return [
                'status' => 'successful',
                'message' => $data['response_description'] ?? 'Transaction Successful',
                'raw' => $data
            ];
        } elseif (isset($data['code']) && $data['code'] === '099') {
            return [
                'status' => 'pending',
                'message' => 'Transaction is still pending',
                'raw' => $data
            ];
        }

        return [
            'status' => 'failed',
            'message' => $data['response_description'] ?? 'Transaction Failed',
            'raw' => $data
        ];
    }

    public function verifyUser($service, $accountNumber)
    {
        $response = $this->sendRequest('POST', 'merchant-verify', [
            'billersCode' => $accountNumber,
            'serviceID' => strtolower($service)
        ]);

        $data = $response->json();

        if (isset($data['code']) && $data['code'] === '000') {
            return [
                'status' => true,
                'name' => $data['content']['Customer_Name'] ?? 'Verified User',
                'raw' => $data
            ];
        }

        return [
            'status' => false,
            'name' => null,
            'message' => $data['response_description'] ?? 'Verification failed'
        ];
    }

    public function callback(\Illuminate\Http\Request $request)
    {
        // Handle VTPass webhook/callback responses here if needed
        return response()->json(['status' => 'success']);
    }

    public function diagnose()
    {
        $balance = $this->checkBalance();
        return [
            'status' => true,
            'message' => "VTPass is connected. Wallet Balance: ₦{$balance}"
        ];
    }

    /**
     * VTPass requires a VERY specific Request ID format:
     * Format: YYYYMMDDHHII + random alphanumeric
     */
    protected function generateRequestId(): string
    {
        return now()->format('YmdHi') . strtolower(Str::random(10));
    }

    /**
     * Helper to map your internal network IDs to VTPass Airtime Service IDs
     */
    protected function getAirtimeServiceId(string $networkName): string
    {
        return match (strtolower($networkName)) {
            'mtn' => 'mtn',
            'airtel' => 'airtel',
            'glo' => 'glo',
            '9mobile', 'etisalat' => 'etisalat',
            default => throw new \Exception("Unsupported Airtime Network for VTPass"),
        };
    }

    /**
     * Helper to map your internal network IDs to VTPass Data Service IDs
     */
    protected function getDataServiceId(string $networkName): string
    {
        return match (strtolower($networkName)) {
            'mtn' => 'mtn-data',
            'airtel' => 'airtel-data',
            'glo' => 'glo-data',
            '9mobile', 'etisalat' => 'etisalat-data',
            default => throw new \Exception("Unsupported Data Network for VTPass"),
        };
    }

    // =========================================================================
    // Core Transaction Methods
    // =========================================================================

    public function buyAirtime(string $phone, float $amount, string $networkName): array
    {
        $payload = [
            'request_id' => $this->generateRequestId(),
            'serviceID'  => $this->getAirtimeServiceId($networkName),
            'amount'     => $amount,
            'phone'      => $phone,
        ];

        return $this->executePay($payload);
    }

    public function buyData(string $phone, string $providerPlanId, string $networkName): array
    {
        $payload = [
            'request_id'     => $this->generateRequestId(),
            'serviceID'      => $this->getDataServiceId($networkName),
            'billersCode'    => $phone, // VTPass uses billersCode for data recipient
            'variation_code' => $providerPlanId, // e.g., "mtn-10mb-100"
            'phone'          => $phone,
        ];

        return $this->executePay($payload);
    }

    public function buyCable(string $smartcard, string $providerPlanId, string $serviceId, string $subscriptionType = 'change'): array
    {
        // $serviceId should be "dstv", "gotv", or "startimes"
        $payload = [
            'request_id'        => $this->generateRequestId(),
            'serviceID'         => strtolower($serviceId),
            'billersCode'       => $smartcard,
            'variation_code'    => $providerPlanId, // e.g., "gotv-lite"
            'phone'             => '08011111111', // Dummy/Agent phone number
            'subscription_type' => $subscriptionType, // "change" or "renew"
        ];

        return $this->executePay($payload);
    }

    /**
     * Centralized execution method since ALL VTPass purchases use POST /pay
     */
    protected function executePay(array $payload): array
    {
        try {
            $response = Http::withHeaders($this->getAuthHeaders())
                ->timeout(45)
                ->post($this->baseUrl . '/pay', $payload);

            $data = $response->json();

            // VTPass returns code "000" for success, "099" for pending
            if (in_array($data['code'] ?? '', ['000', '099'])) {
                return [
                    'status'    => true,
                    'reference' => $payload['request_id'],
                    'message'   => $data['response_description'] ?? 'Transaction successful',
                    'raw'       => $data,
                ];
            }

            return [
                'status'  => false,
                'message' => $data['response_description'] ?? 'Transaction failed',
                'raw'     => $data,
            ];

        } catch (\Exception $e) {
            Log::error('VTPass API Exception', ['error' => $e->getMessage(), 'payload' => $payload]);
            return [
                'status'  => false,
                'message' => 'Provider timeout or internal error.',
                'raw'     => null,
            ];
        }
    }

    // =========================================================================
    // Requery & Validation Methods
    // =========================================================================

    public function verifySmartcard(string $smartcardNumber, string $serviceId): array
    {
        $response = Http::withHeaders($this->getAuthHeaders())
            ->post($this->baseUrl . '/merchant-verify', [
                'billersCode' => $smartcardNumber,
                'serviceID'   => strtolower($serviceId), // e.g., 'dstv'
            ]);

        $data = $response->json();

        if (isset($data['code']) && $data['code'] === '000') {
            return [
                'status'        => true,
                'customer_name' => $data['content']['Customer_Name'] ?? 'Verified Customer',
            ];
        }

        return ['status' => false, 'message' => $data['response_description'] ?? 'Invalid Smartcard'];
    }

    public function requeryTransaction(string $requestId): array
    {
        $response = Http::withHeaders($this->getAuthHeaders())
            ->post($this->baseUrl . '/requery', [
                'request_id' => $requestId,
            ]);

        return $response->json() ?? [];
    }

    /**
     * Fetch service variations from VTPass API
     */
    public function getPlans(string $serviceId): array
    {
        $response = Http::withHeaders($this->getAuthHeaders())
            ->get($this->baseUrl . '/service-variations?serviceID=' . $serviceId);

        $payload = $response->json();

        if (!isset($payload['content']['variations'])) {
            return [];
        }

        return collect($payload['content']['variations'])->map(function ($plan) use ($serviceId) {
            return [
                // This 'variation_code' is what goes into your DataPlan `provider_plan_id` column
                'provider_plan_id' => $plan['variation_code'], 
                'name'             => $plan['name'],
                'amount'           => (float) $plan['variation_amount'],
                'raw_service_id'   => $serviceId,
            ];
        })->toArray();
    }
}
