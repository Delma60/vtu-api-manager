<?php

namespace App\Http\Controllers\Bot;

use App\Http\Controllers\Controller;
use App\Models\BotSession;
use App\Models\Business;
use App\Models\User;
use App\Services\Vtu\VtuManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WhatsAppController extends Controller
{
    public function __construct(protected VtuManager $vtuManager) {}

    /**
     * Meta Cloud API requires a GET request to verify the webhook URL.
     */
    public function verifyWebhook(Request $request, $botCode)
    {
        $business = Business::where('bot_code', $botCode)->first();
        $verifyToken = $business->whatsapp_verify_token ?? 'my_secure_token_123';

        $mode = $request->query('hub.mode', $request->query('hub_mode'));
        $token = $request->query('hub.verify_token', $request->query('hub_verify_token'));
        $challenge = $request->query('hub.challenge', $request->query('hub_challenge'));

        if ($mode === 'subscribe' && $token === $verifyToken) {
            return response($challenge, 200);
        }

        return response()->json(['error' => 'Invalid verify token'], 403);
    }

    /**
     * Handle incoming messages from WhatsApp.
     */
    public function handleWebhook(Request $request, $botCode)
    {
        $business = Business::where('bot_code', $botCode)->first();

        if (!$business || !$business->whatsapp_access_token || !$business->whatsapp_phone_number_id) {
            return response()->json(['status' => 'ignored']);
        }

        $payload = $request->all();
        $entry = $payload['entry'][0] ?? null;
        $changes = $entry['changes'][0]['value'] ?? null;

        if (!isset($changes['messages']) || empty($changes['messages'])) {
            return response('OK', 200);
        }

        $message = $changes['messages'][0];
        $chatId = $message['from'] ?? null;
        $text = trim($message['text']['body'] ?? '');

        if (isset($message['interactive']['button_reply'])) {
            $text = $message['interactive']['button_reply']['id'];
        }

        $username = $changes['contacts'][0]['profile']['name'] ?? 'User';

        if ($chatId) {
            $this->processMessage($chatId, $text, $username, $business);
        }

        return response('OK', 200);
    }

    protected function processMessage(string $chatId, string $text, string $username, Business $business)
    {
        $session = BotSession::firstOrCreate(
            ['chat_id' => $chatId, 'business_id' => $business->id],
            ['state' => 'idle', 'payload' => [], 'telegram_username' => $username]
        );

        $lowerText = strtolower($text);

        if (in_array($lowerText, ['hi', 'hello', 'menu', 'start'], true)) {
            return $this->handleStart($session, $business);
        }

        if ($lowerText === 'cancel' || $lowerText === '0') {
            $session->update(['state' => 'idle', 'payload' => []]);
            return $this->sendMessage($chatId, "❌ Action cancelled. Send 'Menu' to start over.", $business);
        }

        return match ($session->state) {
            'idle' => $this->handleMainMenuSelection($session, $text, $business),
            'awaiting_airtime_phone' => $this->handleAirtimePhoneInput($session, $text, $business),
            'awaiting_airtime_amount' => $this->handleAirtimeAmountInput($session, $text, $business),
            default => $this->sendMessage($chatId, "I didn't understand that. Please send 'Menu'.", $business),
        };
    }

    protected function handleStart(BotSession $session, Business $business)
    {
        $session->update(['state' => 'idle', 'payload' => []]);

        $menu = "Welcome to *{$business->name}*! 🚀\n\n";
        $menu .= "Please reply with a number to select an option:\n\n";
        $menu .= "1️⃣ Buy MTN Airtime\n";
        $menu .= "2️⃣ Buy GLO Airtime\n";
        $menu .= "3️⃣ Buy AIRTEL Airtime\n";
        $menu .= "4️⃣ Buy 9MOBILE Airtime\n";
        $menu .= "0️⃣ Cancel / Menu\n";

        $this->sendMessage($session->chat_id, $menu, $business);
    }

    protected function handleMainMenuSelection(BotSession $session, string $text, Business $business)
    {
        $networks = [
            '1' => 'MTN',
            '2' => 'GLO',
            '3' => 'AIRTEL',
            '4' => '9MOBILE',
        ];

        if (!array_key_exists($text, $networks)) {
            return $this->sendMessage($session->chat_id, "⚠️ Invalid selection. Please reply with 1, 2, 3, or 4.", $business);
        }

        $network = $networks[$text];

        $session->update([
            'state' => 'awaiting_airtime_phone',
            'payload' => ['network' => $network],
        ]);

        $this->sendMessage($session->chat_id, "📱 You selected *{$network}*.\n\nPlease reply with the destination phone number:\n_(Send 0 to cancel)_", $business);
    }

    protected function handleAirtimePhoneInput(BotSession $session, string $phone, Business $business)
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($phone) < 10) {
            return $this->sendMessage($session->chat_id, "⚠️ Invalid phone number. Please enter a valid 11-digit number.", $business);
        }

        $payload = $session->payload;
        $payload['phone'] = $phone;

        $session->update([
            'state' => 'awaiting_airtime_amount',
            'payload' => $payload,
        ]);

        $this->sendMessage($session->chat_id, "Great! Now enter the *Amount* you wish to recharge (e.g. 500):", $business);
    }

    protected function handleAirtimeAmountInput(BotSession $session, string $amount, Business $business)
    {
        if (!is_numeric($amount) || $amount < 50) {
            return $this->sendMessage($session->chat_id, "⚠️ Amount must be at least ₦50. Please enter a valid amount:", $business);
        }

        $payload = $session->payload;
        $last10Digits = substr($session->chat_id, -10);

        $user = User::where('business_id', $business->id)
            ->where('phone', 'like', "%{$last10Digits}")
            ->first();

        if (!$user) {
            $session->update(['state' => 'idle', 'payload' => []]);
            return $this->sendMessage($session->chat_id, "⚠️ We couldn't find an account linked to this WhatsApp number on our website. Please update your profile phone number on the dashboard.", $business);
        }

        $vtuPayload = [
            'network' => $payload['network'],
            'phone' => $payload['phone'],
            'amount' => (int) $amount,
            'plan_type' => 'VTU',
            'platform' => 'whatsapp',
            'tx_ref' => 'WA_' . uniqid(),
        ];

        $this->sendMessage($session->chat_id, "🔄 Processing your ₦{$amount} recharge...", $business);

        try {
            $response = $this->vtuManager->process('airtime', $user, $vtuPayload);

            if ($response['status'] === 'success') {
                $msg = "✅ *Transaction Successful!*\n\nRecharged ₦{$amount} to {$payload['phone']} ({$payload['network']}).";
            } else {
                $msg = "❌ *Transaction Failed:*\n" . ($response['message'] ?? 'Provider error');
            }
        } catch (\Exception $e) {
            Log::error('WA Bot Transaction Error: ' . $e->getMessage());
            $msg = "⚠️ An unexpected error occurred. If you were debited, you will be refunded.";
        }

        $session->update(['state' => 'idle', 'payload' => []]);
        $this->sendMessage($session->chat_id, $msg, $business);
    }

    protected function sendMessage(string $to, string $text, Business $business): void
    {
        $accessToken = $business->whatsapp_access_token;
        $phoneNumberId = $business->whatsapp_phone_number_id;

        if (!$accessToken || !$phoneNumberId) {
            return;
        }

        Http::withToken($accessToken)->post("https://graph.facebook.com/v19.0/{$phoneNumberId}/messages", [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'text',
            'text' => [
                'body' => $text,
            ],
        ]);
    }

    public function edit(Request $request)
    {
        $business = $request->user()->business;

        // Auto-generate verify token and bot code if they don't exist yet
        if (!$business->whatsapp_verify_token || !$business->bot_code) {
            $business->update([
                'whatsapp_verify_token' => $business->whatsapp_verify_token ?? 'WA_' . bin2hex(random_bytes(8)),
                'bot_code' => $business->bot_code ?? uniqid('bot_')
            ]);
        }

        // Check if WhatsApp is configured (has access token and phone number ID)
        $isActive = !empty($business->whatsapp_access_token) && !empty($business->whatsapp_phone_number_id);

        // Get sales statistics
        $totalSalesAmount = $business->transactions()->where('status', 'successful')->sum('amount');
        $totalSalesCount = $business->transactions()->where('status', 'successful')->count();

        return Inertia::render('developers/bots/whatsapp', [
            'business' => $business,
            'isActive' => $isActive,
            'totalSalesAmount' => $totalSalesAmount,
            'totalSalesCount' => $totalSalesCount,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'whatsapp_welcome_message' => 'nullable|string|max:1000',
            'allowed_services' => 'nullable|array',
            'allowed_services.*' => 'string|in:airtime,data,cable,electricity',
        ]);

        $data = [
            'whatsapp_welcome_message' => $validated['whatsapp_welcome_message'] ?? null,
            'whatsapp_allowed_services' => $validated['allowed_services'] ?? [],
        ];

        $request->user()->business->update($data);

        return back()->with('success', 'WhatsApp bot settings updated successfully.');
    }
}
