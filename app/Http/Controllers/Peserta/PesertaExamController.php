<?php

namespace App\Http\Controllers\Peserta;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PesertaExamController extends Controller
{
    // ─── COLORS & TAG METADATA FOR SECTION STYLING ───────────────────────────

    private const SECTION_STYLES = [
        ['tag' => 'twk',   'color' => '#4338CA'],
        ['tag' => 'tiu',   'color' => '#0F766E'],
        ['tag' => 'tkp',   'color' => '#6D28D9'],
        ['tag' => 'extra', 'color' => '#B45309'],
        ['tag' => 'custom','color' => '#BE123C'],
    ];

    // ─── PUBLIC ACTIONS ───────────────────────────────────────────────────────

    /**
     * Display the exam page for a participant.
     * Access is already verified by CanAccessExam middleware.
     */
    public function show(Request $request, string $examId)
    {
        $exam     = Exam::with('institution')->findOrFail($examId);
        $user     = auth()->user();
        $sections = $this->buildSections($exam);

        // Fetch exam_data
        $examData = $user->exam_data ?? [];
        
        $activeProgress = $examData['active_progress'] ?? [];
        
        $savedAnswers = [];
        $savedFlagged = [];
        $startedAt = null;
        
        // If there's active progress for this specific exam, resume it
        if (isset($activeProgress['exam_id']) && $activeProgress['exam_id'] === $exam->id) {
            $savedAnswers = $activeProgress['answers'] ?? [];
            $savedFlagged = $activeProgress['flagged'] ?? [];
            $startedAt = $activeProgress['started_at'] ?? null;
        }
        
        if (!$startedAt) {
            $startedAt = now()->timestamp;
            $activeProgress = [
                'exam_id' => $exam->id,
                'answers' => $savedAnswers,
                'flagged' => $savedFlagged,
                'started_at' => $startedAt,
                'last_saved_at' => now()->timestamp,
            ];
            $examData['active_progress'] = $activeProgress;
            $user->exam_data = $examData;
            $user->save();
        }
        
        $elapsed = now()->timestamp - $startedAt;
        $durationSeconds = $exam->duration * 60;
        $timeLeftSeconds = $durationSeconds - $elapsed;
        
        // If time is already elapsed
        if ($timeLeftSeconds <= 0) {
            return $this->autoSubmitExamFromBackend($user, $exam, $sections, $savedAnswers);
        }

        return Inertia::render('Dashboard/Ujian/Index', [
            'exam'     => $this->formatExam($exam),
            'sections' => $sections,
            'user'     => [
                'id'   => $user->id,
                'name' => $user->name,
            ],
            'savedAnswers' => (object)$savedAnswers,
            'savedFlagged' => (object)$savedFlagged,
            'timeLeftSeconds' => $timeLeftSeconds,
        ]);
    }

    /**
     * Save active progress in real-time.
     */
    public function saveProgress(Request $request, string $examId)
    {
        $exam = Exam::findOrFail($examId);
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $answers = $request->input('answers', []);
        $flagged = $request->input('flagged', []);

        $examData = $user->exam_data;
        if (!is_array($examData)) {
            $examData = [];
        }

        $activeProgress = $examData['active_progress'] ?? [];
        
        $activeProgress['exam_id'] = $exam->id;
        $activeProgress['answers'] = $answers;
        $activeProgress['flagged'] = $flagged;
        $activeProgress['last_saved_at'] = now()->timestamp;
        
        if (!isset($activeProgress['started_at'])) {
            $activeProgress['started_at'] = now()->timestamp;
        }

        $examData['active_progress'] = $activeProgress;
        $user->exam_data = $examData;
        $user->save();

        return response()->json([
            'status' => 'success',
            'last_saved_at' => $activeProgress['last_saved_at'],
        ]);
    }

    /**
     * Accept submitted answers.
     */
    public function submit(Request $request, string $examId)
    {
        $exam = Exam::findOrFail($examId);
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $score = $request->input('score', 0.0);
        $isPassed = (bool) $request->input('is_passed', false);

        $examData = $user->exam_data;
        if (!is_array($examData)) {
            $examData = [];
        }

        if (!isset($examData['riwayat']) || !is_array($examData['riwayat'])) {
            $examData['riwayat'] = [];
        }

        // Add history entry
        $newEntry = [
            'exam_id' => $exam->id,
            'nama'    => $exam->title,
            'tgl'     => now()->format('d M Y'),
            'nilai'   => (float) $score,
            'lulus'   => $isPassed,
        ];

        // Prepended so it shows as the latest attempt
        array_unshift($examData['riwayat'], $newEntry);

        // Update top-level info
        $examData['nilai']       = (float) $score;
        $examData['ujian']       = $exam->title;
        $examData['ujian_count'] = count($examData['riwayat']);

        // Update attempts array if it exists
        if (isset($examData['attempts']) && is_array($examData['attempts'])) {
            for ($i = 0; $i < count($examData['attempts']); $i++) {
                if ($examData['attempts'][$i] === false) {
                    $examData['attempts'][$i] = true;
                    break;
                }
            }
        }

        // Clear active progress upon successful completion
        unset($examData['active_progress']);

        $user->exam_data = $examData;
        $user->save();

        return redirect()->route('dashboard.peserta');
    }

