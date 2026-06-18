<?php

use App\Models\User;
use App\Models\Institution;
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

    $this->pesertaA = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'peserta',
        'name' => 'Peserta Kominfo',
        'email' => 'pesertaA@example.com',
    ]);

    $this->pesertaB = User::factory()->create([
        'institution_id' => $this->institutionB->id,
        'role' => 'peserta',
        'name' => 'Peserta Kemenkeu',
        'email' => 'pesertaB@example.com',
    ]);
});

test('authenticated admin can view participant index scoped to their institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->get('/peserta');

    $response->assertOk();
    $response->assertSee('Peserta Kominfo');
    $response->assertDontSee('Peserta Kemenkeu');
});

test('dev can view all participants across all institutions', function () {
    $response = $this
        ->actingAs($this->dev)
        ->get('/peserta');

    $response->assertOk();
    $response->assertSee('Peserta Kominfo');
    $response->assertSee('Peserta Kemenkeu');
});

test('admin can create a participant within their institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->post('/peserta', [
            'name' => 'Rina Wijayanti',
            'email' => 'rina@example.com',
            'status' => 'aktif',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'name' => 'Rina Wijayanti',
        'email' => 'rina@example.com',
        'role' => 'peserta',
        'institution_id' => $this->institutionA->id,
        'instansi' => 'Kementerian Kominfo',
    ]);
});

test('admin cannot update a participant from another institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/peserta/{$this->pesertaB->id}", [
            'name' => 'Peserta Kemenkeu Diubah',
            'email' => 'pesertaB_new@example.com',
            'status' => 'aktif',
        ]);

    $response->assertStatus(403);
});

test('admin can update their own participant', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/peserta/{$this->pesertaA->id}", [
            'name' => 'Peserta Kominfo Diubah',
            'email' => 'pesertaA@example.com',
            'status' => 'nonaktif',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $this->pesertaA->id,
        'name' => 'Peserta Kominfo Diubah',
        'status' => 'nonaktif',
        'instansi' => 'Kementerian Kominfo',
    ]);
});

test('admin cannot delete a participant from another institution', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->delete("/peserta/{$this->pesertaB->id}");

    $response->assertStatus(403);
    $this->assertDatabaseHas('users', [
        'id' => $this->pesertaB->id,
    ]);
});

test('dev can delete any participant', function () {
    $response = $this
        ->actingAs($this->dev)
        ->delete("/peserta/{$this->pesertaB->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('users', [
        'id' => $this->pesertaB->id,
    ]);
});
