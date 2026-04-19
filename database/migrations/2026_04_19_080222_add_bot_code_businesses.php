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
        // bot code, telegram_isActive, welcome_message
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('bot_code')->nullable()->after('mode');
            $table->boolean('telegram_is_active')->default(false)->after('bot_code');
            $table->text('telegram_welcome_message')->nullable()->after('telegram_is_active');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
