<?php

namespace App\Repositories;

use App\Models\Exam;
use App\Repositories\Interfaces\ExamRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ExamRepository implements ExamRepositoryInterface
{
    /**
     * Resolve the effective institution_id based on authenticated user role.
     *
     * - dev: passes the provided $institutionId as-is (may be null for dev, query runs global)
     * - admin: ALWAYS uses auth()->user()->institution_id regardless of what was passed.
     *
     * This prevents URL injection like ?institution_id=other-org from taking effect.
     */
    private function resolveInstitutionId(string $institutionId): string
    {
        $user = auth()->user();

        // admin is always scoped to their own institution, no matter what $institutionId says
        if ($user && $user->role !== 'dev') {
            return $user->institution_id;
        }

        return $institutionId;
    }

    public function getPaginated(string $institutionId, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $user = auth()->user();

        // dev sees all institutions; admin is scoped to their own
        if ($user && $user->role === 'dev') {
            $query = Exam::query();
        } else {
            $safeInstitutionId = $this->resolveInstitutionId($institutionId);
            $query = Exam::where('institution_id', $safeInstitutionId);
        }

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
        $user = auth()->user();

        if ($user && $user->role === 'dev') {
            return Exam::orderBy('created_at', 'desc')->get();
        }

        $safeInstitutionId = $this->resolveInstitutionId($institutionId);

        return Exam::where('institution_id', $safeInstitutionId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id, string $institutionId): ?Exam
    {
        $user = auth()->user();

        if ($user && $user->role === 'dev') {
            return Exam::find($id);
        }

        $safeInstitutionId = $this->resolveInstitutionId($institutionId);

        return Exam::where('institution_id', $safeInstitutionId)->find($id);
    }

    public function create(array $data): Exam
    {
        return Exam::create($data);
    }

    public function update(string $id, string $institutionId, array $data): Exam
    {
        $user = auth()->user();

        if ($user && $user->role === 'dev') {
            $exam = Exam::findOrFail($id);
        } else {
            $safeInstitutionId = $this->resolveInstitutionId($institutionId);
            $exam = Exam::where('institution_id', $safeInstitutionId)->findOrFail($id);
        }

        $exam->update($data);
        return $exam;
    }

    public function delete(string $id, string $institutionId): bool
    {
        $user = auth()->user();

        if ($user && $user->role === 'dev') {
            $exam = Exam::findOrFail($id);
        } else {
            $safeInstitutionId = $this->resolveInstitutionId($institutionId);
            $exam = Exam::where('institution_id', $safeInstitutionId)->findOrFail($id);
        }

        return $exam->delete();
    }

    public function getStats(string $institutionId): array
    {
        $user = auth()->user();

        if ($user && $user->role === 'dev') {
            $base = Exam::query();
        } else {
            $safeInstitutionId = $this->resolveInstitutionId($institutionId);
            $base = Exam::where('institution_id', $safeInstitutionId);
        }

        $counts = (clone $base)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return [
            'total'      => (clone $base)->count(),
            'aktif'      => $counts['aktif']      ?? 0,
            'terjadwal'  => $counts['terjadwal']  ?? 0,
            'draft'      => $counts['draft']      ?? 0,
            'selesai'    => $counts['selesai']    ?? 0,
        ];
    }
}
