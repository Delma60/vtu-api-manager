<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('settlement_bank')->nullable();
            $table->string('settlement_account_number')->nullable();
            $table->string('settlement_account_name')->nullable();
            $table->string('settlement_schedule')->default('manual')->comment('manual, daily, weekly, monthly');
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn([
                'settlement_bank', 
                'settlement_account_number', 
                'settlement_account_name', 
                'settlement_schedule'
            ]);
        });
    }
};