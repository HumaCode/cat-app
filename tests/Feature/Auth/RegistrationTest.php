<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'institution_name' => 'Test Institution',
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

test('new users can register with a paid plan and get redirected to Xendit', function () {
    \Illuminate\Support\Facades\Http::fake([
        'https://api.xendit.co/v2/invoices' => \Illuminate\Support\Facades\Http::response([
            'invoice_url' => 'https://checkout.xendit.co/web/some-uuid',
            'status' => 'PENDING',
        ], 200),
    ]);

    config(['services.xendit.secret_key' => 'xnd_test_key']);

    $response = $this->post('/register', [
        'name' => 'Premium User',
        'institution_name' => 'SMP Maju Jaya',
        'username' => 'premiumuser',
        'email' => 'premium@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'plan' => 'professional',
    ]);

    $response->assertRedirect('https://checkout.xendit.co/web/some-uuid');

    $user = \App\Models\User::where('email', 'premium@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe('admin');
    expect($user->institution->subscription_plan)->toBe('professional');
});

