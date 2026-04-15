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
        Schema::table('discounts', function (Blueprint $table) {
            //
                $table->unsignedBigInteger('plan_type')->nullable()->after('type');
                $table->foreign('plan_type')->references('id')->on('network_types')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            //
            $table->dropForeign(['plan_type']);
            $table->dropColumn('plan_type');
        });
    }
};
