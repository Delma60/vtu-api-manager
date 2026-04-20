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
        Schema::create('api_credentials', function (Blueprint $table) {
            $table->id();
            // Assuming your users log in, we link the key to a user ID.
            // Change this to business_id or whatever entity owns the key if needed.
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable(); // e.g., "Main Server Key"
            $table->string('environment')->default('live'); // 'live' or 'test'
            $table->string('key_prefix')->index(); // e.g., 'VTUSECK-' or 'VTUSECK_TEST-'
            $table->text('hashed_key')->unique(); // We NEVER store the plain text key
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_credentials');
    }
};
