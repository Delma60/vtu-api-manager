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
        Schema::table('api_metrics', function (Blueprint $table) {
            //
            $table->string('endpoint')->nullable()->after('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('api_metrics', function (Blueprint $table) {
            //
            $table->dropColumn('endpoint');
        });
    }
};
