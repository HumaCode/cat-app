<?php

namespace App\Repositories\Interfaces;

use App\Models\Question;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface QuestionRepositoryInterface
{
    public function getPaginatedByInstitution(
        string $institutionId,
        ?string $categoryId = null,
        ?string $type = null,
        ?string $difficulty = null,
        ?string $search = null,
        int $perPage = 15
    ): LengthAwarePaginator;

    public function getAllByInstitution(string $institutionId): Collection;
    public function findById(string $id): ?Question;
    public function create(array $data): Question;
    public function update(string $id, array $data): Question;
    public function delete(string $id): bool;
    public function countByInstitution(string $institutionId): int;
    public function countDraftsByInstitution(string $institutionId): int;
    public function countByType(string $institutionId, string $type): int;
    public function countOtherTypes(string $institutionId, array $types): int;
}
