<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Collection;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepo
    ) {}

    public function getParticipantsByInstitution(string $institutionId): Collection
    {
        return $this->userRepo->getAllParticipantsByInstitution($institutionId);
    }

    public function createParticipant(array $data): User
    {
        return $this->userRepo->create($data);
    }

    public function updateParticipant(string $id, array $data): User
    {
        return $this->userRepo->update($id, $data);
    }

    public function deleteParticipant(string $id): bool
    {
        return $this->userRepo->delete($id);
    }

    public function bulkDelete(array $ids): int
    {
        return $this->userRepo->bulkDelete($ids);
    }

    public function bulkUpdateStatus(array $ids, string $status): int
    {
        return $this->userRepo->bulkUpdateStatus($ids, $status);
    }

    public function bulkRegisterToExam(array $ids, array $examData): int
    {
        return $this->userRepo->bulkRegisterToExam($ids, $examData);
    }
}
