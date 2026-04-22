<?php

namespace App\Class\Providers;

use App\Interfaces\ProviderInterface;
use App\Models\Provider;
use App\Models\SystemSetting;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

abstract class ProviderAbstract implements ProviderInterface
{
    /**
     * Create a new class instance.
     */
    protected Provider $provider;
    protected string $providerName;
    protected bool $isSandbox = false;
    static public int $defaultTimeoutMs = 5000;


    protected array $networkIDs = [
        'mtn' => 1,
        'airtel' => 2,
        'glo' => 3,
        '9mobile' => 4,
    ];

     protected array $cableNetworkIDs = [
        'gotv' => 1,
        'dstv' => 2,
        'startime' => 3,
    ];


    public function __construct(Provider $provider)
    {
        $this->provider = $provider;
    }

    public function process(string $service, array $payload): mixed
    {
        try {
            $formattedPayload = $this->formatPayload($service, $payload);
            $response = $this->sendRequest($service, $formattedPayload);

            $responseData = $response;
            if (is_object($response) && method_exists($response, 'successful')) {
                
                if (!$response->successful()) {
                    return [
                        'status' => 'error',
                        'message' => $this->normalizeError($response->json(), $service),
                        'data' => null,
                    ];
                }
                $responseData = $response->json();
            }

            if (($responseData['status'] ?? '') !== 'success') {
                // add respoonse to provider meta diagnosis
                // 1. Get the existing meta array, or an empty array if null
                
                return [
                    'status' => 'error',
                    'message' => $this->normalizeError($responseData, $service),
                    'data' => null,
                ];
            }

            $formattedData = $this->formatResponse($service, $responseData);

            return [
                'status' => 'success',
                'message' => $formattedData['response_message'] ?? $responseData['message'] ?? 'Request processed successfully',
                'data' => $formattedData,
            ];
        } catch (\Throwable $th) {
            return [
                'status' => 'error',
                'message' => $th->getMessage(),
                'data' => null,
            ];
        }
    }

    abstract public function sendRequest(string $service, array $payload): array;

    public function sandbox(): static
    {
        $this->isSandbox = true;
        return $this;
    }

    abstract public function checkBalance(): string;

    abstract public function verifyTransaction(string $tx_ref): array;

    abstract protected function getAuthHeaders(): array;
    abstract public function verifyUser(string $service, string $identifier, array $payload): mixed;
    abstract protected function formatResponse(string $service,array $payload): array;

    public function supportsService(string $service): bool
    {
        return in_array($service, $this->getSupportedServices());
    }

    
    abstract protected function getSupportedServices(): array;
    abstract protected function getPlans(?array $payload=null): mixed;
    abstract protected function callback(Request $request):array;

    abstract protected function pingEndpoint(): string;
    abstract protected function endpoint(string $service): string;

    public function webhook(Request $request):void{
        $callback = $this->callback($request);
        Transaction::where("transaction_reference", $callback['tx_ref'])
        ->update($callback);
    }

    public function isHealthy(): bool
    {
        try {
            $response = $this->login();
            if(!isset($response)) return false;
            return $response['status'] === 'success';

        } catch (\Throwable $e) {
            Log::warning("Vendor  is unhealthy., error: " . $e->getMessage());
            return false;
        }
    }

    function plans(?array $payload=null): mixed
    {

        return $this->getPlans($payload);
    }

    protected function convertDataPlanToGB(string $dataplan): float {
        $dataplan = strtoupper(trim($dataplan));

        // Match value and unit using regex (e.g., "500MB", "1.5GB")
        if (preg_match('/([\d\.]+)\s*(MB|GB)/', $dataplan, $matches)) {
            $value = (float) $matches[1];
            $unit = $matches[2];

            if ($unit === 'MB') {
                return round($value / 1024, 3); // Convert MB to GB
            }

            if ($unit === 'GB') {
                return round($value, 3);
            }
        }

        return 0.0; // fallback if parsing fails
    }

    public function getProviderModel(): Provider
    {
        return $this->provider;
    }

    public function getTimeout(){
        // convert to s from ms
        $globalTimeoutMs = SystemSetting::getKeyValue('timeout_ms', config('vtu.default_timeout_ms', self::$defaultTimeoutMs));
        return  ($this->provider->timeout_ms ?$this->provider->timeout_ms:$globalTimeoutMs) / 1000;
    }

    abstract protected function normalizeError(array $responseData, string $service): string;
    abstract public function diagnose (string $service, string $title, string $body, ?string $type = "error"): void;
}
