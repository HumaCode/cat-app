<?php

namespace App\Services;

use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Collection;

class CategoryService
{
    public function __construct(
        protected CategoryRepositoryInterface $categoryRepo
    ) {}

    public function getCategoriesByInstitution(string $institutionId): Collection
    {
        return $this->categoryRepo->getAllByInstitution($institutionId);
    }

    public function createCategory(array $data): \App\Models\Category
    {
        return $this->categoryRepo->create($data);
    }

    public function updateCategory(string $id, array $data): \App\Models\Category
    {
        return $this->categoryRepo->update($id, $data);
    }

    public function deleteCategory(string $id): bool
    {
        return $this->categoryRepo->delete($id);
    }
}
