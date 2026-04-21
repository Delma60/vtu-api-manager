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
            
            // Moved business_id up here so it naturally falls after id
            $table->foreignId('business_id')
                  ->nullable()
                  ->constrained('businesses')
                  ->cascadeOnDelete();
                  
            // Moved environment up here so it naturally falls after business_id
            $table->enum('environment', ['live', 'test'])->default('live');

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // 1. Identity
            $table->string('name'); 
            $table->string('code'); 
            
            // 2. Connection Details
            $table->string('base_url');
            $table->text('api_key')->nullable(); 
            
            // Removed ->after('api_key') and ->after('meta')
            $table->json('meta')->nullable();
            $table->string('logo_url')->nullable();
            
            $table->text('api_secret')->nullable(); 
            
            // 3. Routing & Failover Logic
            $table->integer('priority')->default(1); 
            $table->integer('timeout_ms')->default(5000); 
            $table->boolean('is_active')->default(true); 
            
            // 4. Cached Upstream Metrics
            $table->decimal('cached_balance', 15, 2)->default(0.00); 
            $table->decimal('success_rate_7d', 5, 2)->default(100.00); 
            
            $table->timestamps();
            $table->unique(['business_id', 'environment', 'code'], 'net_bus_env_code_unique');
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
