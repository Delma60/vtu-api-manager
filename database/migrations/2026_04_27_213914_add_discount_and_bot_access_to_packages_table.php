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
       Schema::table('packages', function (Blueprint $table) {
            // Add the discount column (e.g., a decimal for percentage or flat amount)
            $table->decimal('discount', 10, 2)->default(0.00)->after('price');

            // Add explicit boolean columns for separated bot access
            $table->boolean('allow_telegram_bot')->default(false)->after('discount');
            $table->boolean('allow_whatsapp_bot')->default(false)->after('allow_telegram_bot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['discount', 'allow_telegram_bot', 'allow_whatsapp_bot']);
        });
    }
};
