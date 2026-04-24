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
    Schema::create('airtime_pins', function (Blueprint $table) {
        $table->id();
        $table->foreignId('discount_id')->constrained()->cascadeOnDelete(); // Associates with the pricing plan
        $table->foreignId('network_id')->constrained()->cascadeOnDelete();
        $table->string('pin'); // Consider encrypting this
        $table->decimal('amount', 10, 2); // 100, 200, 500
        $table->enum('status', ['unused', 'used'])->default('unused');
        $table->foreignId('transaction_id')->nullable(); // Who bought it
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airtime_pins');
    }
};
