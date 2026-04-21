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
        Schema::create('networks', function (Blueprint $table) {
            $table->id();
            
            // Moved up and removed ->after()
            $table->foreignId('business_id')
                  ->nullable()
                  ->constrained('businesses')
                  ->cascadeOnDelete();
                  
            // Moved up and removed ->after()
            $table->enum('environment', ['live', 'test'])->default('live');

            $table->string('name');
            $table->string('code');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('airtime_api_id')->nullable();
            $table->string('airtime_pin_api_id')->nullable();
            $table->string('data_api_id')->nullable();
            $table->string('data_pin_api_id')->nullable();
            
            $table->foreignId('provider_id')->nullable()
                  ->constrained('providers')
                  ->nullOnDelete()
                  ->default(1);
        
            $table->timestamps();

            $table->unique(['business_id', 'environment', 'name'], 'net_bus_env_name_unique');
            $table->unique(['business_id', 'environment', 'code'], 'net_bus_env_code_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('networks');
    }
};
