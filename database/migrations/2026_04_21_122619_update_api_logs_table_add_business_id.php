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
        Schema::table('api_logs', function (Blueprint $table) {
            // Drop existing business_id if it exists to re-position it and update constraint
            if (Schema::hasColumn('api_logs', 'business_id')) {
                // Drop the foreign key first, then the column
                $table->dropForeign(['business_id']);
                $table->dropColumn('business_id');
            }

            // Add the new business_id with your specific requirements
            $table->foreignId('business_id')
                ->nullable()
                ->after('id')
                ->constrained('vtu_api_manager.businesses')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('api_logs', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
            
            // Optional: Restore the original column if you need to rollback perfectly
            $table->foreignId('business_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }
};