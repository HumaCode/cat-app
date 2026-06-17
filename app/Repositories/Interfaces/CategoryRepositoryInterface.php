<?php

namespace App\Repositories\Interfaces;

use App\Models\Category;
use Illuminate\Support\Collection;

interface CategoryRepositoryInterface
{
    public function getAllByInstitution(string $institutionId): Collection;
    public function findById(string $id): ?Category;
    public function create(array $data): Category;
    public function update(string $id, array $data): Category;
    public function delete(string $id): bool;
}
