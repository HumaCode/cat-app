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
        Schema::create('exams', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('institution_id');
            $table->ulid('user_id')->nullable();
            $table->ulid('category_id')->nullable();
            $table->string('title');
            $table->string('type'); // Simulasi, Latihan, Resmi
            $table->integer('duration'); // in minutes
            $table->integer('passing_grade')->default(65);
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->text('instructions')->nullable();
            $table->json('settings')->nullable(); // show_results, show_answers, shuffle_questions, shuffle_options, lockdown_mode, activity_logging, attempts_limit, access_type
            $table->string('status')->default('draft'); // draft, aktif, terjadwal, selesai
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
