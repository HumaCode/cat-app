<?php

use App\Models\User;
use App\Models\Institution;
use App\Models\Category;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->institution = Institution::create([
        'name' => 'Badan Kepegawaian Negara',
        'code' => 'BKN',
        'status' => 'active',
    ]);

    $this->user = User::factory()->create([
        'institution_id' => $this->institution->id,
        'role' => 'admin',
    ]);

    $this->category = Category::create([
        'institution_id' => $this->institution->id,
        'name' => 'TWK',
        'icon' => '🏛️',
        'slug' => 'twk',
        'order_column' => 0,
    ]);

    $this->subCategory = Category::create([
        'institution_id' => $this->institution->id,
        'parent_id' => $this->category->id,
        'name' => 'Pancasila & UUD',
        'icon' => '📜',
        'slug' => 'pancasila-uud',
        'order_column' => 0,
    ]);
});

test('authenticated user can view bank soal dashboard', function () {
    $response = $this
        ->actingAs($this->user)
        ->get('/bank-soal');

    $response->assertOk();
});

test('user can create a category', function () {
    $response = $this
        ->actingAs($this->user)
        ->post('/bank-soal/categories', [
            'name' => 'TIU',
            'parent_id' => null,
            'icon' => '🧠',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'name' => 'TIU',
        'institution_id' => $this->institution->id,
    ]);
});

test('user can create a question with options', function () {
    $response = $this
        ->actingAs($this->user)
        ->post('/bank-soal', [
            'category_id' => $this->subCategory->id,
            'type' => 'pg',
            'difficulty' => 'Mudah',
            'points' => 5,
            'question_text' => 'Apakah lambang sila ke-3 Pancasila?',
            'is_active' => true,
            'options' => [
                ['option_text' => 'Bintang', 'is_correct' => false, 'order_column' => 0],
                ['option_text' => 'Rantai', 'is_correct' => false, 'order_column' => 1],
                ['option_text' => 'Pohon Beringin', 'is_correct' => true, 'order_column' => 2],
                ['option_text' => 'Kepala Banteng', 'is_correct' => false, 'order_column' => 3],
            ]
        ]);

    $response->assertRedirect();
    
    $question = Question::where('question_text', 'Apakah lambang sila ke-3 Pancasila?')->first();
    expect($question)->not->toBeNull();
    expect($question->options)->toHaveCount(4);
    expect($question->options()->where('is_correct', true)->first()->option_text)->toBe('Pohon Beringin');
});

test('user can update a question', function () {
    $question = Question::create([
        'institution_id' => $this->institution->id,
        'category_id' => $this->subCategory->id,
        'type' => 'essay',
        'difficulty' => 'Sedang',
        'points' => 10,
        'question_text' => 'Jelaskan pengertian bela negara.',
        'is_active' => true,
    ]);

    $response = $this
        ->actingAs($this->user)
        ->put("/bank-soal/{$question->id}", [
            'category_id' => $this->subCategory->id,
            'type' => 'essay',
            'difficulty' => 'Sulit',
            'points' => 20,
            'question_text' => 'Jelaskan arti bela negara secara komprehensif.',
            'is_active' => false,
            'options' => []
        ]);

    $response->assertRedirect();
    
    $question->refresh();
    expect($question->difficulty)->toBe('Sulit');
    expect($question->points)->toBe(20);
    expect($question->question_text)->toBe('Jelaskan arti bela negara secara komprehensif.');
    expect($question->is_active)->toBe(false);
});

test('user can delete a question', function () {
    $question = Question::create([
        'institution_id' => $this->institution->id,
        'category_id' => $this->subCategory->id,
        'type' => 'tf',
        'difficulty' => 'Mudah',
        'points' => 2,
        'question_text' => 'UUD 1945 disahkan pada tanggal 18 Agustus 1945.',
        'is_active' => true,
    ]);

    $response = $this
        ->actingAs($this->user)
        ->delete("/bank-soal/{$question->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('questions', [
        'id' => $question->id,
    ]);
});

test('user can execute bulk actions', function () {
    $q1 = Question::create([
        'institution_id' => $this->institution->id,
        'category_id' => $this->subCategory->id,
        'type' => 'pg',
        'difficulty' => 'Mudah',
        'points' => 5,
        'question_text' => 'Soal 1',
        'is_active' => true,
    ]);

    $q2 = Question::create([
        'institution_id' => $this->institution->id,
        'category_id' => $this->subCategory->id,
        'type' => 'pg',
        'difficulty' => 'Mudah',
        'points' => 5,
        'question_text' => 'Soal 2',
        'is_active' => false,
    ]);

    // Test bulk active
    $response = $this
        ->actingAs($this->user)
        ->post('/bank-soal/bulk', [
            'ids' => [$q1->id, $q2->id],
            'action' => 'active'
        ]);

    $response->assertRedirect();
    expect($q1->refresh()->is_active)->toBe(true);
    expect($q2->refresh()->is_active)->toBe(true);

    // Test bulk draft
    $response = $this
        ->actingAs($this->user)
        ->post('/bank-soal/bulk', [
            'ids' => [$q1->id, $q2->id],
            'action' => 'draft'
        ]);

    $response->assertRedirect();
    expect($q1->refresh()->is_active)->toBe(false);
    expect($q2->refresh()->is_active)->toBe(false);

    // Test bulk delete
    $response = $this
        ->actingAs($this->user)
        ->post('/bank-soal/bulk', [
            'ids' => [$q1->id, $q2->id],
            'action' => 'delete'
        ]);

    $response->assertRedirect();
    $this->assertDatabaseMissing('questions', ['id' => $q1->id]);
    $this->assertDatabaseMissing('questions', ['id' => $q2->id]);
});
