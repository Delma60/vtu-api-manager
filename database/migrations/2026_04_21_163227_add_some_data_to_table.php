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
            //
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });

        Schema::table('discounts', function (Blueprint $table) {
            //
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });

        Schema::table('network_types', function (Blueprint $table) {
            //
            $table->enum('environment', ['live', 'test'])->default('live')->after('business_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('networks');
        Schema::dropIfExists('network_types');
        Schema::dropIfExists('discounts');
        
    }
};
