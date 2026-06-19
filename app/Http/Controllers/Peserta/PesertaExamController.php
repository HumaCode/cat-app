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
    public function show(Request $request, string $examId): Response
    {
        $exam     = Exam::with('institution')->findOrFail($examId);
        $user     = auth()->user();
        $sections = $this->buildSections($exam);

        return Inertia::render('Dashboard/Ujian/Index', [
            'exam'     => $this->formatExam($exam),
            'sections' => $sections,
            'user'     => [
                'id'   => $user->id,
                'name' => $user->name,
            ],
        ]);
    }

    /**
     * Accept submitted answers.
     * Scoring is handled client-side; this endpoint is a future hook
     * for persisting results once an exam_submissions table is added.
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
            'nama'  => $exam->title,
            'tgl'   => now()->format('d M Y'),
            'nilai' => (float) $score,
            'lulus' => $isPassed,
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

        $user->exam_data = $examData;
        $user->save();

        return redirect()->route('dashboard.peserta');
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
            ];
        })->toArray();
    }
}
