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
        Schema::table('payment_links', function (Blueprint $table) {
            //
            $table->string('service_type')->nullable()->after('description'); 
            // Stores the specific plan IDs and networks: e.g., {"network": "MTN", "plan_id": 5}
            $table->json('meta')->nullable()->after('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_links', function (Blueprint $table) {
            //
            $table->dropColumn('service_type');
            $table->dropColumn('meta');
        });
    }
};
