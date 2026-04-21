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
        // Add to tables that need test/live separation
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });

        Schema::table('api_logs', function (Blueprint $table) {
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });

        Schema::table('wallets', function (Blueprint $table) {
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('environment');
        });
        Schema::table('api_logs', function (Blueprint $table) {
            $table->dropColumn('environment');
        });
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('environment');
        });
    }
};
