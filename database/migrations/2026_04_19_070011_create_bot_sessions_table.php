<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bot_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // 'whatsapp' or 'telegram'
            $table->string('chat_id')->unique(); // Phone number or Telegram ID
            $table->foreignId('customer_id')->nullable(); // Link to your existing customers table
            $table->string('current_state')->default('START'); // e.g., 'AWAITING_AMOUNT', 'AWAITING_NETWORK'
            $table->json('payload')->nullable(); // Store temporary data like ['network' => 'MTN', 'amount' => 500]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bot_sessions');
    }
};
