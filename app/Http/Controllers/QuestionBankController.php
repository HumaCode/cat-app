<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Services\QuestionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class QuestionBankController extends Controller
{
    public function __construct(
        protected QuestionService $questionService,
        protected CategoryService $categoryService
    ) {}

    /**
     * Display the Question Bank.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $institutionId = $user->institution_id;

        $categories = $this->categoryService->getCategoriesByInstitution($institutionId);
        
        $questions = $this->questionService->getQuestions(
            $institutionId,
            $request->query('category_id'),
            $request->query('type'),
            $request->query('difficulty'),
            $request->query('search'),
            $request->query('per_page', 15)
        );

        // Load media URLs for questions and their options
        $questions->getCollection()->transform(function ($question) {
            $question->image_url = $question->getFirstMediaUrl('media_soal') ?: null;
            $question->options->each(function ($option) {
                $option->image_url = $option->getFirstMediaUrl('media_opsi') ?: null;
            });
            return $question;
        });

        $stats = $this->questionService->getQuestionStats($institutionId);

        return Inertia::render('BankSoal/Index', [
            'categories' => $categories,
            'questions' => $questions,
            'stats' => $stats,
            'filters' => $request->only(['category_id', 'type', 'difficulty', 'search', 'per_page']),
        ]);
    }

    /**
     * Store a new question.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|string|in:pg,pgk,essay,tf,isian,jodoh,urutan',
            'difficulty' => 'required|string|in:Mudah,Sedang,Sulit',
            'points' => 'required|integer|min:0|max:100',
            'bloom_level' => 'nullable|string',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'is_active' => 'boolean',
            'options' => 'nullable|array',
            'options.*.option_text' => 'nullable|string',
            'options.*.is_correct' => 'boolean',
            'options.*.order_column' => 'integer',
            'options.*.pair_text' => 'nullable|string',
            'question_image' => 'nullable|image|max:2048',
        ];

        // Add dynamic rules for option_image_*
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'option_image_')) {
                $rules[$key] = 'nullable|image|max:2048';
            }
        }

        $validated = $request->validate($rules);
        $validated['institution_id'] = $user->institution_id;
        $validated['user_id'] = $user->id;

        // Put files directly back in the validated array since they are removed from rules if not explicitly verified
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'option_image_') && $request->hasFile($key)) {
                $validated[$key] = $request->file($key);
            }
        }
        if ($request->hasFile('question_image')) {
            $validated['question_image'] = $request->file('question_image');
        }

        $this->questionService->createQuestion($validated);

        return redirect()->back()->with('success', 'Soal berhasil disimpan.');
    }

    /**
     * Update a question.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();

        // Ownership guard — non-dev users may only edit their own questions
        $question = \App\Models\Question::findOrFail($id);
        if ($user->role !== 'dev' && $user->username !== 'dev') {
            if ($question->user_id !== null && $question->user_id !== $user->id) {
                abort(403, 'Anda tidak memiliki izin untuk mengedit soal ini.');
            }
        }

        // Handle method spoofing if client sent a POST with _method=PUT
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|string|in:pg,pgk,essay,tf,isian,jodoh,urutan',
            'difficulty' => 'required|string|in:Mudah,Sedang,Sulit',
            'points' => 'required|integer|min:0|max:100',
            'bloom_level' => 'nullable|string',
            'question_text' => 'required|string',
            'explanation' => 'nullable|string',
            'is_active' => 'boolean',
            'options' => 'nullable|array',
            'options.*.id' => 'nullable|string',
            'options.*.option_text' => 'nullable|string',
            'options.*.is_correct' => 'boolean',
            'options.*.order_column' => 'integer',
            'options.*.pair_text' => 'nullable|string',
            'question_image' => 'nullable|image|max:2048',
            'clear_question_image' => 'nullable|boolean',
        ];

        // Add dynamic rules for option_image_* and clear_option_image_*
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'option_image_')) {
                $rules[$key] = 'nullable|image|max:2048';
            } elseif (str_starts_with($key, 'clear_option_image_')) {
                $rules[$key] = 'nullable|boolean';
            }
        }

        $validated = $request->validate($rules);
        $validated['update_options'] = true;

        // Ensure files and clear requests are preserved
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'option_image_') && $request->hasFile($key)) {
                $validated[$key] = $request->file($key);
            } elseif (str_starts_with($key, 'clear_option_image_')) {
                $validated[$key] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
        }
        if ($request->hasFile('question_image')) {
            $validated['question_image'] = $request->file('question_image');
        }
        if ($request->has('clear_question_image')) {
            $validated['clear_question_image'] = filter_var($request->input('clear_question_image'), FILTER_VALIDATE_BOOLEAN);
        }

        $this->questionService->updateQuestion($id, $validated);

        return redirect()->back()->with('success', 'Soal berhasil diperbarui.');
    }

    /**
     * Delete a question.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $question = \App\Models\Question::findOrFail($id);

        if ($user->role !== 'dev' && $user->username !== 'dev') {
            if ($question->user_id !== null && $question->user_id !== $user->id) {
                abort(403, 'Anda tidak memiliki izin untuk menghapus soal ini.');
            }
        }

        $this->questionService->deleteQuestion($id);
        return redirect()->back()->with('success', 'Soal berhasil dihapus.');
    }

    /**
     * Store a new category.
     */
    public function storeCategory(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('create', \App\Models\Category::class);

        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'icon' => 'nullable|string',
        ]);

        $validated['institution_id'] = $user->institution_id;
        $validated['user_id'] = $user->id;
        $validated['slug'] = Str::slug($validated['name']);

        $this->categoryService->createCategory($validated);

        return redirect()->back()->with('success', 'Kategori berhasil disimpan.');
    }

    /**
     * Handle bulk actions on questions.
     */
    public function bulkAction(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|exists:questions,id',
            'action' => 'required|string|in:active,draft,delete',
        ]);

        $ids = $validated['ids'];

        // Non-dev users can only act on their own questions
        if ($user->role !== 'dev' && $user->username !== 'dev') {
            $ids = \App\Models\Question::whereIn('id', $ids)
                ->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)->orWhereNull('user_id');
                })
                ->pluck('id')
                ->toArray();
        }

        if (empty($ids)) {
            return redirect()->back()->with('error', 'Tidak ada soal yang bisa dimodifikasi.');
        }

        if ($validated['action'] === 'active') {
            \App\Models\Question::whereIn('id', $ids)->update(['is_active' => true]);
        } elseif ($validated['action'] === 'draft') {
            \App\Models\Question::whereIn('id', $ids)->update(['is_active' => false]);
        } elseif ($validated['action'] === 'delete') {
            \App\Models\Question::whereIn('id', $ids)->delete();
        }

        return redirect()->back()->with('success', 'Aksi massal berhasil diterapkan.');
    }
}
