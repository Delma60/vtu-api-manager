<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('bot_sessions')) {
            return;
        }

        if (Schema::hasColumn('bot_sessions', 'platform') || Schema::hasColumn('bot_sessions', 'customer_id')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                if (Schema::hasColumn('bot_sessions', 'platform')) {
                    $table->dropColumn('platform');
                }

                if (Schema::hasColumn('bot_sessions', 'customer_id')) {
                    $table->dropColumn('customer_id');
                }
            });
        }

        if (Schema::hasColumn('bot_sessions', 'chat_id')) {
            try {
                Schema::table('bot_sessions', function (Blueprint $table) {
                    $table->dropUnique(['chat_id']);
                });
            } catch (\Throwable $e) {
                // If there is no unique index, ignore.
            }
        }

        if (!Schema::hasColumn('bot_sessions', 'business_id')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            });
        }

        if (Schema::hasColumn('bot_sessions', 'current_state') && !Schema::hasColumn('bot_sessions', 'state')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->renameColumn('current_state', 'state');
            });
        }

        if (Schema::hasColumn('bot_sessions', 'state')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->string('state')->default('idle')->change();
            });
        }

        if (!Schema::hasColumn('bot_sessions', 'telegram_username')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->string('telegram_username')->nullable();
            });
        }

        if (Schema::hasColumn('bot_sessions', 'chat_id')) {
            try {
                Schema::table('bot_sessions', function (Blueprint $table) {
                    $table->index('chat_id');
                });
            } catch (\Throwable $e) {
                // Index already exists or could not be created.
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('bot_sessions')) {
            return;
        }

        if (Schema::hasColumn('bot_sessions', 'business_id')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->dropForeign(['business_id']);
                $table->dropColumn('business_id');
            });
        }

        if (Schema::hasColumn('bot_sessions', 'telegram_username')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->dropColumn('telegram_username');
            });
        }

        if (Schema::hasColumn('bot_sessions', 'chat_id')) {
            try {
                Schema::table('bot_sessions', function (Blueprint $table) {
                    $table->dropIndex(['chat_id']);
                });
            } catch (\Throwable $e) {
                // If there is no index, ignore.
            }
        }

        if (!Schema::hasColumn('bot_sessions', 'platform')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->string('platform');
            });
        }

        if (!Schema::hasColumn('bot_sessions', 'customer_id')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->foreignId('customer_id')->nullable();
            });
        }

        if (Schema::hasColumn('bot_sessions', 'state')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                if (!Schema::hasColumn('bot_sessions', 'current_state')) {
                    $table->renameColumn('state', 'current_state');
                }
            });
        }

        if (Schema::hasColumn('bot_sessions', 'current_state')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->string('current_state')->default('START')->change();
            });
        }

        if (Schema::hasColumn('bot_sessions', 'chat_id')) {
            Schema::table('bot_sessions', function (Blueprint $table) {
                $table->unique('chat_id');
            });
        }
    }
};
