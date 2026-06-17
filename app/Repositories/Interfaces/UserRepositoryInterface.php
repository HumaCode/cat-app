<?php

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Support\Collection;

interface UserRepositoryInterface
{
    public function getAllParticipantsByInstitution(string $institutionId): Collection;
    public function findById(string $id): ?User;
    public function create(array $data): User;
    public function update(string $id, array $data): User;
    public function delete(string $id): bool;
    public function bulkDelete(array $ids): int;
    public function bulkUpdateStatus(array $ids, string $status): int;
    public function bulkRegisterToExam(array $ids, array $examData): int;
}
