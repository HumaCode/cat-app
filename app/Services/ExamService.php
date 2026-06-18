<?php

namespace App\Services;

use App\Models\Exam;
use App\Repositories\Interfaces\ExamRepositoryInterface;
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

        // Update status if dates or status are explicitly changed
        if (isset($data['start_time']) || isset($data['end_time'])) {
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
     * Get default settings for an exam.
     */
    protected function getDefaultSettings(): array
    {
        return [
            'show_results' => true,
            'show_answers' => false,
            'shuffle_questions' => true,
            'shuffle_options' => true,
            'lockdown_mode' => true,
            'activity_logging' => true,
            'attempts_limit' => 1,
            'access_type' => 'Hanya peserta terdaftar',
            'seksi' => [
                [
                    'title' => 'TWK — Tes Wawasan Kebangsaan',
                    'icon' => '📚',
                    'soal_count' => 30,
                    'duration' => 30,
                    'correct_points' => 5,
                    'incorrect_points' => 0,
                    'status' => 'aktif'
                ],
                [
                    'title' => 'TIU — Tes Intelegensia Umum',
                    'icon' => '🔢',
                    'soal_count' => 35,
                    'duration' => 35,
                    'correct_points' => 5,
                    'incorrect_points' => 0,
                    'status' => 'aktif'
                ],
                [
                    'title' => 'TKP — Tes Karakteristik Pribadi',
                    'icon' => '❤️',
                    'soal_count' => 45,
                    'duration' => 35,
                    'correct_points' => 5,
                    'incorrect_points' => 0,
                    'status' => 'aktif'
                ]
            ],
            'participants' => [] // Store registered user IDs
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
