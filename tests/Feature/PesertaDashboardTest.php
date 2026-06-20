<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest cannot access peserta dashboard', function () {
    $this->get(route('dashboard.peserta'))
        ->assertRedirect('/login');
});

test('admin cannot access peserta dashboard', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('dashboard.peserta'))
        ->assertForbidden();
});

test('proctor cannot access peserta dashboard', function () {
    $proctor = User::factory()->proctor()->create();

    $this->actingAs($proctor)
        ->get(route('dashboard.peserta'))
        ->assertForbidden();
});

test('peserta can access peserta dashboard', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('dashboard.peserta'))
        ->assertStatus(200);
});

test('peserta dashboard shows empty state when not registered to any exam', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('dashboard.peserta'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/Index')
            ->where('isRegistered', false)
            ->where('ongoingExam', null)
            ->where('availableExams', [])
        );
});

test('peserta dashboard shows exam when registered to an exam', function () {
    $institution = \App\Models\Institution::create([
        'name' => 'Test Institution',
        'slug' => 'test-institution',
    ]);

    $peserta = User::factory()->create([
        'role' => 'peserta',
        'institution_id' => $institution->id,
    ]);

    $exam = \App\Models\Exam::create([
        'institution_id' => $institution->id,
        'user_id' => $peserta->id,
        'title' => 'Ujian Akhir Semester',
        'type' => 'Simulasi',
        'duration' => 100,
        'passing_grade' => 65,
        'status' => 'aktif',
        'settings' => [
            'participants' => [$peserta->id],
            'show_answers' => true,
        ],
    ]);

    $this->actingAs($peserta)
        ->get(route('dashboard.peserta'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/Index')
            ->where('isRegistered', true)
            ->where('ongoingExam.title', 'Ujian Akhir Semester')
            ->has('availableExams', 1)
        );
});

test('guest cannot access peserta ujian-saya page', function () {
    $this->get(route('peserta.ujian-saya'))
        ->assertRedirect('/login');
});

test('peserta can access peserta ujian-saya page', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('peserta.ujian-saya'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/UjianSaya')
            ->has('exams.data')
            ->has('exams.links')
        );
});

test('peserta ujian-saya page shows empty state when not registered', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('peserta.ujian-saya'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/UjianSaya')
            ->where('exams.data', [])
        );
});

test('peserta ujian-saya page shows registered exams with pagination', function () {
    $institution = \App\Models\Institution::create([
        'name' => 'Test Institution 2',
        'slug' => 'test-institution-2',
    ]);

    $peserta = User::factory()->create([
        'role' => 'peserta',
        'institution_id' => $institution->id,
    ]);

    // Create 3 exams
    for ($i = 1; $i <= 3; $i++) {
        \App\Models\Exam::create([
            'institution_id' => $institution->id,
            'user_id' => $peserta->id,
            'title' => "Ujian Ke-" . $i,
            'type' => 'Latihan',
            'duration' => 60,
            'passing_grade' => 60,
            'status' => 'aktif',
            'settings' => [
                'participants' => [$peserta->id],
                'show_answers' => true,
            ],
        ]);
    }

    $this->actingAs($peserta)
        ->get(route('peserta.ujian-saya'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/UjianSaya')
            ->has('exams.data', 3)
            ->where('exams.total', 3)
        );
});

test('guest cannot access peserta hasil-nilai page', function () {
    $this->get(route('peserta.hasil-nilai'))
        ->assertRedirect('/login');
});

test('peserta can access peserta hasil-nilai page', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('peserta.hasil-nilai'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/HasilNilai')
            ->has('stats')
            ->has('history.data')
            ->has('history.links')
        );
});

test('peserta hasil-nilai page displays exam attempt history', function () {
    $peserta = User::factory()->create([
        'role' => 'peserta',
        'exam_data' => [
            'riwayat' => [
                [
                    'exam_id' => 'exam-1',
                    'nama' => 'Ujian Kompetensi Dasar',
                    'tgl' => '20 Jun 2026',
                    'nilai' => 85.5,
                    'lulus' => true
                ],
                [
                    'exam_id' => 'exam-2',
                    'nama' => 'Simulasi Tes TKP',
                    'tgl' => '19 Jun 2026',
                    'nilai' => 55.0,
                    'lulus' => false
                ]
            ]
        ]
    ]);

    $this->actingAs($peserta)
        ->get(route('peserta.hasil-nilai'))
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('Dashboard/Peserta/HasilNilai')
            ->has('history.data', 2)
            ->where('history.data.0.title', 'Ujian Kompetensi Dasar')
            ->where('history.data.0.score', 85.5)
            ->where('history.data.0.status', 'Lulus')
            // Assert stats
            ->where('stats.total_selesai', 2)
            ->where('stats.total_lulus', 1)
            ->where('stats.skor_tertinggi', 85.5)
        );
});


