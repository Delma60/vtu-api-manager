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
        Schema::create('payment_links', function (Blueprint $table) {
            $table->uuid('id')->primary(); // Secure public URL identifier
                $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->decimal('amount', 12, 2)->nullable();
            $table->string('description');
            $table->string('currency')->default('NGN');
            $table->enum('status', ['pending', 'successful', 'cancelled'])->default('pending');
            $table->string('tx_ref')->nullable()->unique();
            $table->boolean('is_reusable')->default(false); // Can it be paid multiple times?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_links');
    }
};
