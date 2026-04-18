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
        Schema::create('network_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->boolean('is_active')->default(true);
            $table->nullableMorphs('typeable');
            $table->timestamps();
        });
        // network types pivot table should be polymorphic

        // Schema::create('network_typeables', function (Blueprint $table) {
        //     $table->id();

        //     // 1. The strict foreign key to the NetworkType model
        //     $table->foreignId('network_type_id')->constrained()->cascadeOnDelete();

        //     // 2. The Polymorphic magic.
        //     // This creates `network_typeable_id` (BIGINT) and `network_typeable_type` (VARCHAR)
        //     $table->morphs('network_typeable', 'net_typeable_index');

        //     $table->timestamps();

        //     // Optional but highly recommended: Prevent duplicate attachments
        //     $table->unique(
        //         ['network_type_id', 'network_typeable_id', 'network_typeable_type'],
        //         'net_typeable_unique' // Custom index name to prevent MySQL name length errors
        //     );
        // });
        Schema::create('network_provider_pivot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('network_id')->constrained()->onDelete('cascade');
            $table->foreignId('provider_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('network_types');
        Schema::dropIfExists('network_typeables');
        Schema::dropIfExists('network_provider_pivot');
    }
};
