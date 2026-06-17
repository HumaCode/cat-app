<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function getAllParticipantsByInstitution(string $institutionId): Collection
    {
        return User::where('institution_id', $institutionId)
            ->where('role', 'peserta')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?User
    {
        return User::where('role', 'peserta')->find($id);
    }

    public function create(array $data): User
    {
        $data['role'] = 'peserta';
        if (!isset($data['password'])) {
            $data['password'] = bcrypt('password'); // Default password
        }
        return User::create($data);
    }

    public function update(string $id, array $data): User
    {
        $user = User::where('role', 'peserta')->findOrFail($id);
        $user->update($data);
        return $user;
    }

    public function delete(string $id): bool
    {
        $user = User::where('role', 'peserta')->findOrFail($id);
        return $user->delete();
    }

    public function bulkDelete(array $ids): int
    {
        return User::where('role', 'peserta')->whereIn('id', $ids)->delete();
    }

    public function bulkUpdateStatus(array $ids, string $status): int
    {
        return User::where('role', 'peserta')->whereIn('id', $ids)->update(['status' => $status]);
    }

    public function bulkRegisterToExam(array $ids, array $examData): int
    {
        $users = User::where('role', 'peserta')->whereIn('id', $ids)->get();
        $count = 0;
        foreach ($users as $user) {
            $currentData = $user->exam_data ?? [];
            $currentData['ujian'] = $examData['ujian'];
            $currentData['attempts'] = array_fill(0, $examData['attempts_limit'] ?? 3, false);
            $currentData['ujian_count'] = ($currentData['ujian_count'] ?? 0) + 1;
            $currentData['nilai'] = null;
            if (!isset($currentData['riwayat'])) {
                $currentData['riwayat'] = [];
            }
            $user->update(['exam_data' => $currentData]);
            $count++;
        }
        return $count;
    }
}
