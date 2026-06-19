<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\User;

class ExamPolicy
{
    /**
     * Perform pre-authorization checks.
     * dev role bypasses all policy checks and sees everything.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'dev') {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can list exams.
     * admin can only see exams within their own institution.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view a specific exam.
     * Enforces institution_id match — cannot be bypassed via URL injection.
     */
    public function view(User $user, Exam $exam): bool
    {
        if ($exam->institution_id !== $user->institution_id) {
            return false;
        }

        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'peserta') {
            return is_array($exam->settings)
                && in_array($user->id, $exam->settings['participants'] ?? []);
        }

        return false;
    }

    /**
     * Determine whether the user can create exams.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the exam.
     */
    public function update(User $user, Exam $exam): bool
    {
        return $user->role === 'admin'
            && $exam->institution_id === $user->institution_id;
    }

    /**
     * Determine whether the user can delete the exam.
     */
    public function delete(User $user, Exam $exam): bool
    {
        return $user->role === 'admin'
            && $exam->institution_id === $user->institution_id;
    }

    /**
     * Determine whether the user can manage participants for the exam.
     */
    public function manageParticipants(User $user, Exam $exam): bool
    {
        return $user->role === 'admin'
            && $exam->institution_id === $user->institution_id;
    }
}
