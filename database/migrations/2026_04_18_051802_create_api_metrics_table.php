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
        Schema::create('api_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('network')->nullable();
            $table->date('period_date'); // The date for which metrics are being tracked
            $table->enum('period_type', ['hourly', 'daily', 'weekly', 'monthly'])->default('daily');
            $table->unsignedInteger('total_requests')->default(0);
            $table->unsignedInteger('successful_requests')->default(0);
            $table->unsignedInteger('failed_requests')->default(0);
            $table->float('success_rate')->default(0)->comment('Success rate as a percentage (0-100)');
            $table->timestamps();

            // Create unique index with shorter name to prevent MySQL identifier length error
            $table->unique(['business_id', 'provider_id', 'service_id', 'network', 'period_date', 'period_type'], 'metrics_unique_idx');
            
            // Index for querying metrics
            $table->index(['business_id', 'period_date']);
            $table->index(['provider_id', 'period_date']);
            $table->index(['service_id', 'period_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_metrics');
    }
};
