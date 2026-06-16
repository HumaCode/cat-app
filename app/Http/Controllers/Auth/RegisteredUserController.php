<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'institution_name' => 'required|string|max:255',
            'username' => 'required|string|lowercase|alpha_dash|max:255|unique:'.User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'plan' => 'nullable|string|in:starter,professional,enterprise',
        ]);

        $plan = $request->input('plan', 'starter');

        // 1. Buat Institusi gratis (Starter Workspace) secara otomatis
        $institution = \App\Models\Institution::create([
            'name' => $request->institution_name,
            'slug' => \Illuminate\Support\Str::slug($request->institution_name . '-' . \Illuminate\Support\Str::random(4)),
            'subscription_plan' => $plan,
        ]);

        // 2. Buat User dengan role admin terikat ke institusi tersebut
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'institution_id' => $institution->id,
            'role' => 'admin',
        ]);

        event(new Registered($user));

        // 3. Jika memilih paket berbayar, alihkan ke Xendit Checkout Invoice
        if (in_array($plan, ['professional', 'enterprise'])) {
            $paymentUrl = \App\Services\XenditService::createInvoice($institution, $user, $plan);
            if ($paymentUrl) {
                return Inertia::location($paymentUrl);
            }
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
