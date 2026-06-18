<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Display the Category management page.
     */
    public function index(Request $request): Response
    {
        \Illuminate\Support\Facades\Gate::authorize('viewAny', \App\Models\Category::class);

        $user = $request->user();
        $categories = $this->categoryService->getCategoriesByInstitution($user->institution_id);

        return Inertia::render('Kategori/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new category.
     */
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('create', \App\Models\Category::class);

        $user = $request->user();

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'icon'      => 'nullable|string|max:100',
        ]);

        $validated['institution_id'] = $user->institution_id;
        $validated['user_id']        = $user->id;
        $validated['slug']           = Str::slug($validated['name']);

        $this->categoryService->createCategory($validated);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, string $id)
    {
        $category = \App\Models\Category::findOrFail($id);

        \Illuminate\Support\Facades\Gate::authorize('update', $category);

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'icon'      => 'nullable|string|max:100',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $this->categoryService->updateCategory($id, $validated);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Delete a category.
     */
    public function destroy(Request $request, string $id)
    {
        $category = \App\Models\Category::findOrFail($id);

        \Illuminate\Support\Facades\Gate::authorize('delete', $category);

        // Prevent delete if category has questions
        if ($category->questions()->count() > 0) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki soal.');
        }

        $this->categoryService->deleteCategory($id);

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
