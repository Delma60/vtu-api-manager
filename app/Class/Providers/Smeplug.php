<?php

namespace App\Class\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Smeplug extends ProviderAbstract
{
    /**
     * Get the authentication headers required by SME Plug.
     */
    protected function getAuthHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->provider->api_secret,
            'Content-Type'  => 'application/json',
            'Accept'        => 'application/json',
        ];
    }

    /**
     * Used by the abstract class isHealthy() method to test connection.
     */
    public function login(): mixed
    {
        $url = rtrim($this->provider->base_url, '/') . '/' . ltrim($this->pingEndpoint(), '/');
        
        $response = Http::withHeaders($this->getAuthHeaders())->get($url);

        return $response->json() ?? [];
    }

    /**
     * Send the actual HTTP request for purchases.
     */
    public function sendRequest(string $service, array $payload): array
    {
        $url = rtrim($this->provider->base_url, '/') . '/' . ltrim($this->endpoint($service), '/');

        $response = Http::withHeaders($this->getAuthHeaders())
            ->timeout(30)
            ->post($url, $payload);

        return $response->json() ?? [];
    }

    /**
     * Fetch the wallet balance.
     */
    public function checkBalance(): string
    {
        $response = $this->login();

        if (($response['status'] ?? false) === true && isset($response['data']['balance'])) {
            return (string) $response['data']['balance'];
        }

        return "0.00";
    }

    /**
     * SME Plug does not natively expose a basic verify endpoint in standard docs.
     */
    public function verifyTransaction(string $tx_ref): array
    {
        return [
            'status' => 'pending',
            'message' => 'Verification via API not fully supported. Relying on webhook.'
        ];
    }

    /**
     * Used for verifying customer identity (e.g., Cable TV).
     * SME Plug does not support Cable services.
     */
    public function verifyUser(string $service, string $identifier, array $payload): mixed
    {
        return [
            'status' => 'error',
            'message' => 'SME Plug does not support verifying users for this service.'
        ];
    }

    /**
     * Format your system's unified payload into SME Plug's expected array structure.
     */
    public function formatPayload(string $service, array $payload): array
    {
        // SME Plug uses strict string network IDs
        $smeNetwork = match (strtolower($payload['network'] ?? '')) {
            'mtn' => 'mtn',
            'glo' => 'glo',
            'airtel' => 'airtel',
            '9mobile', 'etisalat' => '9mobile',
            default => strtolower($payload['network'] ?? ''),
        };

        $reference = $payload['reference'] ?? $payload['transaction_reference'] ?? uniqid('sme_');

        if ($service === 'data') {
            return [
                'network_id'         => $smeNetwork,
                'plan_id'            => $payload['plan_id'] ?? $payload['plan'] ?? '',
                'phone'              => $payload['phone'] ?? '',
                'customer_reference' => $reference,
            ];
        }

        if ($service === 'airtime') {
            return [
                'network_id'         => $smeNetwork,
                'amount'             => (float) ($payload['amount'] ?? 0),
                'phone'              => $payload['phone'] ?? '',
                'customer_reference' => $reference,
            ];
        }

        return [];
    }

    /**
     * Format SME Plug's successful response into your system's unified structure.
     */
    protected function formatResponse(string $service, array $payload): array
    {
        return [
            'response_message'   => $payload['msg'] ?? 'Transaction Successful',
            'provider_reference' => $payload['data']['reference'] ?? null,
            // Add any other specific mappings here if needed
        ];
    }

    /**
     * Define the services supported by this provider.
     */
    protected function getSupportedServices(): array
    {
        return ['data', 'airtime'];
    }

    /**
     * Retrieve active data plans directly from SME Plug.
     */
    protected function getPlans(?array $payload = null): mixed
    {
        $response = Http::withHeaders($this->getAuthHeaders())
            ->get(rtrim($this->provider->base_url, '/') . '/v1/data/plans');

        if ($response->failed()) {
            Log::error('SME Plug Fetch Plans Failed', ['response' => $response->body()]);
            return [
                'status' => false,
                'data' => []
            ];
        }

        $rawPlans = $response->json('data') ?? [];

        // Group plans by network ID
        $groupedPlans = [];

        foreach ($rawPlans as $plan) {
            $networkId = $this->mapNetworkNameToId(strtolower($plan['plan_network'] ?? ''));

            if (!isset($groupedPlans[$networkId])) {
                $groupedPlans[$networkId] = [];
            }

            $groupedPlans[$networkId][] = [
                'id' => (string) $plan['plan_id'],
                'name' => $plan['plan_name'],
                'price' => (string) $plan['plan_amount'],
                'telco_price' => (string) ($plan['telco_price'] ?? $plan['plan_amount'])
            ];
        }

        // If a specific network_id is requested, return just that network's plans
        if (isset($payload['network_id']) && isset($groupedPlans[$payload['network_id']])) {
            return [
                'status' => 'success',
                'message' => 'Data plans retrieved successfully',
                'data' => $groupedPlans[$payload['network_id']]
            ];
        }

        // Return all plans grouped by network
        return [
            'status' => true,
            'data' => $groupedPlans
        ];
    }

    /**
     * Map network name to network ID.
     */
    private function mapNetworkNameToId(string $networkName): string
    {
        return match (strtolower($networkName)) {
            'mtn' => '1',
            'glo' => '2',
            'airtel' => '3',
            '9mobile', 'etisalat' => '4',
            default => '1'
        };
    }

    /**
     * The health/ping endpoint for this provider.
     */
    protected function pingEndpoint(): string
    {
        return 'account/balance';
    }

    /**
     * Map your internal service string to the actual provider endpoint.
     */
    protected function endpoint(string $service): string
    {
        return match ($service) {
            'data'    => 'data/purchase',
            'airtime' => 'airtime/purchase',
            default   => throw new \InvalidArgumentException("Service {$service} is not supported by SME Plug"),
        };
    }

    /**
     * Extract the error message cleanly from a failed provider response.
     */
    protected function normalizeError(array $responseData, string $service): string
    {
        return $responseData['msg'] ?? $responseData['message'] ?? 'An unknown error occurred with SME Plug';
    }

    /**
     * Log or diagnose issues specifically for this provider.
     */
    public function diagnose(string $service, string $title, string $body, ?string $type = "error"): void
    {
        // Store diagnostics to an error log, or save to provider meta if you have a diagnosis column
        if ($type === 'error') {
            Log::error("SMEPlug Diagnostics [$service] - $title: $body");
        } else {
            Log::info("SMEPlug Diagnostics [$service] - $title: $body");
        }
    }
}