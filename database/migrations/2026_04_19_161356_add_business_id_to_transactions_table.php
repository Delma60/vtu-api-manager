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
        Schema::table('transactions', function (Blueprint $table) {
            //
                $table->foreignId('business_id')->nullable()->constrained()->cascadeOnDelete()->after('id');
        });

        // Schema::table('providers', function (Blueprint $table) {
        //     //
        // });

        // Schema::table('roles', function (Blueprint $table) {
        //     //
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            //
        });
    }
};
