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
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('balance', 15, 2)->default(0); // Current available balance
            $table->decimal('reserved', 15, 2)->default(0); // Amount reserved/pending
            $table->decimal('total_funded', 15, 2)->default(0); // Cumulative amount funded
            $table->decimal('total_used', 15, 2)->default(0); // Cumulative amount used
            $table->string('status')->default('active'); // active, suspended, closed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};
