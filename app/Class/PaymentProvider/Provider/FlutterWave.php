<?php

namespace App\Class\PaymentProvider\Provider;

use App\Class\PaymentProvider\PaymentBase;
use App\Models\General;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterWave extends PaymentBase
{

    protected string $providerName = 'flutterwave';


    function connect(): mixed
    {
        return "";
    }

    function checkBalance(): ?string
    {
         $fw = Http::withHeaders($this->getHeaders())
            ->get($this->provider->base_url . "/balances/NGN")
            ->json();

            // Log::info($fw);
        return $fw['status'] === "success" ? $fw['data']["available_balance"]: null;
    }

    protected function login(?array $data = null): mixed{
        
        $response = Http::asForm()->post('https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token', [
            'client_id'     => $this->provider->api_key, // Or however you retrieve your ID
            'client_secret' => $this->provider->api_secret,
            'grant_type'    => 'client_credentials',
        ]);
        if ($response->successful()) {
            $data = $response->json();
            $accessToken = $data['access_token'] ?? null;
            return [
                "access_token" => $accessToken
            ];
        } else {
            $errorDetails = $response->json();
        }

     }



    public function generate($payload):array|null
    {
        try {
            $payloadResponse = $this->formatPayload($payload);
            $response = Http::withHeaders($this->getHeaders())
                ->post($this->provider->base_url . "/virtual-account", $payloadResponse);

            Log::info("Generating virtual account for {$payload->email}...", [
                'response' => $response->json()
            ]);

            if ($response->successful()) {
                $data = $response->json('data');
                return $this->formatResponse(array_merge($data, $payloadResponse), $payload);
            } else {
                Log::error("Failed to generate account.", [
                    'error' => $response->body()
                ]);
                return null;
            }
        } catch (\Throwable $th) {
            Log::error($th);

            return null;
        }

    }


    protected function getHeaders(): array
    {
        // $login = $this->login();

        return [
            "Authorization" => "Bearer " . $this->provider->api_secret
        ];
    }

    function formatPayload(array|User $payload, ?User $user = null): array
    {
            $sessionUser = $user !== null ? $user : $payload ;
            $txRef = Transaction::generateTransactionId();
            $nameParts = explode(' ', $sessionUser->fullname);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';
            $gen = General::first();
//             currency": "NGN",
//   "account_type": "dynamic",
//   "reference": "sduvhfbw79e8",
//   "customer_id": "cus_37rrjf",
//   "bvn": "12345678902",
//   "nin": "12345678900",
//   "bank_code": "090772",
//   "merchant_vat_amount": 22.7
        return [
            "email" => $sessionUser->email,
            "tx_ref" => $txRef,
            "phonenumber" => $sessionUser->phone,
            "is_permanent" => true,
            "firstname" => $firstName,
            "lastname" => $lastName,
            "bvn" => $sessionUser->bvn ?? $gen->bvn
        ];
    }

    function formatResponse(array $data, ?User $user = null): array
    {



        return  [
            'user_id' => $user->id,
            'account_type' => 'virtual',
            'bank_account' => $data['account_number'],
            'bank_name' => $data['bank_name'],
            'provider' => $this->providerName,
            'status' => 'active',
            'amount' => $data['amount'] ?? 0.00,
            'ref' => $data['flw_ref'] ?? null,
            'tx_ref' => $data['tx_ref'],
            'expired_at' => now()->addYears(1)
        ];
    }


    protected function callback(HttpRequest $request): array
    {
        $payload = $request->all();
        $data = $payload['data'];
        $customer = $data['customer'];
        $creditedAmount = $this->creditedAmount($data['amount']);
        $user = User::where('email', $customer['email'])->first();
        $user->wallet_balance += $creditedAmount;
        $user->save();
        return [
            "user_id" => $user->id,
            'provider' => $this->providerName,
            'transaction_reference' =>  $data['tx_ref'] ,
            'payment_reference' => $data['flw_ref'] ?? null,
            'response_message' => $data['processor_response'] ?? 'Transaction failed',
            'completed_at' => now(),
            "funding_method" => "bank_transfer",
            'service_fee' => $data['app_fee'] ?? 0.00,
            'platform' => 'web',
            'transaction_type' => 'wallet_funding',
            'account_or_phone' => $customer['phone_number'] ?? null,
            'amount' => $creditedAmount ?? 0.00,
            'status' => $data['status'] =="successful" ?"success" :"fail" ,
            'receiver' => $customer['phone_number'] ?? null,
        ];
    }

    function isHealthy(): bool
    {
       $balance = $this->checkBalance();
        return $balance !== null;
    }

    function checkout(array $data): array
    {
        $response = Http::withHeaders($this->getHeaders())
            ->acceptJson()
            ->post($this->provider->base_url .'/payments', [
                'tx_ref'       => $data['transaction_reference'],
                 'amount'       => $data['amount'] ?? 0.00,
                'currency'     => 'NGN',
                'redirect_url' => $data['redirect_url'] ?? null,
                'customer'     => [
                    'email'       => $data['customer_email'],
                    'name'        => $data['customer_name'],
                    // 'phonenumber' => '09012345678',
                ],
                // 'customizations' => [
                //     'title' => 'Flutterwave Standard Payment',
                // ],
            ]);

        if ($response->successful()) {
            $paymentLink = $response->json('data.link');
            return [
                'status' => 'success',
                'checkout_url' => $paymentLink,
                 'transaction_reference' => $data['transaction_reference'],
                 'payment_reference' => $response->json('data.flw_ref') ?? null,
                'amount' => $data['amount'] ?? 0.00,
                'currency' => $data['currency'] ?? 'NGN',
            ];
        }

        // Handle failure
        throw new \Exception($response->json('message'));
       
    }

    function banks():array 
    {
        $response = Http::withHeaders($this->getHeaders())
                ->get($this->provider->base_url . '/banks/NG')
                ->json('data');
        return $response;
    }

    function resolveBank(array $data) 
    {
        $response = Http::withHeaders($this->getHeaders())
                // ->get($this->provider->base_url . '/banks/NG')
                ->post($this->provider->base_url . '/accounts/resolve', [
                'account_number' => "0690000032",//  $data['account_number'],
                'account_bank' => "044",//$data['account_bank'],
        ]);

        return $response;
    }


    function transfer(array $data) 
    {
        $response = Http::withHeaders($this->getHeaders())
                ->post($this->provider->base_url . '/transfers', [
                    'account_bank' => $data['account_bank'],
                    'account_number' => $data['account_number'],
                    'amount' => $data['amount'],
                    'narration' => $data['narration'] ?? 'Wallet Withdrawal',
                    'currency' => 'NGN',
                    'reference' => $data['reference'],
                    'callback_url' => $data['callback_url'] ?? null,
                    'debit_currency' => 'NGN'
                ]);

        return $response;
    }

}
