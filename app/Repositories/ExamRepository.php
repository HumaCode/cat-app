<?php

namespace App\Repositories;

use App\Models\Exam;
use App\Repositories\Interfaces\ExamRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ExamRepository implements ExamRepositoryInterface
{
    public function getPaginated(string $institutionId, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Exam::where('institution_id', $institutionId);

        if (!empty($filters['q'])) {
            $query->where('title', 'like', '%' . $filters['q'] . '%');
        }

        if (!empty($filters['status']) && $filters['status'] !== 'semua') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAllByInstitution(string $institutionId): Collection
    {
        return Exam::where('institution_id', $institutionId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id, string $institutionId): ?Exam
    {
        return Exam::where('institution_id', $institutionId)->find($id);
    }

    public function create(array $data): Exam
    {
        return Exam::create($data);
    }

    public function update(string $id, string $institutionId, array $data): Exam
    {
        $exam = Exam::where('institution_id', $institutionId)->findOrFail($id);
        $exam->update($data);
        return $exam;
    }

    public function delete(string $id, string $institutionId): bool
    {
        $exam = Exam::where('institution_id', $institutionId)->findOrFail($id);
        return $exam->delete();
    }

    public function getStats(string $institutionId): array
    {
        $counts = Exam::where('institution_id', $institutionId)
            ->selectRaw("status, count(*) as count")
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'total' => Exam::where('institution_id', $institutionId)->count(),
            'aktif' => $counts['aktif'] ?? 0,
            'terjadwal' => $counts['terjadwal'] ?? 0,
            'draft' => $counts['draft'] ?? 0,
            'selesai' => $counts['selesai'] ?? 0,
        ];
    }
}
