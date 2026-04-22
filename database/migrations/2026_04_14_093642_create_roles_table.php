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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 'Agent', 'API'
            $table->string('slug');
            $table->timestamps();
            // foreign key to business
            $table->foreignId('business_id')->constrained()->onDelete('cascade');

            $table->unique(['name', 'business_id'], 'roles_name_business_unique');
            $table->unique(['slug', 'business_id'], 'roles_slug_business_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
