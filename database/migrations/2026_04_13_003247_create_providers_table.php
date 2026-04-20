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
        Schema::create('providers', function (Blueprint $table) {
           $table->id();

            $table->foreignId('user_id')->constrained('vtu_api_manager.users')->cascadeOnDelete();

            // 1. Identity
            $table->string('name'); // e.g., 'VTpass', 'MTN Direct', 'MobileVTU'
            $table->string('code')->unique(); // e.g., 'vtpass', 'mtn_direct' (used for backend service resolution)

            // 2. Connection Details
            $table->string('base_url');
            $table->text('api_key')->nullable(); // Store encrypted in production
            $table->text('api_secret')->nullable(); // For providers that require a Secret/Hash

            // 3. Routing & Failover Logic
            $table->integer('priority')->default(1); // 1 is highest priority. If 1 fails, dispatcher tries 2.
            $table->integer('timeout_ms')->default(5000); // Specific timeout before failing over
            $table->boolean('is_active')->default(true); // Master kill switch for the provider

            // 4. Cached Upstream Metrics (Updated via a scheduled background job)
            $table->decimal('cached_balance', 15, 2)->default(0.00); // To trigger low balance warnings
            $table->decimal('success_rate_7d', 5, 2)->default(100.00); // e.g., 98.50

            $table->timestamps();
        });

        // providerable
        Schema::create('providerables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->morphs('providerable');
            $table->decimal('cost_price', 15, 2)->default(0.00);
            $table->string('server_id')->nullable();
            $table->decimal('margin_value', 15, 2)->default(0.00);
            $table->enum('margin_type', ['percentage', 'fixed'])->default('fixed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
