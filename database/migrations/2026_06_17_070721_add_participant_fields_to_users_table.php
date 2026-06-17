<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('jabatan')->nullable()->after('instansi');
            $table->string('status')->default('aktif')->after('role'); // aktif, nonaktif, pending
            $table->json('exam_data')->nullable()->after('nip_nik');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['jabatan', 'status', 'exam_data']);
        });
    }
};
