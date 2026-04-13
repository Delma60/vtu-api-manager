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
        
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique(); // Your internal tracking ID (e.g., txn_12345)
            $table->string('vendor_reference')->nullable(); // The ID returned by the upstream API (e.g., MTN's server ref)
            
            // 2. Relationships
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // The specific upstream API used (null if it failed before reaching a provider)
            $table->foreignId('provider_id')->nullable()->constrained('providers'); 
            // The specific package bought (e.g., ID for "MTN 1GB Corporate")
            $table->unsignedBigInteger('service_id')->nullable(); // No constraint - services table not yet created 

            // 3. Core Payload Data
            $table->string('type')->index(); // 'airtime', 'data', 'electricity', 'cable'
            $table->string('network'); // 'mtn', 'airtel', 'ikedc'
            $table->string('destination'); // The phone number, meter number, or smartcard

            // 4. Financial Audit Trail
            $table->decimal('amount', 12, 2); // What you charged your user
            $table->decimal('cost', 12, 2)->nullable(); // What the vendor charged you
            $table->decimal('profit', 12, 2)->virtualAs('amount - cost'); // Auto-computed margin
            
            // Wallet state capture (prevents complex recalculations later)
            $table->decimal('previous_balance', 12, 2); 
            $table->decimal('new_balance', 12, 2);

            // 5. State Management
            $table->enum('status', ['pending', 'processing', 'successful', 'failed', 'refunded'])
                  ->default('pending')
                  ->index();

            // 6. Debugging / Raw Data
            // Stores the exact JSON sent to and received from the vendor for dispute resolution
            $table->json('meta_data')->nullable(); 

            $table->timestamps();

            // Compound indexes for faster dashboard queries
            $table->index(['user_id', 'created_at']);
            $table->index(['status', 'created_at']);
        });
        
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('transactions');
        Schema::enableForeignKeyConstraints();
    }
};
