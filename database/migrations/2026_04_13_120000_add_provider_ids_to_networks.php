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
        Schema::table('networks', function (Blueprint $table) {
            // Add provider foreign keys for different service types
            $table->string('airtime_api_id')->nullable();
            $table->string('airtime_pin_api_id')->nullable();
            $table->string('data_api_id')->nullable();
            $table->string('data_pin_api_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('networks', function (Blueprint $table) {
           
            
            $table->dropColumn([
                'airtime_api_id',
                'airtime_pin_api_id',
                'data_api_id',
                'data_pin_api_id',
            ]);
        });
    }
};
