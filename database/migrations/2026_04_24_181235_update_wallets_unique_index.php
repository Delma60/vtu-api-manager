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
        //
        Schema::table('wallets', function (Blueprint $table) {
            // 1. Drop the foreign key constraint first 
            // (Laravel uses the array syntax to automatically guess the name: 'wallets_user_id_foreign')
            $table->dropForeign(['user_id']);
            
            // 2. Now it's safe to drop the unique index
            $table->dropUnique('wallets_user_id_unique');
            
            // 3. Add the new composite unique constraint
            $table->unique(['user_id', 'environment', 'business_id'], 'wallet_user_env_bus_unique');
            
            // 4. Re-add the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('wallets', function (Blueprint $table) {
            // Reverse the process
            $table->dropForeign(['user_id']);
            $table->dropUnique('wallet_user_env_bus_unique');
            
            $table->unique('user_id', 'wallets_user_id_unique');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