    /**
     * Automatically grade and submit the exam from the backend when time runs out.
     */
    private function autoSubmitExamFromBackend($user, Exam $exam, array $sections, array $savedAnswers)
    {
        $grading = $this->calculateScore($exam, $sections, $savedAnswers);
        $score = $grading['score'];
        $isPassed = $grading['is_passed'];

        $examData = $user->exam_data;
        if (!is_array($examData)) {
            $examData = [];
        }

        if (!isset($examData['riwayat']) || !is_array($examData['riwayat'])) {
            $examData['riwayat'] = [];
        }

        $newEntry = [
            'exam_id' => $exam->id,
            'nama'    => $exam->title,
            'tgl'     => now()->format('d M Y'),
            'nilai'   => (float) $score,
            'lulus'   => $isPassed,
        ];

        array_unshift($examData['riwayat'], $newEntry);

        $examData['nilai']       = (float) $score;
        $examData['ujian']       = $exam->title;
        $examData['ujian_count'] = count($examData['riwayat']);

        if (isset($examData['attempts']) && is_array($examData['attempts'])) {
            for ($i = 0; $i < count($examData['attempts']); $i++) {
                if ($examData['attempts'][$i] === false) {
                    $examData['attempts'][$i] = true;
                    break;
                }
            }
        }

        // Clear active progress
        unset($examData['active_progress']);

        $user->exam_data = $examData;
        $user->save();

        return redirect()->route('dashboard.peserta')->with('warning', 'Waktu ujian telah habis. Jawaban Anda yang tersimpan telah dikumpulkan otomatis.');
    }

    /**
     * Calculate score server-side from saved answers.
     */
    private function calculateScore(Exam $exam, array $sections, array $answersState): array
    {
        $totalQuestions = 0;
        $correctCount = 0;
        $wrongCount = 0;
        $emptyCount = 0;

        foreach ($sections as $sec) {
            $totalQuestions += count($sec['questions']);
            foreach ($sec['questions'] as $q) {
                $qId = $q['id'];
                $answer = $answersState[$qId] ?? null;
                $qType = $q['type'] ?? 'pg';

                if ($answer === null || $answer === '') {
                    $emptyCount++;
                } else {
                    if ($qType === 'isian') {
                        $userAnswerNormalized = strtolower(trim($answer));
                        $correctTexts = $q['correct_answers'] ?? [];
                        if (in_array($userAnswerNormalized, $correctTexts)) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    } else if ($qType === 'jodoh') {
                        $matches = [];
                        foreach (explode(',', $answer) as $pairStr) {
                            $parts = explode(':', $pairStr);
                            if (count($parts) >= 2) {
                                $matches[$parts[0]] = $parts[1];
                            }
                        }

                        $isCorrect = true;
                        foreach ($q['options'] as $opt) {
                            $userPair = $matches[$opt['id']] ?? null;
                            if (!$userPair || strtolower(trim($userPair)) !== strtolower(trim($opt['pair_text'] ?? ''))) {
                                $isCorrect = false;
                                break;
                            }
                        }

                        if ($isCorrect) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    } else if ($qType === 'urutan') {
                        $selectedIds = array_filter(explode(',', $answer));
                        $correctIds = $q['correct_option_ids'] ?? [];
                        $isCorrect = (count($selectedIds) === count($correctIds)) && 
                                     (array_values($selectedIds) === array_values($correctIds));
                        if ($isCorrect) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    } else if ($qType === 'essay') {
                        if (strlen(trim($answer)) > 0) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    } else if ($qType === 'pgk') {
                        $selectedIds = array_filter(explode(',', $answer));
                        sort($selectedIds);
                        $correctIds = $q['correct_option_ids'] ?? [];
                        sort($correctIds);
                        $isCorrect = (count($selectedIds) === count($correctIds)) && 
                                     (array_values($selectedIds) === array_values($correctIds));
                        if ($isCorrect) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    } else {
                        // pg or tf
                        if (isset($q['correct_option_id']) && $answer === $q['correct_option_id']) {
                            $correctCount++;
                        } else {
                            $wrongCount++;
                        }
                    }
                }
            }
        }

        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 1) : 0;
        $passingGrade = (int) ($exam->settings['passing_grade'] ?? 65);
        $isPassed = $score >= $passingGrade;

        return [
            'score' => $score,
            'is_passed' => $isPassed,
        ];
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────

    /**
     * Format exam data for the frontend (omit sensitive fields).
     */
    private function formatExam(Exam $exam): array
    {
        $s = $exam->settings ?? [];

        return [
            'id'          => $exam->id,
            'title'       => $exam->title,
            'type'        => $exam->type,
            'duration'    => (int) ($exam->duration ?? 90),
            'institution' => $exam->institution?->name ?? 'CAT System',
            'settings'    => [
                'passing_grade'      => (int) ($s['passing_grade']      ?? 65),
                'passing_grade_type' => $s['passing_grade_type']        ?? 'total',
                'shuffle_questions'  => (bool) ($s['shuffle_questions'] ?? true),
                'shuffle_options'    => (bool) ($s['shuffle_options']   ?? true),
                'lockdown_mode'      => (bool) ($s['lockdown_mode']     ?? true),
                'activity_logging'   => (bool) ($s['activity_logging']  ?? true),
                'show_results'       => (bool) ($s['show_results']      ?? true),
            ],
        ];
    }

