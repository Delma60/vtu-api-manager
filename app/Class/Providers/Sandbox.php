<?php

namespace App\Class\Providers;

use App\Models\Network;
use App\Models\NetworkType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Sandbox extends ProviderAbstract
{
    protected string $providerName = 'sandbox';

    /**
     * Instead of hitting an external HTTP API, we simply simulate a delay
     * and return a mocked successful response.
     */
    public function sendRequest(string $service, array $payload): array
    {
        // Simulate a slight network latency (optional, good for testing UI loaders)
        usleep(500000); // 0.5 seconds

        return [
            'status' => 'success',
            'message' => "Sandbox {$service} transaction processed successfully.",
            'request-id' => $payload['request-id'] ?? uniqid('sand_'),
            'reference' => 'SANDBOX_TX_' . strtoupper(uniqid()),
            'amount' => $payload['amount'] ?? 0,
            'phone_number' => $payload['phone'] ?? $payload['account_or_phone'] ?? $payload['iuc'] ?? '08000000000',
            'token' => $service === 'electricity' ? rand(1111,9999).'-'.rand(1111,9999).'-'.rand(1111,9999).'-'.rand(1111,9999) : null,
        ];
    }

    public function login(): array
    {
        // No real login needed for sandbox, just return true
        return [
            "status" => "success",
            "message" => "Sandbox login successful",
        ];
    }

    public function checkBalance(): string
    {
        // Infinite balance for the sandbox
        return (float) "10000.00"; 
    }

    public function verifyTransaction(string $tx_ref): array
    {
        return [
            'status' => 'success',
            'message' => 'Transaction verified successfully in sandbox.',
        ];
    }

    protected function getAuthHeaders(): array
    {
        return ['Authorization' => 'Bearer SANDBOX_MOCK_TOKEN'];
    }

    public function verifyUser(string $service, string $identifier, array $payload): mixed
    {
        // Mock a successful meter or decoder validation
        return [
            'status' => 'success',
            'message' => ucfirst($service) . ' verification successful',
            'data' => [
                'name' => 'Sandbox Mock User (' . $identifier . ')',
                'customer_name' => 'Sandbox Mock User (' . $identifier . ')',
            ],
        ];
    }

    public function formatPayload(string $service, array $payload): array
    {
        // Ensure a request ID exists for our mock transaction
        $payload['request-id'] = $payload['tx_ref'] ?? uniqid('sand_');
        return $payload;
    }

    protected function formatResponse(string $service, array $response): array
    {
        // Map our fake response array from sendRequest() into the DB format
        return [
            'provider' => $this->providerName,
            'status' => 'success',
            'transaction_reference' => $response['request-id'],
            'payment_reference' => $response['reference'],
            'response_message' => $response['message'],
            'completed_at' => now(),
            'service_fee' => 0.00,
            'platform' => 'api',
            'transaction_type' => $service,
            'account_or_phone' => $response['phone_number'] ?? null,
            'amount' => (float) ($response['amount'] ?? 0.00),
            'discount_amount' => 0.00,
            'quantity' => 1,
            'receiver' => $response['phone_number'] ?? null,
            'token' => $response['token'] ?? null,
        ];
    }

    protected function getSupportedServices(): array
    {
        return [
            'airtime',
            'data',
            'cable',
            'electricity',
            'exam',
            'bulksms',
            'data_card',
            'recharge_card',
        ];
    }

    protected function getPlans(?array $payload = null): mixed
    {
        // Reuse your standard internal DB logic so the sandbox behaves like Adex
        if (($payload['type'] ?? '') === 'data') {
            $network = Network::with("networkTypes.dataPlans")->find($payload['network_id'] ?? null);
            if (!$network) {
                return ['status' => 'error', 'message' => 'Invalid network ID', 'data' => null];
            }
            return [
                'status' => 'success',
                'message' => 'Data plans retrieved successfully',
                'data' => $network->networkTypes()->with('dataPlans')->get()->pluck('dataPlans')->flatten(),
            ];
        } elseif (($payload['type'] ?? '') === 'cable') {
            $network = NetworkType::with("cablePlans")->find($payload['cable_network'] ?? null);
            if (!$network) {
                return ['status' => 'error', 'message' => 'Invalid network ID', 'data' => null];
            }
            return [
                'status' => 'success',
                'message' => 'Cable plans retrieved successfully',
                'data' => $network->cablePlans()->get(),
            ];
        }

        return ['status' => 'error', 'message' => 'Invalid plan type requested', 'data' => null];
    }

    protected function callback(Request $request): array
    {
        return [
            "status" => "success",
            "tx_ref" => $request->input('request-id'),
        ];
    }

    protected function pingEndpoint(): string
    {
        return 'http://sandbox.local/ping';
    }

    protected function endpoint(string $service): string
    {
        return '/mock/api/' . $service;
    }

    protected function normalizeError(array $responseData, string $service): string
    {
        return $responseData['message'] ?? 'Sandbox mock error occurred.';
    }

    public function diagnose(string $service, string $title, string $body, ?string $type = "error"): void
    {
        // For Sandbox, just log to Laravel's standard log file
        Log::info("Sandbox Diagnose [{$type}]: {$title} - {$body}");
    }
}