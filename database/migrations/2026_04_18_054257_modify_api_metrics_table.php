<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('api_metrics', function (Blueprint $table) {
            $table->string('service_type')->default('airtime')->after('business_id');
            $table->string('endpoint')->nullable()->after('network');

            // 1. DROP THE FOREIGN KEY FIRST
            $table->dropForeign(['provider_id']);

            // 2. MAKE PROVIDER ID OPTIONAL FOR ROUTE METRICS
            $table->foreignId('provider_id')->nullable()->change();

            // 3. NOW IT IS SAFE TO DROP THE INDEXES
            $table->dropUnique('metrics_unique_idx');
            $table->dropIndex('api_metrics_provider_id_period_date_index');

            // 4. ADD ROUTE-BASED METRIC INDEXES
            $table->unique(['business_id', 'service_type', 'endpoint', 'period_date', 'period_type'], 'metrics_unique_idx_v2');
            $table->index(['service_type', 'period_date']);
            $table->index(['endpoint', 'period_date']);

            // 5. RESTORE THE FOREIGN KEY
            $table->foreign('provider_id')->references('id')->on('providers')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('api_metrics', function (Blueprint $table) {
            // 1. Drop the foreign key again before rolling back indexes
            $table->dropForeign(['provider_id']);

            // 2. Drop the new indexes
            $table->dropUnique('metrics_unique_idx_v2');
            $table->dropIndex(['service_type', 'period_date']);
            $table->dropIndex(['endpoint', 'period_date']);

            // 3. Drop the new column
            $table->dropColumn('endpoint');
            $table->dropColumn('service_type');

            // 4. Restore provider_id as required again
            $table->foreignId('provider_id')->nullable(false)->change();

            // 5. Restore the old indexes exactly as they were
            $table->unique(['business_id', 'provider_id', 'service_id', 'network', 'period_date', 'period_type'], 'metrics_unique_idx');
            $table->index(['provider_id', 'period_date'], 'api_metrics_provider_id_period_date_index');

            // 6. Restore the foreign key
            $table->foreign('provider_id')->references('id')->on('providers')->cascadeOnDelete();
        });
    }
};
