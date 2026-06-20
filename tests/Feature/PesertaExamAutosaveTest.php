<?php

use App\Models\User;
use App\Models\Exam;
use App\Models\Institution;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('peserta can save progress during exam', function () {
    $institution = Institution::create([
        'name' => 'Test Institution',
        'slug' => 'test-institution',
    ]);

    $peserta = User::factory()->create([
        'role' => 'peserta',
        'institution_id' => $institution->id,
        'exam_data' => [
            'ujian' => 'Ujian Akhir Semester',
            'attempts' => [false, false, false],
            'ujian_count' => 1,
            'nilai' => null,
            'riwayat' => []
        ]
    ]);

    $exam = Exam::create([
        'institution_id' => $institution->id,
        'user_id' => $peserta->id,
        'title' => 'Ujian Akhir Semester',
        'type' => 'Simulasi',
        'duration' => 100,
        'status' => 'aktif',
        'settings' => [
            'participants' => [$peserta->id],
            'show_answers' => true,
        ],
    ]);

    // Perform save progress POST request
    $response = $this->actingAs($peserta)
        ->post(route('peserta.ujian.save-progress', $exam->id), [
            'answers' => [
                'q1' => 'A',
                'q2' => 'B'
            ],
            'flagged' => [
                'q1' => true
            ]
        ]);

    $response->assertStatus(200)
        ->assertJson(['status' => 'success']);

    // Assert that the database matches the saved progress
    $peserta->refresh();
    $activeProgress = $peserta->exam_data['active_progress'];
    expect($activeProgress['exam_id'])->toBe($exam->id);
    expect($activeProgress['answers']['q1'])->toBe('A');
    expect($activeProgress['flagged']['q1'])->toBe(true);
});

test('peserta exam view restores saved progress and time left', function () {
    $institution = Institution::create([
        'name' => 'Test Institution',
        'slug' => 'test-institution',
    ]);

    $startedAt = now()->timestamp - 600; // 10 minutes ago
    $peserta = User::factory()->create([
        'role' => 'peserta',
        'institution_id' => $institution->id,
        'exam_data' => [
            'ujian' => 'Ujian Akhir Semester',
            'attempts' => [false, false, false],
            'ujian_count' => 1,
            'nilai' => null,
            'riwayat' => [],
            'active_progress' => [
                'exam_id' => 'temp-exam-id-place-holder', // will be replaced below
                'answers' => ['q1' => 'A'],
                'flagged' => ['q1' => true],
                'started_at' => $startedAt,
            ]
        ]
    ]);

    $exam = Exam::create([
        'institution_id' => $institution->id,
        'user_id' => $peserta->id,
        'title' => 'Ujian Akhir Semester',
        'type' => 'Simulasi',
        'duration' => 100, // 100 minutes = 6000 seconds
        'status' => 'aktif',
        'settings' => [
            'participants' => [$peserta->id],
            'show_answers' => true,
        ],
    ]);

    // Correct the exam_id in progress
    $examData = $peserta->exam_data;
    $examData['active_progress']['exam_id'] = $exam->id;
    $peserta->exam_data = $examData;
    $peserta->save();

    // Access exam show page
    $response = $this->actingAs($peserta)
        ->get(route('peserta.ujian.show', $exam->id));

    $response->assertStatus(200);

    // Verify Inertia props contains the restored state
    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard/Ujian/Index')
        ->where('savedAnswers.q1', 'A')
        ->where('savedFlagged.q1', true)
        // Time left should be around 5400 seconds (6000 duration - 600 elapsed)
        ->where('timeLeftSeconds', function ($time) {
            return $time <= 5400 && $time >= 5395;
        })
    );
});

test('auto submits exam when time is fully elapsed', function () {
    $institution = Institution::create([
        'name' => 'Test Institution',
        'slug' => 'test-institution',
    ]);

    $startedAt = now()->timestamp - 7200; // 2 hours ago (exam duration is 100 mins = 6000 seconds)
    $peserta = User::factory()->create([
        'role' => 'peserta',
        'institution_id' => $institution->id,
        'exam_data' => [
            'ujian' => 'Ujian Akhir Semester',
            'attempts' => [false, false, false],
            'ujian_count' => 1,
            'nilai' => null,
            'riwayat' => [],
            'active_progress' => [
                'exam_id' => 'temp-exam-id-place-holder',
                'answers' => ['q1' => 'A'],
                'flagged' => [],
                'started_at' => $startedAt,
            ]
        ]
    ]);

    $exam = Exam::create([
        'institution_id' => $institution->id,
        'user_id' => $peserta->id,
        'title' => 'Ujian Akhir Semester',
        'type' => 'Simulasi',
        'duration' => 100,
        'status' => 'aktif',
        'settings' => [
            'participants' => [$peserta->id],
            'show_answers' => true,
        ],
    ]);

    $examData = $peserta->exam_data;
    $examData['active_progress']['exam_id'] = $exam->id;
    $peserta->exam_data = $examData;
    $peserta->save();

    // Access exam show page when time is already elapsed
    $response = $this->actingAs($peserta)
        ->get(route('peserta.ujian.show', $exam->id));

    // Should redirect back to dashboard
    $response->assertRedirect(route('dashboard.peserta'));

    // Check that active_progress was cleared and riwayat was added
    $peserta->refresh();
    expect($peserta->exam_data['active_progress'] ?? null)->toBeNull();
    expect(count($peserta->exam_data['riwayat']))->toBe(1);
    expect($peserta->exam_data['riwayat'][0]['nama'])->toBe('Ujian Akhir Semester');
});
