<?php

namespace App\Repositories\Interfaces;

use App\Models\Exam;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ExamRepositoryInterface
{
    public function getPaginated(string $institutionId, array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function getAllByInstitution(string $institutionId): Collection;
    public function findById(string $id, string $institutionId): ?Exam;
    public function create(array $data): Exam;
    public function update(string $id, string $institutionId, array $data): Exam;
    public function delete(string $id, string $institutionId): bool;
    public function getStats(string $institutionId): array;
}