    /**
     * Build sections array with questions fetched from the database.
     * Correct answers are included (needed for client-side scoring).
     */
    private function buildSections(Exam $exam): array
    {
        $settings    = $exam->settings ?? [];
        $seksiList   = $settings['seksi']            ?? [];
        $shuffleQ    = $settings['shuffle_questions'] ?? true;
        $shuffleOpts = $settings['shuffle_options']   ?? true;

        $sections  = [];
        $colorIdx  = 0;

        foreach ($seksiList as $seksi) {
            if (($seksi['status'] ?? 'aktif') !== 'aktif') {
                continue;
            }

            $questions = $this->loadQuestions($seksi, $shuffleQ, $shuffleOpts);
            $style     = self::SECTION_STYLES[$colorIdx % count(self::SECTION_STYLES)];
            $colorIdx++;

            $sections[] = [
                'key'              => $style['tag'] . '_' . $colorIdx,
                'label'            => $seksi['title']           ?? 'Seksi ' . $colorIdx,
                'color'            => $style['color'],
                'tag'              => $style['tag'],
                'soal_count'       => (int) ($seksi['soal_count']       ?? 30),
                'duration'         => (int) ($seksi['duration']         ?? 30),
                'correct_points'   => (int) ($seksi['correct_points']   ?? 5),
                'incorrect_points' => (int) ($seksi['incorrect_points'] ?? 0),
                'passing_grade'    => (int) ($seksi['passing_grade']    ?? 0),
                'questions'        => $questions,
            ];
        }

        return $sections;
    }

    /**
     * Load and format questions for a single seksi from the DB.
     */
    private function loadQuestions(array $seksi, bool $shuffleQ, bool $shuffleOpts): array
    {
        $categoryId      = $seksi['category_id'] ?? null;
        $soalCount       = (int) ($seksi['soal_count']     ?? 30);
        $correctPoints   = (int) ($seksi['correct_points'] ?? 5);

        if (!$categoryId) {
            return [];
        }

        $categoryIds = \App\Models\Category::where(function ($qb) use ($categoryId) {
            $qb->where('parent_id', $categoryId)
               ->orWhere('id', $categoryId);
        })->pluck('id')->toArray();

        $query = Question::with('options')
            ->whereIn('category_id', $categoryIds)
            ->where('is_active', true);

        if ($shuffleQ) {
            $query->inRandomOrder();
        }

        return $query->limit($soalCount)->get()->map(function (Question $q) use ($shuffleOpts, $correctPoints) {
            $options         = $q->options->map(fn($opt) => [
                'id'        => $opt->id,
                'text'      => $opt->option_text,
                'pair_text' => $opt->pair_text,
            ])->toArray();

            if ($q->type === 'urutan') {
                $correctOptionIds = $q->options->sortBy('order_column')->pluck('id')->toArray();
            } else {
                $correctOptionIds = $q->options->filter(fn($opt) => $opt->is_correct)->pluck('id')->toArray();
            }
            $correctOptionId = count($correctOptionIds) > 0 ? $correctOptionIds[0] : null;
            $correctAnswers = $q->options->filter(fn($opt) => $opt->is_correct)->pluck('option_text')->map(fn($t) => strtolower(trim($t)))->toArray();

            if ($shuffleOpts) {
                shuffle($options);
            }

            return [
                'id'                 => $q->id,
                'text'               => $q->question_text,
                'type'               => $q->type ?? 'pg',
                'difficulty'         => ucfirst($q->difficulty ?? 'Sedang'),
                'points'             => $correctPoints,
                'correct_option_id'  => $correctOptionId,
                'correct_option_ids' => $correctOptionIds,
                'correct_answers'    => $correctAnswers,
                'options'            => $options,
                'explanation'        => $q->explanation,
            ];
        })->toArray();
    }

    /**
     * Show the detailed exam review (pembahasan).
     */
    public function pembahasan(Request $request, string $examId): Response
    {
        $exam = Exam::with('institution')->findOrFail($examId);
        /** @var \App\Models\User $user */
        $user = auth()->user();

        // Enforce institution ID matching
        if ($exam->institution_id !== $user->institution_id) {
            abort(403, 'Ujian ini milik institusi lain.');
        }

        // Enforce participant invitation checking
        $participants = $exam->settings['participants'] ?? [];
        if (!is_array($participants) || !in_array($user->id, $participants)) {
            abort(403, 'Anda tidak terdaftar dalam ujian ini.');
        }

        // Build sections
        $sections = $this->buildSections($exam);

        return Inertia::render('Dashboard/Ujian/Pembahasan', [
            'exam'     => $this->formatExam($exam),
            'sections' => $sections,
            'user'     => [
                'id'   => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
}
