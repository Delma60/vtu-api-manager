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
            $table->text('whatsapp_welcome_message')->nullable()->after('whatsapp_phone_number_id');
            $table->json('whatsapp_allowed_services')->nullable()->after('whatsapp_welcome_message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_welcome_message', 'whatsapp_allowed_services']);
        });
    }
};
