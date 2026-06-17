<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\XenditWebhookController;
use App\Http\Controllers\QuestionBankController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::post('/webhooks/xendit', [XenditWebhookController::class, 'handle'])->name('webhooks.xendit');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Bank Soal
    Route::get('/bank-soal', [QuestionBankController::class, 'index'])->name('bank-soal.index');
    Route::post('/bank-soal', [QuestionBankController::class, 'store'])->name('bank-soal.store');
    Route::put('/bank-soal/{id}', [QuestionBankController::class, 'update'])->name('bank-soal.update');
    Route::delete('/bank-soal/{id}', [QuestionBankController::class, 'destroy'])->name('bank-soal.destroy');
    Route::post('/bank-soal/categories', [QuestionBankController::class, 'storeCategory'])->name('bank-soal.categories.store');
    Route::post('/bank-soal/bulk', [QuestionBankController::class, 'bulkAction'])->name('bank-soal.bulk');
});

require __DIR__.'/auth.php';

