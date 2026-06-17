<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_options', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('question_id')->constrained('questions')->cascadeOnDelete();
            $table->text('option_text')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->integer('order_column')->default(0);
            $table->text('pair_text')->nullable(); // For matching/jodohkan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_options');
    }
};
