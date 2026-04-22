<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->string('support_phone')->nullable()->after('support_email');
            $table->text('address')->nullable()->after('support_phone');
            $table->string('logo_path')->nullable()->after('slug');
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn(['support_phone', 'address', 'logo_path']);
        });
    }
};