<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\XenditWebhookController;
use App\Http\Controllers\QuestionBankController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ExamController;
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

    // Kategori
    Route::get('/kategori', [CategoryController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [CategoryController::class, 'store'])->name('kategori.store');
    Route::put('/kategori/{id}', [CategoryController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori/{id}', [CategoryController::class, 'destroy'])->name('kategori.destroy');

    // Peserta
    Route::get('/peserta', [ParticipantController::class, 'index'])->name('peserta.index');
    Route::post('/peserta', [ParticipantController::class, 'store'])->name('peserta.store');
    Route::put('/peserta/{id}', [ParticipantController::class, 'update'])->name('peserta.update');
    Route::delete('/peserta/{id}', [ParticipantController::class, 'destroy'])->name('peserta.destroy');
    Route::post('/peserta/bulk', [ParticipantController::class, 'bulkAction'])->name('peserta.bulk');
    Route::post('/peserta/import', [ParticipantController::class, 'import'])->name('peserta.import');

    // Bank Soal
    Route::get('/bank-soal', [QuestionBankController::class, 'index'])->name('bank-soal.index');
    Route::post('/bank-soal', [QuestionBankController::class, 'store'])->name('bank-soal.store');
    Route::put('/bank-soal/{id}', [QuestionBankController::class, 'update'])->name('bank-soal.update');
    Route::delete('/bank-soal/{id}', [QuestionBankController::class, 'destroy'])->name('bank-soal.destroy');
    Route::post('/bank-soal/categories', [QuestionBankController::class, 'storeCategory'])->name('bank-soal.categories.store');
    Route::post('/bank-soal/bulk', [QuestionBankController::class, 'bulkAction'])->name('bank-soal.bulk');

    // Manajemen Ujian
    Route::get('/ujian', [ExamController::class, 'index'])->name('ujian.index');
    Route::post('/ujian', [ExamController::class, 'store'])->name('ujian.store');
    Route::get('/ujian/{id}', [ExamController::class, 'show'])->name('ujian.show');
    Route::put('/ujian/{id}', [ExamController::class, 'update'])->name('ujian.update');
    Route::delete('/ujian/{id}', [ExamController::class, 'destroy'])->name('ujian.destroy');
    Route::get('/ujian/{id}/monitor', [ExamController::class, 'monitor'])->name('ujian.monitor');
    Route::get('/ujian/{id}/laporan', [ExamController::class, 'report'])->name('ujian.report');

    // Peserta Ujian
    Route::get('/ujian/{id}/peserta', [ExamController::class, 'pesertaList'])->name('ujian.peserta.list');
    Route::post('/ujian/{id}/peserta', [ExamController::class, 'pesertaAdd'])->name('ujian.peserta.add');
    Route::delete('/ujian/{id}/peserta/{userId}', [ExamController::class, 'pesertaRemove'])->name('ujian.peserta.remove');
});

require __DIR__.'/auth.php';

