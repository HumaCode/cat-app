<?php

namespace App\Services;

use App\Models\Exam;
use App\Repositories\Interfaces\ExamRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ExamService
{
    public function __construct(
        protected ExamRepositoryInterface $examRepo
    ) {}

    public function getPaginatedExams(string $institutionId, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return $this->examRepo->getPaginated($institutionId, $filters, $perPage);
    }

    public function getAllExamsByInstitution(string $institutionId): Collection
    {
        return $this->examRepo->getAllByInstitution($institutionId);
    }

    public function getExamById(string $id, string $institutionId): ?Exam
    {
        return $this->examRepo->findById($id, $institutionId);
    }

    public function createExam(string $institutionId, ?string $userId, array $data): Exam
    {
        $data['institution_id'] = $institutionId;
        $data['user_id'] = $userId;

        // Set default settings JSON if not provided
        if (!isset($data['settings'])) {
            $data['settings'] = $this->getDefaultSettings();
        } else {
            // Merge defaults to ensure no missing keys
            $data['settings'] = array_merge($this->getDefaultSettings(), $data['settings']);
        }

        // Determine status automatically if start/end times are provided
        $data['status'] = $this->determineStatus($data);

        return $this->examRepo->create($data);
    }

    public function updateExam(string $id, string $institutionId, array $data): Exam
    {
        // Maintain defaults if partial update
        if (isset($data['settings'])) {
            $existing = $this->examRepo->findById($id, $institutionId);
            $existingSettings = $existing ? ($existing->settings ?? []) : [];
            $data['settings'] = array_merge($existingSettings, $data['settings']);
        }

        // Recalculate status whenever dates or status field is explicitly changed
        if (isset($data['start_time']) || isset($data['end_time']) || isset($data['status'])) {
            // Merge existing dates so determineStatus has full context
            if (!isset($data['start_time']) || !isset($data['end_time'])) {
                $existing = $existing ?? $this->examRepo->findById($id, $institutionId);
                if ($existing) {
                    $data['start_time'] = $data['start_time'] ?? $existing->start_time;
                    $data['end_time']   = $data['end_time']   ?? $existing->end_time;
                }
            }
            $data['status'] = $this->determineStatus($data);
        }

        return $this->examRepo->update($id, $institutionId, $data);
    }

    public function deleteExam(string $id, string $institutionId): bool
    {
        return $this->examRepo->delete($id, $institutionId);
    }

    public function getExamStats(string $institutionId): array
    {
        return $this->examRepo->getStats($institutionId);
    }

    /**
     * Get real-time live monitoring data scoped to the institution.
     */
    public function getLiveStats(string $institutionId): array
    {
        $user = auth()->user();

        // Resolve base query scoped to institution
        if ($user && $user->role === 'dev') {
            $base = \App\Models\Exam::query();
        } else {
            $base = \App\Models\Exam::where('institution_id', $institutionId);
        }

        // All active exams
        $activeExams = (clone $base)->where('status', 'aktif')->get();

        // Sum up participants across all active exams
        $activeParticipants = 0;
        foreach ($activeExams as $exam) {
            $activeParticipants += count($exam->settings['participants'] ?? []);
        }

        // Total participants registered across ALL institution exams
        $allExams = (clone $base)->get();
        $allParticipantIds = collect();
        foreach ($allExams as $exam) {
            $allParticipantIds = $allParticipantIds->merge($exam->settings['participants'] ?? []);
        }
        $totalParticipants = $allParticipantIds->unique()->count();

        // First active exam's progress (window-based: start_time → end_time)
        $firstActive = $activeExams->first();
        $activeExamTitle   = null;
        $progressPercent   = 0;

        if ($firstActive && $firstActive->start_time) {
            $activeExamTitle = $firstActive->title;

            if ($firstActive->end_time) {
                // Progress = elapsed portion of the exam WINDOW (start → end)
                $start   = $firstActive->start_time->timestamp;
                $end     = $firstActive->end_time->timestamp;
                $now     = now()->timestamp;
                $window  = $end - $start;
                $elapsed = $now - $start;

                $progressPercent = $window > 0
                    ? (int) min(100, max(0, round(($elapsed / $window) * 100)))
                    : 0;
            } else {
                // No end_time set — show 0% (unknown window)
                $progressPercent = 0;
            }
        }

        return [
            'active_exams'       => $activeExams->count(),
            'active_participants' => $activeParticipants,
            'total_participants'  => $totalParticipants,
            'active_exam_title'   => $activeExamTitle,
            'progress_percent'    => $progressPercent,
        ];
    }

    /**
     * Get default settings for an exam.
     * Note: seksi is intentionally empty — admins configure sections manually in Step 3.
     */
    protected function getDefaultSettings(): array
    {
        return [
            'show_results'       => true,
            'show_answers'       => false,
            'shuffle_questions'  => true,
            'shuffle_options'    => true,
            'lockdown_mode'      => true,
            'activity_logging'   => true,
            'attempts_limit'     => 1,
            'access_type'        => 'Hanya peserta terdaftar',
            'passing_grade_type' => 'total',
            'participant_method' => 'Pilih dari daftar pengguna',
            'filter_institution' => 'Semua institusi',
            'quota'              => 0,
            'seksi'              => [],
            'participants'       => [],
        ];
    }

    /**
     * Determine exam status based on schedule dates.
     */
    protected function determineStatus(array $data): string
    {
        if (isset($data['status']) && $data['status'] === 'draft') {
            return 'draft';
        }

        $now = now();
        $start = isset($data['start_time']) ? CarbonImmutable::parse($data['start_time']) : null;
        $end = isset($data['end_time']) ? CarbonImmutable::parse($data['end_time']) : null;

        if (!$start) {
            return $data['status'] ?? 'draft';
        }

        if ($now->lt($start)) {
            return 'terjadwal';
        }

        if ($end && $now->gt($end)) {
            return 'selesai';
        }

        return 'aktif';
    }
}
