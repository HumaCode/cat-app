<?php

use App\Models\User;
use App\Models\Institution;
use App\Models\Exam;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->institution = Institution::create([
        'name' => 'Badan Kepegawaian Negara',
        'slug' => 'bkn',
        'subscription_plan' => 'professional',
    ]);

    $this->user = User::factory()->admin()->create([
        'institution_id' => $this->institution->id,
        'email' => 'admin@example.com',
    ]);
});

test('authenticated admin can view exam index', function () {
    $response = $this
        ->actingAs($this->user)
        ->get('/ujian');

    $response->assertOk();
});

test('admin can create an exam', function () {
    $response = $this
        ->actingAs($this->user)
        ->post('/ujian', [
            'title' => 'Simulasi SKD CPNS 2026',
            'type' => 'Simulasi',
            'duration' => 100,
            'passing_grade' => 65,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('exams', [
        'title' => 'Simulasi SKD CPNS 2026',
        'type' => 'Simulasi',
        'duration' => 100,
        'institution_id' => $this->institution->id,
    ]);
});

test('admin can update an exam', function () {
    $exam = Exam::create([
        'title' => 'Simulasi CPNS Awal',
        'type' => 'Simulasi',
        'duration' => 90,
        'passing_grade' => 60,
        'institution_id' => $this->institution->id,
        'status' => 'draft',
    ]);

    $response = $this
        ->actingAs($this->user)
        ->put("/ujian/{$exam->id}", [
            'title' => 'Simulasi CPNS Revisi',
            'duration' => 120,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('exams', [
        'id' => $exam->id,
        'title' => 'Simulasi CPNS Revisi',
        'duration' => 120,
    ]);
});

test('admin can delete an exam', function () {
    $exam = Exam::create([
        'title' => 'Ujian Sampah',
        'type' => 'Latihan',
        'duration' => 30,
        'passing_grade' => 50,
        'institution_id' => $this->institution->id,
        'status' => 'draft',
    ]);

    $response = $this
        ->actingAs($this->user)
        ->delete("/ujian/{$exam->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('exams', [
        'id' => $exam->id,
    ]);
});

test('exams list is scoped to the institution', function () {
    $otherInstitution = Institution::create([
        'name' => 'Kementerian Keuangan',
        'slug' => 'kemenkeu',
        'subscription_plan' => 'professional',
    ]);

    // Create exam in BKN (authenticated user's institution)
    $myExam = Exam::create([
        'title' => 'Ujian BKN',
        'type' => 'Resmi',
        'duration' => 60,
        'passing_grade' => 70,
        'institution_id' => $this->institution->id,
    ]);

    // Create exam in Kemenkeu (another institution)
    $otherExam = Exam::create([
        'title' => 'Ujian Kemenkeu',
        'type' => 'Resmi',
        'duration' => 60,
        'passing_grade' => 70,
        'institution_id' => $otherInstitution->id,
    ]);

    $response = $this
        ->actingAs($this->user)
        ->get('/ujian');

    $response->assertOk();
    
    // Assert page details scoped correctly
    $page = $response->original->getData()['page'];
    $examList = $page['props']['exams']['data'];
    
    $titles = collect($examList)->pluck('title');
    
    expect($titles)->toContain('Ujian BKN');
    expect($titles)->not->toContain('Ujian Kemenkeu');
});
