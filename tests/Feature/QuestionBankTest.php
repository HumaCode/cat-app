<?php

use App\Models\User;
use App\Models\Institution;
use App\Models\Category;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->institutionA = Institution::create([
        'name' => 'Kementerian Kominfo',
        'code' => 'KOMINFO',
        'status' => 'active',
    ]);

    $this->institutionB = Institution::create([
        'name' => 'Kementerian Keuangan',
        'code' => 'KEMENKEU',
        'status' => 'active',
    ]);

    $this->adminA = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'admin',
        'email' => 'adminA@example.com',
    ]);

    $this->adminB = User::factory()->create([
        'institution_id' => $this->institutionB->id,
        'role' => 'admin',
        'email' => 'adminB@example.com',
    ]);

    $this->dev = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'dev',
        'email' => 'dev@example.com',
    ]);

    $this->categoryA = Category::create([
        'institution_id' => $this->institutionA->id,
        'name' => 'TWK Kominfo',
        'icon' => '🏛️',
        'slug' => 'twk-kominfo',
    ]);

    $this->categoryB = Category::create([
        'institution_id' => $this->institutionB->id,
        'name' => 'TWK Kemenkeu',
        'icon' => '🏛️',
        'slug' => 'twk-kemenkeu',
    ]);

    $this->questionA = Question::create([
        'institution_id' => $this->institutionA->id,
        'category_id' => $this->categoryA->id,
        'type' => 'pg',
        'difficulty' => 'Mudah',
        'points' => 5,
        'question_text' => 'Soal dari Kominfo',
        'is_active' => true,
    ]);

    $this->questionB = Question::create([
        'institution_id' => $this->institutionB->id,
        'category_id' => $this->categoryB->id,
        'type' => 'pg',
        'difficulty' => 'Mudah',
        'points' => 5,
        'question_text' => 'Soal dari Kemenkeu',
        'is_active' => true,
    ]);
});

test('adminA can view questions index scoped to institutionA', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->get('/bank-soal');

    $response->assertOk();
    
    $page = $response->original->getData()['page'];
    $questions = $page['props']['questions']['data'];

    // Check that we only see Question A and not Question B
    $texts = collect($questions)->pluck('question_text')->toArray();
    expect($texts)->toContain('Soal dari Kominfo');
    expect($texts)->not->toContain('Soal dari Kemenkeu');
});

test('dev can view all questions across all institutions', function () {
    $response = $this
        ->actingAs($this->dev)
        ->get('/bank-soal');

    $response->assertOk();
    
    $page = $response->original->getData()['page'];
    $questions = $page['props']['questions']['data'];

    $texts = collect($questions)->pluck('question_text')->toArray();
    expect($texts)->toContain('Soal dari Kominfo');
    expect($texts)->toContain('Soal dari Kemenkeu');
});

test('admin can create a question within their institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->post('/bank-soal', [
            'category_id' => $this->categoryA->id,
            'type' => 'pg',
            'difficulty' => 'Mudah',
            'points' => 5,
            'question_text' => 'Soal Baru Kominfo',
            'is_active' => true,
            'options' => [
                ['option_text' => 'A', 'is_correct' => true, 'order_column' => 0],
                ['option_text' => 'B', 'is_correct' => false, 'order_column' => 1],
            ]
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('questions', [
        'question_text' => 'Soal Baru Kominfo',
        'institution_id' => $this->institutionA->id,
    ]);
});

test('admin cannot update a question from another institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/bank-soal/{$this->questionB->id}", [
            'category_id' => $this->categoryB->id,
            'type' => 'pg',
            'difficulty' => 'Mudah',
            'points' => 10,
            'question_text' => 'Hack Soal Kemenkeu',
            'is_active' => true,
        ]);

    $response->assertStatus(403);
});

test('admin can update their own question', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/bank-soal/{$this->questionA->id}", [
            'category_id' => $this->categoryA->id,
            'type' => 'pg',
            'difficulty' => 'Sedang',
            'points' => 10,
            'question_text' => 'Soal Kominfo Diubah',
            'is_active' => true,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('questions', [
        'id' => $this->questionA->id,
        'question_text' => 'Soal Kominfo Diubah',
        'difficulty' => 'Sedang',
    ]);
});

test('admin cannot delete a question from another institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->delete("/bank-soal/{$this->questionB->id}");

    $response->assertStatus(403);
    $this->assertDatabaseHas('questions', [
        'id' => $this->questionB->id,
    ]);
});

test('dev can delete any question', function () {
    $response = $this
        ->actingAs($this->dev)
        ->delete("/bank-soal/{$this->questionB->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('questions', [
        'id' => $this->questionB->id,
    ]);
});
