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
        // Add business_id to Wallets
        Schema::table('wallets', function (Blueprint $table) {
            $table->foreignId('business_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('businesses')
                  ->cascadeOnDelete();
        });

        // Add business_id to Transactions
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('business_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('businesses')
                  ->cascadeOnDelete();
        });
        // to provider 
        Schema::table('providers', function (Blueprint $table) {
            $table->foreignId('business_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('businesses')
                  ->cascadeOnDelete();
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->foreignId('business_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('businesses')
                  ->cascadeOnDelete();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });
        
        
    }
};