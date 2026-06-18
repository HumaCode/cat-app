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
