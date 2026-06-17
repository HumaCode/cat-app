<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAllByInstitution(string $institutionId): Collection
    {
        $query = Category::where('institution_id', $institutionId);

        $user = auth()->user();
        if ($user && $user->role !== 'dev' && $user->username !== 'dev') {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            });
        }

        return $query->withCount('questions')
            ->orderBy('order_column')
            ->get();
    }

    public function findById(string $id): ?Category
    {
        return Category::find($id);
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(string $id, array $data): Category
    {
        $category = Category::findOrFail($id);
        $category->update($data);
        return $category;
    }

    public function delete(string $id): bool
    {
        $category = Category::findOrFail($id);
        return $category->delete();
    }
}
