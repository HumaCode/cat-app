<?php

use App\Models\User;
use App\Models\Institution;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->institutionA = Institution::create([
        'name' => 'Kementerian A',
        'code' => 'KEMA',
        'status' => 'active',
    ]);

    $this->institutionB = Institution::create([
        'name' => 'Kementerian B',
        'code' => 'KEMB',
        'status' => 'active',
    ]);

    $this->adminA = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'admin',
    ]);

    $this->adminB = User::factory()->create([
        'institution_id' => $this->institutionB->id,
        'role' => 'admin',
    ]);

    $this->dev = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'dev',
    ]);

    $this->peserta = User::factory()->create([
        'institution_id' => $this->institutionA->id,
        'role' => 'peserta',
    ]);

    // Create Category belonging to Admin A
    $this->categoryA = Category::create([
        'institution_id' => $this->institutionA->id,
        'user_id' => $this->adminA->id,
        'name' => 'Kategori Admin A',
        'icon' => '⭐',
        'slug' => 'kategori-admin-a',
        'order_column' => 1,
    ]);

    // Create Category belonging to Admin B
    $this->categoryB = Category::create([
        'institution_id' => $this->institutionB->id,
        'user_id' => $this->adminB->id,
        'name' => 'Kategori Admin B',
        'icon' => '🔥',
        'slug' => 'kategori-admin-b',
        'order_column' => 2,
    ]);
});

test('admin A can view their own categories but not admin B\'s', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->get('/kategori');

    $response->assertOk();
    
    // Admin A sees Category A
    $response->assertSee('Kategori Admin A');
    // Admin A does not see Category B
    $response->assertDontSee('Kategori Admin B');
});

test('dev can view all categories across institutions', function () {
    $response = $this
        ->actingAs($this->dev)
        ->get('/kategori');

    $response->assertOk();
    $response->assertSee('Kategori Admin A');
    $response->assertSee('Kategori Admin B');
});

test('non-admin/non-dev user cannot access kategori index', function () {
    $response = $this
        ->actingAs($this->peserta)
        ->get('/kategori');

    $response->assertStatus(403);
});

test('admin A cannot update admin B\'s category', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/kategori/{$this->categoryB->id}", [
            'name' => 'Kategori Diubah',
        ]);

    $response->assertStatus(403);
});

test('admin A can update their own category', function () {
    $response = $this
        ->actingAs($this->adminA)
        ->put("/kategori/{$this->categoryA->id}", [
            'name' => 'Kategori Admin A Diubah',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'id' => $this->categoryA->id,
        'name' => 'Kategori Admin A Diubah',
    ]);
});

test('dev can update any category', function () {
    $response = $this
        ->actingAs($this->dev)
        ->put("/kategori/{$this->categoryB->id}", [
            'name' => 'Kategori Admin B Diubah Oleh Dev',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'id' => $this->categoryB->id,
        'name' => 'Kategori Admin B Diubah Oleh Dev',
    ]);
});
