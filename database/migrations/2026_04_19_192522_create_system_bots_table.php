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
        Schema::create('system_bots', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('platform', ['telegram', 'whatsapp']);
            $table->json('credentials')->comment('Stores varying API keys based on platform');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_bots');
    }
};
