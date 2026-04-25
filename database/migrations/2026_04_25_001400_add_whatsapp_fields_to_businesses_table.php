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
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('whatsapp_verify_token')->nullable()->after('telegram_welcome_message');
            $table->text('whatsapp_access_token')->nullable()->after('whatsapp_verify_token');
            $table->string('whatsapp_phone_number_id')->nullable()->after('whatsapp_access_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_verify_token', 'whatsapp_access_token', 'whatsapp_phone_number_id']);
        });
    }
};
