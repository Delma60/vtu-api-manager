<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add pending_balance to wallets
        Schema::table('wallets', function (Blueprint $table) {
            $table->decimal('pending_balance', 15, 4)->default(0)->after('balance');
        });

        // 2. Create settlements table
        Schema::create('settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 4);
            $table->string('reference')->unique();
            $table->string('description')->nullable();
            $table->timestamp('settles_at'); // The exact time it becomes available
            $table->boolean('is_settled')->default(false);
            $table->timestamps();
            
            // Index for faster queries in the cron job
            $table->index(['is_settled', 'settles_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settlements');
        
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropColumn('pending_balance');
        });
    }
};