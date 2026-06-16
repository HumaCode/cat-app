<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    
    $user = auth()->user();
    expect($user->role)->toBe('admin');
    expect($user->institution_id)->not->toBeNull();
    expect($user->institution->subscription_plan)->toBe('starter');

    $response->assertRedirect(route('dashboard', absolute: false));
});
