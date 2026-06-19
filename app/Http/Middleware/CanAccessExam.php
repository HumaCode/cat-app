<?php

namespace App\Http\Middleware;

use App\Models\Exam;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanAccessExam
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        // Dev role bypasses access checks
        if ($user->role === 'dev' || $user->username === 'dev') {
            return $next($request);
        }

        // Get exam ID from route parameters
        $examId = $request->route('id') ?? $request->route('exam');

        if (!$examId) {
            return $next($request);
        }

        $exam = Exam::find($examId);
        if (!$exam) {
            abort(404, 'Ujian tidak ditemukan.');
        }

        // Enforce institution ID matching
        if ($exam->institution_id !== $user->institution_id) {
            abort(403, 'Ujian ini milik institusi lain.');
        }

        // Enforce participant invitation checking
        if ($user->role === 'peserta') {
            $participants = $exam->settings['participants'] ?? [];
            if (!is_array($participants) || !in_array($user->id, $participants)) {
                abort(403, 'Anda tidak terdaftar/diundang dalam ujian ini.');
            }
        }

        return $next($request);
    }
}
