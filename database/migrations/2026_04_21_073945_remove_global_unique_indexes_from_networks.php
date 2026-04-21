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
        Schema::table('networks', function (Blueprint $table) {
            //
            $table->dropUnique(['name']);
            $table->dropUnique(['code']);

            // Add new unique index scoped to the business
            $table->unique(['business_id', 'name']);
            $table->unique(['business_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('networks', function (Blueprint $table) {
            //
            $table->dropUnique(['business_id', 'name']);
        });
    }
};
