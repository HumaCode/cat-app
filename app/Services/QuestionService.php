<?php

namespace App\Services;

use App\Repositories\Interfaces\QuestionRepositoryInterface;
use App\Models\Question;
use Illuminate\Pagination\LengthAwarePaginator;

class QuestionService
{
    public function __construct(
        protected QuestionRepositoryInterface $questionRepo
    ) {}

    public function getQuestions(
        string $institutionId,
        ?string $categoryId = null,
        ?string $type = null,
        ?string $difficulty = null,
        ?string $search = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        return $this->questionRepo->getPaginatedByInstitution(
            $institutionId,
            $categoryId,
            $type,
            $difficulty,
            $search,
            $perPage
        );
    }

    public function createQuestion(array $data): Question
    {
        return $this->questionRepo->create($data);
    }

    public function updateQuestion(string $id, array $data): Question
    {
        return $this->questionRepo->update($id, $data);
    }

    public function deleteQuestion(string $id): bool
    {
        return $this->questionRepo->delete($id);
    }

    public function getQuestionStats(string $institutionId): array
    {
        return [
            'total_soal' => $this->questionRepo->countByInstitution($institutionId) + $this->questionRepo->countDraftsByInstitution($institutionId),
            'pg_count' => $this->questionRepo->countByType($institutionId, 'pg'),
            'essay_count' => $this->questionRepo->countByType($institutionId, 'essay'),
            'other_count' => $this->questionRepo->countOtherTypes($institutionId, ['pg', 'essay']),
            'draft' => $this->questionRepo->countDraftsByInstitution($institutionId),
        ];
    }
}
