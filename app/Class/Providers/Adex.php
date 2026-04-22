<?php

namespace App\Class\Providers;

use App\Class\Providers\ProviderAbstract;
use App\Models\CablePlan;
use App\Models\DataPlan;
use App\Models\Discount;
use App\Models\Network;
use App\Models\NetworkType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Adex extends ProviderAbstract
{
    /**
     * Create a new class instance.
     */
    protected string $providerName = 'adex';
    private ?string $accessToken = null;


     function sendRequest(string $service, array $payload): array
    {
        $response = Http::withHeaders($this->getAuthHeaders())
        ->timeout(15)
        // ->retry(2, 100)
        ->post($this->buildEndpoint($service), $payload)->json();


        return $response;
    }
    public function verifyTransaction(string $tx_ref): array
    {
        return[];
    }

    public function checkBalance(): string
    {
        try {
            $res = $this->login();
             $cleaned = preg_replace('/[^\d.]/', '', $res['balance']);
            //  Log::info(["data" => $cleaned]);
            return (float) $cleaned;
        } catch (\Throwable $th) {
            // Log the exception if needed: error_log($th->getMessage());
            return 0;
        }
    }

    protected function baseUrl(): string
    {
        return $this->provider->base_url;
    }

     function login(): array
    {
        $key = md5($this->baseUrl() . $this->provider->api_key . $this->provider->api_secret);
        return Cache::remember($key, now()->addMinutes(5), function (){
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Basic ' . base64_encode(
                            $this->provider->api_key . ':' . $this->provider->api_secret
                        ),
                        'Content-Type' => 'application/json',
                    ])->post($this->baseUrl() . "/user");

                    $data = $response->json();
                    return $data ?? [];
                } catch (\Throwable $th) {
                    //throw $th;
                    // Log::info(["login" => $th->getMessage()]);

                    return [];
                }
        });
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
            "data_card",
            "recharge_card",
        ];
    }

     protected function pingEndpoint(): string
    {
        return $this->baseUrl() . '/user';
    }

    protected function endpoint(string $service) : string {
            return match($service){
            'airtime' => '/topup',
            'data' => '/data',
            'cable' => '/cable',
            'electricity' => '/bill',
            'exam' => '/exam',
            'bulksms' => '/bulksms',
            'data_card' => '/data_card',
            'recharge_card' => '/recharge_card',
            'Health Check' => "Health Check",
            default => throw new \InvalidArgumentException("No endpoint mapped for service [$service]")
            };
    }

    protected function buildEndpoint(string $service): string
    {
        return $this->baseUrl() . $this->endpoint($service);
    }

    public function formatPayload(string $service, array $payload): array
    {
        switch ($service) {
            case 'airtime':
                return [
                    'network' => $this->networkIDs[$payload['network']],
                    'phone' => $payload['phone'],
                    'plan_type' => $payload['network_type'] ?? 'VTU',
                    'amount' => $payload['amount'],
                    'bypass' => filter_var($payload['bypass'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'request-id' => $payload['tx_ref'],
                ];
            case 'data':
                $dataPlan = DataPlan::with("providers")->find($payload['data_plan']);
                return [
                    'network' => $this->networkIDs[$payload['network']],
                    'phone' => $payload['phone'],
                    'plan_type' => $payload['plan_type'] ?? 'GIFTING',
                    'data_plan' => $dataPlan->providers()->where('provider_id', $this->provider->id)->first()->pivot->server_id ?? null,
                    'bypass' => filter_var($payload['bypass'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'request-id' => $payload['tx_ref'],
                ];
            case 'cable':
                $cablePlan = CablePlan::with("providers")->find($payload['cable_plan']);
                Log::info($payload);
                $cableName = $payload['cable_network'] ?? $payload['cable'] ?? '';
                return [
                    'cable' => $this->cableNetworkIDs[$cableName],
                    'iuc' => $payload['iuc'],
                    'cable_plan' => $cablePlan->providers()->where("provider_id", $this->provider->id)->first()->pivot->server_id ?? null,
                    // {str_replace(" ", "_", $this->provider->name)},
                    'bypass' => filter_var($payload['bypass'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'request-id' => $payload['tx_ref'],
                ];

            case 'electricity':
                $disco = Discount::getElectricity($payload['disco']);
                $discoId = $disco->{str_replace(" ", "_", $this->provider->name)} ?? null;

                if (!$discoId) {
                    throw new \InvalidArgumentException("Invalid DISCO provider ID");
                }

                return [
                    'disco' => $discoId,
                    'meter_type' => $payload['meter_type'] ?? 'prepaid',
                    'meter_number' => $payload['meter_number'],
                    'amount' => $payload['amount'],
                    'bypass' => filter_var($payload['bypass'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'request-id' => $payload['tx_ref'],
                ];

            case 'exam':
                return [
                    'quantity' => $payload['quantity'] ?? 1,
                    'request-id' => $payload['tx_ref'],
                ];

            case 'bulksms':
                return [
                    'sender_name' => $payload['sender'] ?? 'API',
                    'numbers' => is_array($payload['numbers']) ? implode(',', $payload['numbers']) : $payload['numbers'],
                    'message' => $payload['message'] ?? '',
                    'request-id' => $payload['tx_ref'],
                ];

            case 'data_card':
                return [
                    'network' => $payload['network'],
                    'plan_type' => $payload['plan_type'],
                    'quantity' => $payload['quantity'],
                    'card_name' => $payload['card_name'],
                    'request-id' => $payload['tx_ref'] ?? uniqid('Data_card_'),
                ];

            case 'recharge_card':
                return [
                    'network' => $payload['network'], // assuming the API expects string like "MTN"
                    'plan_type' => $payload['plan_type'] ?? null,
                    'quantity' => (int)($payload['quantity'] ?? 1),
                    'card_name' => $payload['card_name'] ?? null,
                    'request-id' => $payload['tx_ref'],
                    'amount' => $payload['amount'] ?? null,
                ];
            default:
                throw new \InvalidArgumentException("Unknown service [$service] for Adex");
        }
    }

    protected function formatResponse(string $service, array $response): array
    {
        $default = [
            'provider' =>  null,//$this->providerName,
            'status' => 'fail', // default unless confirmed otherwise
            'transaction_reference' => $response['request-id'] ?? $response['tx_ref'] ?? null,
            'payment_reference' => $response['reference'] ?? null,
            'response_message' => $response['message'] ?? 'Transaction failed',
            'completed_at' => now(),
            'service_fee' => 0.00,
            'platform' => 'api',
            "transaction_type" => "data_subscription"
        ];

        switch ($service) {
            case 'airtime':
                $result = [
                    'provider' => $response['network'],
                    'transaction_type' =>'airtime_recharge',
                    'account_or_phone' => $response['phone_number'] ?? null,
                    'amount' => $response['amount'] ?? 0.00,
                    'discount_amount' => $response['discount_amount'],
                    'quantity' => 1.00,
                    'status' => $response['status'],
                    'receiver' => $response['phone_number'] ?? null,
                    'plan_type' => $response['plan_type'] ?? 'VTU',
                    'token' => null,
                ];
                break;

            case 'data':
                $result = [
                    'provider' => $response['network'],
                    'transaction_type' =>'data_subscription',
                    'account_or_phone' => $response['phone_number'] ?? null,
                    'amount' => $response['amount'] ?? 0.00,
                    'discount_amount' => 0.00,
                    'quantity' => $this->convertDataPlanToGB($response['dataplan']),
                    'status' => $response['status'],
                    'receiver' => $response['phone_number'] ?? null,
                    'plan_type' => $response['plan_type'] ?? null,
                    'token' =>  null,
                ];
                break;
            case 'cable':
                $result = [
                    'provider' => $response['cabl_name'],
                    'transaction_type' => 'cable_subscription',
                    'account_or_phone' => $response['iuc'] ?? null,
                    'amount' => (float) ($response['amount'] ?? 0.00),
                    'discount_amount' => (float) ($response['charges'] ?? 0.00),
                    'quantity' => 1.00,
                    'status' => $response['status'] ?? 'failed',
                    'receiver' => $response['iuc'] ?? null,
                    'plan_type' => $response['plan_name'] ?? null,
                    'token' => null, // Not applicable for cable
                ];
                break;

            case 'electricity':
                $result = [
                    'transaction_type' => 'electricity_bill',
                    'account_or_phone' => $response['meter_number'] ?? null,
                    'amount' => $response['amount'] ?? 0.00,
                    'discount_amount' => 0.00,
                    'quantity' => 1.00,
                    'status' => $response['status'] ?? 'fail',
                    'receiver' => $response['meter_number'] ?? null,
                    'plan_type' => $response['meter_type'] ?? null,
                    'token' => $response['token'] ?? null,
                ];
                break;

            case 'exam':
                $result = [
                    'transaction_type' => 'exam',
                    'status' => $response['status'] ?? 'fail',
                    'message' => $response['message'] ?? 'Unknown status',
                    'amount' => $response['amount'] ?? 0,
                    'quantity' => $response['quantity'] ?? 0,
                    'token' => $response['pin'] ?? null, // example: "pin1<=>seral1"
                    'account_or_phone' => $response['username'] ?? null,
                ];
                break;

            case 'bulksms':
                $result = [
                    'transaction_type' => 'bulksms',
                    'status' => $response['status'] ?? 'fail',
                    'message' => $response['message'] ?? 'Failed to send SMS',
                    'amount' => $response['amount'] ?? 0.00,
                    'quantity' => $response['total_number'] ?? 0,
                    'correct_number' => $response['correct_number'] ?? null,
                    'wrong_number' => $response['wrong_number'] ?? null,
                    'sender_name' => $response['sender_name'] ?? null,
                    'numbers' => $response['numbers'] ?? null,
                    'oldbal' => $response['oldbal'] ?? null,
                    'newbal' => $response['newbal'] ?? null,
                ];
                break;

            case 'data_card':
                $result = [
                    'transaction_type' => 'data_card',
                    'status' => $response['status'] ?? 'fail',
                    'message' => $response['message'] ?? '',
                    'amount' => $response['amount'] ?? 0,
                    'quantity' => (int)($response['quantity'] ?? 0),
                    'card_name' => $response['card_name'] ?? null,
                    'serial' => $response['serial'] ?? null,
                    'pin' => $response['pin'] ?? null,
                    'load_pin' => $response['load_pin'] ?? null,
                    'check_balance' => $response['check_balance'] ?? null,
                    'oldbal' => $response['oldbal'] ?? null,
                    'newbal' => $response['newbal'] ?? null,
                ];
                break;

            case 'recharge_card':
                $result = [
                    'transaction_type' => 'recharge_card',
                    'account_or_phone' => null,
                    'amount' => $response['amount'] ?? 0.00,
                    'quantity' => (int) ($response['quantity'] ?? 1),
                    'status' => $response['status'] ?? 'fail',
                    'receiver' => null,
                    'card_name' => $response['card_name'] ?? null,
                    'serials' => $response['serial'] ?? null,
                    'pins' => $response['pin'] ?? null,
                    'load_pin' => $response['load_pin'] ?? null,
                    'check_balance' => $response['check_balance'] ?? null,
                ];
                break;
            default:
                throw new \InvalidArgumentException("No response formatter defined for service [$service]");
        }

        return array_merge($default, $result);
    }

    protected function getAuthHeaders(): array
    {
        if (!$this->accessToken) {
            $this->accessToken = $this->login()['AccessToken'] ?? null;
        }

        return [
            'Authorization' => 'Token ' . $this->accessToken,
            'Content-Type' => 'application/json'
        ];
    }

    function verifyUser(string $service, string $identifier, array $payload): mixed
    {
        if ($service == 'cable') {
        $cableId = $this->cableNetworkIDs[$payload['cable_network']] ?? null;
        if (!$cableId) {
            return [
                'status' => 'error',
                'message' => 'Cable network not given or unsupported',
                'data' => null,
            ];
            // ['status' => 'error', 'message' => 'Cable ID required'];
        }
        $url = $this->baseUrl() . "/cable/cable-validation?iuc={$identifier}&cable={$cableId}";
        } elseif ($service == 'electricity') {
            $disco = Discount::getElectricity($payload['disco']);
            $discoId = $disco->{str_replace(" ", "_", $this->provider->name)} ?? null;
            // Log::info($disco);
            // Log::info($discoId);
            $meterType = $options['meter_type'] ?? 'prepaid';
            if (!$discoId) {
            return [
                'status' => 'error',
                'message' => 'DISCO provider not given or unsupported',
                'data' => null,
            ];
            }
            $url = $this->baseUrl() . "/bill/bill-validation?meter_number={$identifier}&disco={$discoId}&meter_type={$meterType}";
        } else {
            return [
                'status' => 'error',
                'message' => "Verification not supported for service: $service",
                'data' => null,
            ];
            // $this->fail([], "Verification not supported for service: $service");
        }

        try {

            $response = Http::get($url);
            // Log::info(["response: " => $response]);

            if ($response->ok() && $response->json('status') === 'success') {
                return [
                    'status' => 'success',
                    'message' => $response->json('message') ?? 'Verification successful',
                    'data' => $response->json('data') ?? null,
                ];
                // $this->success(['name' => $response->json('name')], ucfirst($service) . ' verification successful.', 201);
            }
            return [
                'status' => 'error',
                'message' => $response->json('message') ?? 'Verification failed',
                'data' => null,
            ];
            // $this->fail([], $response->json('message') ?? 'Verification failed.');
        } catch (\Exception $e) {
            // Log::info(["ERROR: " => $e]);
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
                'data' => null,
            ];

        }


    }

    protected function getPlans(?array $payload = null): mixed
    {
        // $adminController = new AdminController();
        if($payload['type'] === 'data'){
            return $this->getDataPlans($payload['network_id'] ?? null);
        } elseif($payload['type'] === 'cable') {
            return $this->getCablePlans($payload['cable_network'] ?? null);
        } else {
            return [
                'status' => 'error',
                'message' => 'Invalid plan type requested',
                'data' => null,
            ];
        }

        // $adminController->universalGet($payload['request'], $payload['table']);
    }


    private function getDataPlans(string $network_id):mixed {
        // $network_id = $payload['network_id'] ?? null;
        $network = Network::with("networkTypes.dataPlans")->find($network_id);
        if (!$network) {
            return [
                'status' => 'error',
                'message' => 'Invalid network ID',
                'data' => null,
            ];
        }

        $plans = $network->networkTypes()->with('dataPlans')->get()->pluck('dataPlans')->flatten();

        return [
            'status' => 'success',
            'message' => 'Data plans retrieved successfully',
            'data' => $plans,
        ];

    }

    private function getCablePlans(string $cable_network):mixed {
        $network = NetworkType::with("cablePlans")->find($cable_network);
        if (!$network) {
            return [
                'status' => 'error',
                'message' => 'Invalid network ID',
                'data' => null,
            ];
        }

        $plans = $network->cablePlans()->get();

        return [
            'status' => 'success',
            'message' => 'Cable plans retrieved successfully',
            'data' => $plans,
        ];

    }

    function callback(Request $request):array
    {

        return [
            "status" => $request->status,
            "tx_ref" => $request['request-id'],
        ];
    }

        protected function normalizeError(array $responseData, $service): string
    {
        $rawMessage = $responseData['message'] ?? '';

        if (!$rawMessage) {
            return 'Transaction failed. Please try again later.';
        }

        $messageLower = strtolower($rawMessage);
        Log::info($messageLower);

        return match (true) {
            // 1. Adex Wallet Exhausted (Note: comma acts as an OR operator in match)
            str_contains($messageLower, 'insufficient account'),
            str_contains($messageLower, 'fund your wallet')
                => $this->handleEmptyWalletError($rawMessage, $service),

            // 2. Adex Network Downtime
            str_contains($messageLower, 'timeout'),
            str_contains($messageLower, 'unavailable')
                => 'The network provider is currently experiencing downtime. Please try again.',

            // 3. Adex Invalid Number
            str_contains($messageLower, 'invalid number')
                => 'The provided phone number is invalid for this network.',
            // invalid cable plan id, some message else especially if user set wrong cable id
            str_contains($messageLower, 'invalid cable plan')
                => 'The selected cable plan is invalid. Please verify the plan from provider and try again.',

            // Default Fallback
            default => 'Transaction failed at the provider network. Please contact support if this persists.',
        };
    }
    private function handleEmptyWalletError(string $rawMessage, string $service): string
    {
        Log::critical('ADEX WALLET EMPTY: ' . $rawMessage);
        $this->diagnose($service, 'Insufficient Balance', $rawMessage, 'warning');

        return 'This service is currently unavailable. Please try again later.';
    }
    public function diagnose (string $service, string $title, string $body, ?string $type = "error"): void{
        $meta = $this->provider->meta ?? [];

                // 2. Ensure 'diagnostics' exists as an array
                $diagnostics = $meta['diagnostics'] ?? [];

                // 3. Append the new error to the array
                $diagnostics[] = [
                    "time"     => now()->toDateTimeString(),
                    "endpoint" => $this->endpoint($service), // Make sure to pass your actual variables here
                    "body"    => $body,
                    'title' => $title,
                    'type' => $type,
                ];

                // 4. PRO TIP: Prevent database bloat by keeping only the last 10 logs
                // If there are more than 10, slice off the oldest ones from the front
                if (count($diagnostics) > 10) {
                    $diagnostics = array_slice($diagnostics, -10);
                }

                // 5. Put it back into the meta array and update the model
                $meta['diagnostics'] = $diagnostics;

                $this->provider->update([
                    'meta' => $meta
                ]);
    }
}
