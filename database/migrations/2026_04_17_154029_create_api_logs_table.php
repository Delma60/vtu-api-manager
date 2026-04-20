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
        Schema::create('api_logs', function (Blueprint $table) {
           $table->uuid('id')->primary(); // UUID for secure Request Tracking
           
            $table->foreignId('user_id')->nullable()->constrained('vtu_api_manager.users')->nullOnDelete();
            $table->foreignId('business_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->nullable()->constrained()->cascadeOnDelete();
            
            $table->string('method', 10); // GET, POST, PUT, DELETE
            $table->text('endpoint'); // The full URL path requested
            $table->integer('status_code'); // 200, 400, 401, 500, etc.
            
            $table->string('ip_address', 45)->nullable();
            $table->integer('duration_ms')->nullable(); // Execution time in milliseconds
            
            // Storing payloads as JSON
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            
            $table->timestamps();

            // Indexes for faster searching and filtering on your UI
            $table->index('user_id');
            $table->index('status_code');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_logs');
    }
};
