<?php

use App\Models\User;
use App\Models\Institution;
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

test('authenticated admin can view participant index', function () {
    $response = $this
        ->actingAs($this->user)
        ->get('/peserta');

    $response->assertOk();
});

test('admin can create a participant', function () {
    $response = $this
        ->actingAs($this->user)
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
    ]);
});

test('inertia filters prop is serialized as an object when query params are empty', function () {
    $response = $this
        ->actingAs($this->user)
        ->get('/peserta');

    $response->assertOk();
    
    // Get the Inertia page data structure
    $page = $response->original->getData()['page'];
    $filters = $page['props']['filters'];
    
    // Assert that filters is an object (stdClass) and not an empty array
    expect($filters)->toBeObject();
});
