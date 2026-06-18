<?php

namespace App\Repositories;

use App\Models\Question;
use App\Models\QuestionOption;
use App\Repositories\Interfaces\QuestionRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class QuestionRepository implements QuestionRepositoryInterface
{
    /**
     * Apply ownership scope: non-dev users only see their own questions (or seedded questions with null user_id).
     */
    private function applyOwnerScope($query)
    {
        $user = auth()->user();
        if ($user && $user->role !== 'dev' && $user->username !== 'dev') {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            });
        }
        return $query;
    }

    public function getPaginatedByInstitution(
        string $institutionId,
        ?string $categoryId = null,
        ?string $type = null,
        ?string $difficulty = null,
        ?string $search = null,
        int $perPage = 15
    ): LengthAwarePaginator {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::query()->with(['category', 'options']);
        } else {
            $query = Question::where('institution_id', $institutionId)
                ->with(['category', 'options']);
            $this->applyOwnerScope($query);
        }

        if ($categoryId && $categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }

        if ($type && $type !== 'Semua') {
            if ($type === 'pg') {
                $query->where('type', 'pg');
            } elseif ($type === 'essay') {
                $query->where('type', 'essay');
            } elseif ($type === 'lainnya') {
                $query->whereNotIn('type', ['pg', 'essay']);
            } else {
                $query->where('type', $type);
            }
        }

        if ($difficulty && $difficulty !== 'Semua level') {
            $query->where('difficulty', $difficulty);
        }

        if ($search) {
            $query->where('question_text', 'like', '%' . $search . '%');
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getAllByInstitution(string $institutionId): Collection
    {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::query();
        } else {
            $query = Question::where('institution_id', $institutionId);
        }
        return $query->with(['category', 'options'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(string $id): ?Question
    {
        return Question::with(['category', 'options'])->find($id);
    }

    public function create(array $data): Question
    {
        return DB::transaction(function () use ($data) {
            $options = $data['options'] ?? [];
            unset($data['options']);

            $questionImage = $data['question_image'] ?? null;
            unset($data['question_image']);

            $optionImages = [];
            foreach ($data as $key => $value) {
                if (str_starts_with($key, 'option_image_')) {
                    $idx = (int) str_replace('option_image_', '', $key);
                    $optionImages[$idx] = $value;
                    unset($data[$key]);
                }
            }

            $question = Question::create($data);

            if ($questionImage instanceof \Illuminate\Http\UploadedFile) {
                $question->addMedia($questionImage)->toMediaCollection('media_soal');
            }

            foreach ($options as $index => $opt) {
                $option = $question->options()->create([
                    'option_text' => $opt['option_text'] ?? null,
                    'is_correct' => $opt['is_correct'] ?? false,
                    'order_column' => $opt['order_column'] ?? $index,
                    'pair_text' => $opt['pair_text'] ?? null,
                ]);

                if (isset($optionImages[$index]) && $optionImages[$index] instanceof \Illuminate\Http\UploadedFile) {
                    $option->addMedia($optionImages[$index])->toMediaCollection('media_opsi');
                }
            }

            return $question;
        });
    }

    public function update(string $id, array $data): Question
    {
        return DB::transaction(function () use ($id, $data) {
            $question = Question::findOrFail($id);
            
            $options = $data['options'] ?? [];
            unset($data['options']);

            $questionImage = $data['question_image'] ?? null;
            unset($data['question_image']);

            $clearQuestionImage = $data['clear_question_image'] ?? false;
            unset($data['clear_question_image']);

            $optionImages = [];
            $clearOptionImages = [];
            foreach ($data as $key => $value) {
                if (str_starts_with($key, 'option_image_')) {
                    $idx = (int) str_replace('option_image_', '', $key);
                    $optionImages[$idx] = $value;
                    unset($data[$key]);
                } elseif (str_starts_with($key, 'clear_option_image_')) {
                    $idx = (int) str_replace('clear_option_image_', '', $key);
                    $clearOptionImages[$idx] = $value;
                    unset($data[$key]);
                }
            }

            $question->update($data);

            if ($clearQuestionImage) {
                $question->clearMediaCollection('media_soal');
            }

            if ($questionImage instanceof \Illuminate\Http\UploadedFile) {
                $question->addMedia($questionImage)->toMediaCollection('media_soal');
            }

            if (isset($data['update_options']) && $data['update_options']) {
                $existingOptions = $question->options;
                $newOptionIds = collect($options)->pluck('id')->filter()->toArray();

                // Delete options that are not in the new payload
                foreach ($existingOptions as $opt) {
                    if (!in_array($opt->id, $newOptionIds)) {
                        $opt->delete();
                    }
                }

                // Update or Create options
                foreach ($options as $index => $opt) {
                    $optionId = $opt['id'] ?? null;
                    
                    $optionData = [
                        'option_text' => $opt['option_text'] ?? null,
                        'is_correct' => $opt['is_correct'] ?? false,
                        'order_column' => $opt['order_column'] ?? $index,
                        'pair_text' => $opt['pair_text'] ?? null,
                    ];

                    if ($optionId) {
                        $option = QuestionOption::where('question_id', $question->id)->where('id', $optionId)->first();
                        if ($option) {
                            $option->update($optionData);
                        } else {
                            $option = $question->options()->create($optionData);
                        }
                    } else {
                        $option = $question->options()->create($optionData);
                    }

                    // Handle media for this option
                    if (!empty($clearOptionImages[$index])) {
                        $option->clearMediaCollection('media_opsi');
                    }

                    if (isset($optionImages[$index]) && $optionImages[$index] instanceof \Illuminate\Http\UploadedFile) {
                        $option->addMedia($optionImages[$index])->toMediaCollection('media_opsi');
                    }
                }
            }

            return $question;
        });
    }

    public function delete(string $id): bool
    {
        $question = Question::findOrFail($id);
        return $question->delete();
    }

    public function countByInstitution(string $institutionId): int
    {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::where('is_active', true);
        } else {
            $query = Question::where('institution_id', $institutionId)->where('is_active', true);
            $this->applyOwnerScope($query);
        }
        return $query->count();
    }

    public function countDraftsByInstitution(string $institutionId): int
    {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::where('is_active', false);
        } else {
            $query = Question::where('institution_id', $institutionId)->where('is_active', false);
            $this->applyOwnerScope($query);
        }
        return $query->count();
    }

    public function countByType(string $institutionId, string $type): int
    {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::where('type', $type);
        } else {
            $query = Question::where('institution_id', $institutionId)->where('type', $type);
            $this->applyOwnerScope($query);
        }
        return $query->count();
    }

    public function countOtherTypes(string $institutionId, array $types): int
    {
        $user = auth()->user();
        if ($user && ($user->role === 'dev' || $user->username === 'dev')) {
            $query = Question::whereNotIn('type', $types);
        } else {
            $query = Question::where('institution_id', $institutionId)->whereNotIn('type', $types);
            $this->applyOwnerScope($query);
        }
        return $query->count();
    }
}
