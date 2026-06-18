<?php

use App\Models\Exam;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->institutionA = Institution::create([
        'name' => 'Kementerian Kominfo',
        'slug' => 'kominfo',
        'subscription_plan' => 'professional',
    ]);

    $this->institutionB = Institution::create([
        'name' => 'Kementerian Keuangan',
        'slug' => 'kemenkeu',
        'subscription_plan' => 'professional',
    ]);

    $this->adminA = User::factory()->admin()->create([
        'institution_id' => $this->institutionA->id,
        'email'          => 'adminA@example.com',
    ]);

    $this->adminB = User::factory()->admin()->create([
        'institution_id' => $this->institutionB->id,
        'email'          => 'adminB@example.com',
    ]);

    $this->dev = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role'           => 'dev',
        'email'          => 'dev@example.com',
    ]);

    $this->examA = Exam::create([
        'institution_id' => $this->institutionA->id,
        'user_id'        => $this->adminA->id,
        'title'          => 'Ujian Kominfo',
        'type'           => 'Simulasi',
        'duration'       => 60,
        'status'         => 'draft',
        'settings'       => ['participants' => [], 'seksi' => []],
    ]);

    $this->examB = Exam::create([
        'institution_id' => $this->institutionB->id,
        'user_id'        => $this->adminB->id,
        'title'          => 'Ujian Kemenkeu',
        'type'           => 'Simulasi',
        'duration'       => 60,
        'status'         => 'draft',
        'settings'       => ['participants' => [], 'seksi' => []],
    ]);
});

// ─── Middleware: role:admin blocks peserta/proctor ───────────────────────────

test('peserta cannot access ujian index', function () {
    $peserta = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role'           => 'peserta',
    ]);

    $this->actingAs($peserta)
        ->get(route('ujian.index'))
        ->assertForbidden();
});

test('proctor cannot access ujian index', function () {
    $proctor = User::factory()->proctor()->create([
        'institution_id' => $this->institutionA->id,
    ]);

    $this->actingAs($proctor)
        ->get(route('ujian.index'))
        ->assertForbidden();
});

// ─── Admin: scoped to own institution ────────────────────────────────────────

test('adminA can access ujian index', function () {
    $this->actingAs($this->adminA)
        ->get(route('ujian.index'))
        ->assertSuccessful();
});

test('adminA can view their own exam', function () {
    $this->actingAs($this->adminA)
        ->get(route('ujian.show', $this->examA->id))
        ->assertSuccessful();
});

test('adminA cannot view examB from institutionB', function () {
    // Even with a valid exam ID, institution scoping in repository returns null → 404
    $this->actingAs($this->adminA)
        ->get(route('ujian.show', $this->examB->id))
        ->assertNotFound();
});

test('adminA cannot update examB', function () {
    $this->actingAs($this->adminA)
        ->put(route('ujian.update', $this->examB->id), ['title' => 'Hacked'])
        ->assertNotFound();
});

test('adminA cannot delete examB', function () {
    $this->actingAs($this->adminA)
        ->delete(route('ujian.destroy', $this->examB->id))
        ->assertNotFound();
});

test('adminA cannot monitor examB', function () {
    $this->actingAs($this->adminA)
        ->get(route('ujian.monitor', $this->examB->id))
        ->assertNotFound();
});

test('adminA cannot access report of examB', function () {
    $this->actingAs($this->adminA)
        ->get(route('ujian.report', $this->examB->id))
        ->assertNotFound();
});

// ─── URL injection: ?institution_id cannot bypass scoping ────────────────────

test('adminA cannot bypass scoping via query string institution_id', function () {
    // Attempting to spoof institution_id via URL — must still return 404
    $response = $this->actingAs($this->adminA)
        ->get(route('ujian.show', $this->examB->id) . '?institution_id=' . $this->institutionB->id);

    $response->assertNotFound();
});

test('adminA store always attaches their own institution_id regardless of payload', function () {
    $this->actingAs($this->adminA)
        ->post(route('ujian.store'), [
            'title'          => 'Ujian Injeksi',
            'type'           => 'Simulasi',
            'duration'       => 30,
            // Attacker tries to set a different institution
            'institution_id' => $this->institutionB->id,
        ])
        ->assertRedirect(route('ujian.index'));

    // The saved exam must belong to adminA's institution, not institutionB
    $this->assertDatabaseHas('exams', [
        'title'          => 'Ujian Injeksi',
        'institution_id' => $this->institutionA->id,
    ]);

    $this->assertDatabaseMissing('exams', [
        'title'          => 'Ujian Injeksi',
        'institution_id' => $this->institutionB->id,
    ]);
});

// ─── dev: sees everything ─────────────────────────────────────────────────────

test('dev can view ujian index', function () {
    $this->actingAs($this->dev)
        ->get(route('ujian.index'))
        ->assertSuccessful();
});

test('dev can view examB from institutionB', function () {
    $this->actingAs($this->dev)
        ->get(route('ujian.show', $this->examB->id))
        ->assertSuccessful();
});

test('dev can delete any exam across institutions', function () {
    $this->actingAs($this->dev)
        ->delete(route('ujian.destroy', $this->examB->id))
        ->assertRedirect(route('ujian.index'));

    $this->assertModelMissing($this->examB);
});

// ─── adminB: sees only institutionB ──────────────────────────────────────────

test('adminB cannot view examA from institutionA', function () {
    $this->actingAs($this->adminB)
        ->get(route('ujian.show', $this->examA->id))
        ->assertNotFound();
});

test('adminB can view their own examB', function () {
    $this->actingAs($this->adminB)
        ->get(route('ujian.show', $this->examB->id))
        ->assertSuccessful();
});
