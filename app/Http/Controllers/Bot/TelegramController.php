<?php

// app/Http/Controllers/Bot/TelegramController.php

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

class TelegramController extends Controller
{
    public function __construct(protected VtuManager $vtuManager) {}

    /**
     * Display Telegram bot settings
     */
    public function settings()
    {
        $business = auth()->user()->business;
        // package security

        if($business->package->settings['bot_access'] !== true){
            return redirect()->back()
            ->with('error', 'Your current subscription plan does not include access to the Telegram Bot feature. Please upgrade your plan to use this feature.');
        }
        
        return Inertia::render('developers/bots/telegram', [
            'globalBotUsername' => $business->telegram_bot_username ?? '',
            'merchantCode' => $business->bot_code ?? '',
            'isActive' => !empty($business->telegram_bot_token),
            'welcomeMessage' => $business->telegram_welcome_message ?? '',
            'allowedServices' => $business->allowed_services ?? ['airtime', 'data', 'cable', 'electricity'],
            'totalSalesAmount' => 0,
            'totalSalesCount' => 0,
        ]);
    }

    public function handleWebhook(Request $request, $botCode)
    {
        // 1. Identify the Tenant/Business from the bot code
        $business = Business::where('bot_code', $botCode)->first();
        
        if (!$business || !$business->telegram_bot_token) {
            Log::warning("Telegram Webhook hit with invalid bot code: {$botCode}");
            return response()->json(['status' => 'ignored']); // Return 200 so Telegram stops retrying
        }

        $update = $request->all();
        
        // Ensure it's a standard text message or callback query
        $message = $update['message'] ?? null;
        $callbackQuery = $update['callback_query'] ?? null;

        if ($message && isset($message['text'])) {
            $this->processTextMessage($message, $business);
        } elseif ($callbackQuery) {
            $this->processCallbackQuery($callbackQuery, $business);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Handle regular text typed by the user
     */
    protected function processTextMessage(array $message, Business $business)
    {
        $chatId = $message['chat']['id'];
        $text = trim($message['text']);
        $username = $message['from']['username'] ?? 'User';

        // Get or Create Session
        $session = BotSession::firstOrCreate(
            ['chat_id' => $chatId, 'business_id' => $business->id],
            ['state' => 'idle', 'payload' => [], 'telegram_username' => $username]
        );

        // Command Routing
        if ($text === '/start') {
            return $this->handleStart($session, $business);
        }
        
        // Catch /start LINK_12345
        if (str_starts_with($text, '/start')) {
            $parts = explode(' ', $text);
            if (isset($parts[1])) {
                 // The user clicked a link from your website to link their account
                 $userId = decrypt($parts[1]); // Assuming you passed an encrypted user ID
                 $userToLink = User::find($userId);
                 if ($userToLink) {
                     $userToLink->update(['telegram_chat_id' => $chatId]);
                     $this->sendMessage($chatId, "✅ Your Telegram account has been successfully linked to your web profile!", $business->telegram_bot_token);
                 }
            }
            
            return $this->handleStart($session, $business);
        }
        
        if ($text === '/cancel') {
             $session->update(['state' => 'idle', 'payload' => []]);
             return $this->sendMessage($chatId, "❌ Action cancelled. Send /start to begin again.", $business->telegram_bot_token);
        }

        // State Machine Routing based on what step the user is currently on
        return match ($session->state) {
            'awaiting_airtime_phone' => $this->handleAirtimePhoneInput($session, $text, $business),
            'awaiting_airtime_amount' => $this->handleAirtimeAmountInput($session, $text, $business),
            default => $this->sendMessage($chatId, "I didn't understand that. Please send /start to see the menu.", $business->telegram_bot_token),
        };
    }

    /**
     * Handle button clicks (Inline Keyboards)
     */
    protected function processCallbackQuery(array $callbackQuery, Business $business)
    {
        $chatId = $callbackQuery['message']['chat']['id'];
        $data = $callbackQuery['data']; // e.g., 'buy_airtime_MTN'
        
        $session = BotSession::where('chat_id', $chatId)->where('business_id', $business->id)->first();
        if (!$session) return;

        // Example Data format: action_network (e.g. airtime_MTN)
        if (str_starts_with($data, 'airtime_')) {
            $network = str_replace('airtime_', '', $data);
            
            // Save network to payload and change state
            $payload = $session->payload ?? [];
            $payload['network'] = $network;
            
            $session->update([
                'state' => 'awaiting_airtime_phone',
                'payload' => $payload
            ]);

            $this->sendMessage($chatId, "📱 You selected {$network}. Please enter the destination phone number:\n\n(Type /cancel to abort)", $business->telegram_bot_token);
        }
        
        // Acknowledge the callback so the loading spinner on the user's button stops
        Http::post("https://api.telegram.org/bot{$business->telegram_bot_token}/answerCallbackQuery", [
            'callback_query_id' => $callbackQuery['id']
        ]);
    }

    // --- STATE HANDLERS --- //

    protected function handleStart(BotSession $session, Business $business)
    {
        $session->update(['state' => 'idle', 'payload' => []]);

        $keyboard = [
            'inline_keyboard' => [
                [
                    ['text' => '📱 Buy MTN Airtime', 'callback_data' => 'airtime_MTN'],
                    ['text' => '📱 Buy GLO Airtime', 'callback_data' => 'airtime_GLO']
                ],
                [
                    ['text' => '📱 Buy AIRTEL Airtime', 'callback_data' => 'airtime_AIRTEL'],
                    ['text' => '📱 Buy 9MOBILE Airtime', 'callback_data' => 'airtime_9MOBILE']
                ]
            ]
        ];

        $this->sendMessage($session->chat_id, "Welcome to {$business->name}! 🚀\n\nWhat would you like to do today?", $business->telegram_bot_token, $keyboard);
    }

    protected function handleAirtimePhoneInput(BotSession $session, string $phone, Business $business)
    {
        if (strlen($phone) < 10) {
            return $this->sendMessage($session->chat_id, "⚠️ Invalid phone number. Please enter a valid number.", $business->telegram_bot_token);
        }

        $payload = $session->payload;
        $payload['phone'] = $phone;

        $session->update([
            'state' => 'awaiting_airtime_amount',
            'payload' => $payload
        ]);

        $this->sendMessage($session->chat_id, "Great! Now enter the Amount you wish to recharge (e.g. 500):", $business->telegram_bot_token);
    }

    protected function handleAirtimeAmountInput(BotSession $session, string $amount, Business $business)
    {
        if (!is_numeric($amount) || $amount < 50) {
            return $this->sendMessage($session->chat_id, "⚠️ Amount must be at least ₦50. Please enter a valid amount:", $business->telegram_bot_token);
        }

        $payload = $session->payload;
        
        // 1. Resolve the User interacting with the bot. 
        // Typically you would have linked their Telegram ID to their User account in your app.
        $user = User::where('telegram_chat_id', $session->chat_id)->where('business_id', $business->id)->first();
        
        if (!$user) {
             $session->update(['state' => 'idle', 'payload' => []]);
             return $this->sendMessage($session->chat_id, "⚠️ Your Telegram account is not linked to any user profile on our website. Please link it from your dashboard first.", $business->telegram_bot_token);
        }

        // 2. Prepare payload for the VtuManager
        $vtuPayload = [
            'network' => $payload['network'],
            'phone' => $payload['phone'],
            'amount' => (int) $amount,
            'plan_type' => 'VTU',
            'platform' => 'bot',
            'tx_ref' => 'BOT_' . uniqid()
        ];

        $this->sendMessage($session->chat_id, "🔄 Processing your request...", $business->telegram_bot_token);

        try {
            // 3. Process the transaction through the core VTU system!
            $response = $this->vtuManager->process('airtime', $user, $vtuPayload);

            if ($response['status'] === 'success') {
                $msg = "✅ Transaction Successful!\n\nRecharged ₦{$amount} to {$payload['phone']} ({$payload['network']}).";
            } else {
                $msg = "❌ Transaction Failed:\n{$response['message']}";
            }

        } catch (\Exception $e) {
            Log::error('Bot Transaction Error: ' . $e->getMessage());
            $msg = "⚠️ An unexpected error occurred while processing your request.";
        }

        // Reset session state
        $session->update(['state' => 'idle', 'payload' => []]);
        $this->sendMessage($session->chat_id, $msg, $business->telegram_bot_token);
    }

    // --- UTILITY --- //

    protected function sendMessage($chatId, $text, $token, $replyMarkup = null)
    {
        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ];

        if ($replyMarkup) {
            $payload['reply_markup'] = json_encode($replyMarkup);
        }

        Http::post("https://api.telegram.org/bot{$token}/sendMessage", $payload);
    }
}