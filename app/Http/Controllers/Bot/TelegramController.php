<?php
namespace App\Http\Controllers\Bot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\BotSession;
// use App\Facades\Vtu; <-- Uncomment when ready to link your actual VTU logic

class TelegramController extends Controller
{
    public function handleWebhook(Request $request)
    {
        // 1. Extract data from Telegram's payload
        $message = $request->input('message');
        
        if (!$message || !isset($message['text'])) {
            return response()->json(['status' => 'ignored']);
        }

        $chatId = $message['chat']['id'];
        $text = trim($message['text']);

        // 2. Load or Create State
        $session = BotSession::firstOrCreate(
            ['chat_id' => $chatId, 'platform' => 'telegram'],
            ['current_state' => 'START']
        );

        // Allow user to cancel at any time
        if (strtolower($text) === '/cancel' || strtolower($text) === 'cancel') {
            $session->update(['current_state' => 'START', 'payload' => null]);
            $this->sendMessage($chatId, "Operation cancelled. Send 'Airtime' to start again.");
            return response()->json(['status' => 'ok']);
        }

        // 3. The State Machine
        switch ($session->current_state) {
            
            case 'START':
                if (strtolower($text) === 'airtime' || strtolower($text) === '/airtime') {
                    $this->sendMessage($chatId, "Which network? (Reply MTN, GLO, AIRTEL, or 9MOBILE)");
                    $session->update(['current_state' => 'AWAITING_NETWORK']);
                } else {
                    $this->sendMessage($chatId, "Welcome to Spur Connect! 🚀\n\nReply with 'Airtime' to buy recharge.");
                }
                break;

            case 'AWAITING_NETWORK':
                $network = strtoupper($text);
                if (!in_array($network, ['MTN', 'GLO', 'AIRTEL', '9MOBILE'])) {
                    $this->sendMessage($chatId, "Invalid network. Please reply with MTN, GLO, AIRTEL, or 9MOBILE.");
                    break;
                }

                $session->update([
                    'current_state' => 'AWAITING_PHONE',
                    'payload' => ['network' => $network]
                ]);
                $this->sendMessage($chatId, "Got it. What is the destination phone number?");
                break;

            case 'AWAITING_PHONE':
                // Basic validation (ensure it's numeric and roughly 11 digits)
                if (!preg_match('/^[0-9]{10,11}$/', $text)) {
                    $this->sendMessage($chatId, "That doesn't look like a valid phone number. Please try again.");
                    break;
                }

                $payload = $session->payload;
                $payload['phone'] = $text;
                
                $session->update([
                    'current_state' => 'AWAITING_AMOUNT',
                    'payload' => $payload
                ]);
                $this->sendMessage($chatId, "Almost done. How much airtime? (e.g., 500)");
                break;

            case 'AWAITING_AMOUNT':
                $amount = (float) $text;
                if ($amount < 50) {
                    $this->sendMessage($chatId, "Minimum amount is ₦50. Enter a valid amount.");
                    break;
                }

                $payload = $session->payload;
                
                $this->sendMessage($chatId, "Processing ₦{$amount} {$payload['network']} airtime for {$payload['phone']}... ⏳");

                // --- INTEGRATE YOUR VTU FACADE HERE ---
                try {
                    // Example: 
                    // $response = Vtu::airtime()->purchase($payload['network'], $payload['phone'], $amount);
                    
                    // Simulating success for now:
                    sleep(1); 
                    
                    $this->sendMessage($chatId, "✅ Success! ₦{$amount} sent to {$payload['phone']}.");
                } catch (\Exception $e) {
                    Log::error('Telegram Bot VTU Error: ' . $e->getMessage());
                    $this->sendMessage($chatId, "❌ Failed to process. Please try again later.");
                }

                // Reset the conversation
                $session->update(['current_state' => 'START', 'payload' => null]);
                break;
        }

        // Telegram expects a 200 OK response immediately, or it will retry the webhook.
        return response()->json(['status' => 'ok']);
    }

    /**
     * Helper function to send messages back to the user
     */
    private function sendMessage($chatId, $text)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $url = "https://api.telegram.org/bot{$token}/sendMessage";

        Http::post($url, [
            'chat_id' => $chatId,
            'text' => $text,
        ]);
    }

    /**
     * Render the Telegram Bot settings UI.
     */
    public function settings(Request $request)
    {
       $business = $request->user()->business;

        // If they don't have a unique bot code yet, generate one
        if (!$business->bot_code) {
            $business->update(['bot_code' => 'biz_' . uniqid()]);
        }

        return inertia('developers/bots/telegram', [
            'globalBotUsername' => env('TELEGRAM_BOT_USERNAME', 'SpurConnectBot'), 
            'merchantCode' => $business->bot_code,
            'isActive' => (bool) $business->telegram_is_active,
            'welcomeMessage' => $business->telegram_welcome_message,
        ]);
    }

    /**
     * Automatically register the webhook URL with Telegram.
     */
    public function syncWebhook()
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        
        if (!$token) {
            return back()->with('error', 'TELEGRAM_BOT_TOKEN is missing in .env file.');
        }

        $webhookUrl = url('/api/webhook/telegram/sk_super_secret_string');
        
        // Prevent setting webhook to localhost during local dev without a tunnel
        if (str_starts_with($webhookUrl, 'http://127.0.0.1') || str_starts_with($webhookUrl, 'http://localhost')) {
            return back()->with('error', 'Cannot sync a localhost URL. Use a tunneling service like Ngrok or Expose.');
        }

        $response = Http::post("https://api.telegram.org/bot{$token}/setWebhook", [
            'url' => $webhookUrl,
            'drop_pending_updates' => true // Clears old messages sent while bot was offline
        ]);

        if ($response->successful() && $response->json('ok')) {
            return back()->with('success', 'Webhook synchronized successfully!');
        }

        return back()->with('error', 'Failed to sync webhook. Check your Bot Token.');
    }

    public function updateMerchant(Request $request)
    {
        $request->validate([
            'is_active' => 'required|boolean',
            'welcome_message' => 'nullable|string|max:500',
        ]);

        $request->user()->business->update([
            'telegram_is_active' => $request->is_active,
            'telegram_welcome_message' => $request->welcome_message,
        ]);

        return back()->with('success', 'Telegram preferences updated.');
    }
}