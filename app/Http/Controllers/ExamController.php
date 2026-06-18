<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Services\ExamService;
use App\Services\CategoryService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function __construct(
        protected ExamService $examService,
        protected CategoryService $categoryService
    ) {}

    /**
     * Display the exam management page.
     * institution_id is ALWAYS taken from the authenticated user — never from the URL.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Exam::class);

        $user          = $request->user();
        $institutionId = $user->institution_id; // scoped from auth, not from URL

        $filters = $request->only(['q', 'status', 'type', 'page']);

        $exams = $this->examService->getPaginatedExams(
            $institutionId,
            $filters,
            $request->query('per_page', 10)
        );

        $categories = $this->categoryService->getCategoriesByInstitution($institutionId);
        $stats      = $this->examService->getExamStats($institutionId);

        return Inertia::render('ManajemenUjian/Index', [
            'exams'      => $exams,
            'categories' => $categories,
            'stats'      => $stats,
            'filters'    => (object) $filters,
        ]);
    }

    /**
     * Store a newly created exam in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Exam::class);

        $user = $request->user();

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'type'          => 'required|string|in:Simulasi,Latihan,Resmi',
            'duration'      => 'required|integer|min:1',
            'passing_grade' => 'nullable|integer|min:0|max:100',
            'category_id'   => 'nullable|string|exists:categories,id',
            'start_time'    => 'nullable|date',
            'end_time'      => 'nullable|date|after_or_equal:start_time',
            'instructions'  => 'nullable|string',
            'settings'      => 'nullable|array',
            'status'        => 'nullable|string|in:draft,aktif,terjadwal,selesai',
        ]);

        // institution_id always comes from auth user, never from request payload
        $this->examService->createExam($user->institution_id, $user->id, $validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dibuat.');
    }

    /**
     * Display the exam detail page with registered participants.
     */
    public function show(Request $request, string $id): Response
    {
        $user = $request->user();

        // findById already scopes by institution_id from auth via ExamRepository
        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');

        // Authorize against the resolved exam object (validates institution match)
        Gate::authorize('view', $exam);

        $participantIds = $exam->settings['participants'] ?? [];
        $participants   = [];
        if (!empty($participantIds)) {
            $participants = User::whereIn('id', $participantIds)
                ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status')
                ->get()
                ->toArray();
        }

        // Available participants — scoped to the same institution
        $availableQuery = User::where('role', 'peserta')
            ->whereNotIn('id', $participantIds);

        if ($user->role !== 'dev') {
            $availableQuery->where('institution_id', $user->institution_id);
        }

        $available = $availableQuery
            ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik')
            ->orderBy('name')
            ->get()
            ->toArray();

        $institutions = \App\Models\Institution::orderBy('name')->pluck('name')->toArray();
        $categories   = $this->categoryService->getCategoriesByInstitution($user->institution_id);

        return Inertia::render('ManajemenUjian/Show', [
            'exam'                  => $exam,
            'categories'            => $categories,
            'participants'          => $participants,
            'availableParticipants' => $available,
            'institutions'          => $institutions,
            'flash'                 => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Update the specified exam in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');

        Gate::authorize('update', $exam);

        $validated = $request->validate([
            'title'         => 'sometimes|required|string|max:255',
            'type'          => 'sometimes|required|string|in:Simulasi,Latihan,Resmi',
            'duration'      => 'sometimes|required|integer|min:1',
            'passing_grade' => 'nullable|integer|min:0|max:100',
            'category_id'   => 'nullable|string|exists:categories,id',
            'start_time'    => 'nullable|date',
            'end_time'      => 'nullable|date|after_or_equal:start_time',
            'instructions'  => 'nullable|string',
            'settings'      => 'nullable|array',
            'status'        => 'nullable|string|in:draft,aktif,terjadwal,selesai',
        ]);

        $this->examService->updateExam($id, $user->institution_id, $validated);

        return redirect()->route('ujian.show', $id)
            ->with('success', 'Ujian berhasil diperbarui.');
    }

    /**
     * Remove the specified exam from storage.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');

        Gate::authorize('delete', $exam);

        $this->examService->deleteExam($id, $user->institution_id);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dihapus.');
    }

    /**
     * Display the exam live monitoring page.
     */
    public function monitor(Request $request, string $id): Response
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);

        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');
        Gate::authorize('view', $exam);

        $participantIds = $exam->settings['participants'] ?? [];
        $participants   = [];
        if (!empty($participantIds)) {
            $participants = User::whereIn('id', $participantIds)
                ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status')
                ->get()
                ->toArray();
        }

        foreach ($participants as &$p) {
            $p['is_online']        = (rand(0, 10) > 2);
            $p['answered_count']   = rand(5, 45);
            $p['sisa_waktu']       = rand(10, $exam->duration);
            $p['violations_count'] = (rand(0, 10) > 8) ? rand(1, 3) : 0;
            $p['violations']       = [];
            if ($p['violations_count'] > 0) {
                $violationTypes = ['Keluar Fullscreen', 'Tab Blur (Buka halaman lain)', 'Copy-paste terdeteksi'];
                for ($i = 0; $i < $p['violations_count']; $i++) {
                    $p['violations'][] = [
                        'time' => date('H:i:s', time() - rand(60, 1800)),
                        'type' => $violationTypes[array_rand($violationTypes)],
                    ];
                }
            }
        }

        return Inertia::render('ManajemenUjian/Monitor', [
            'exam'         => $exam,
            'participants' => $participants,
        ]);
    }

    /**
     * Display the detailed exam report page.
     */
    public function report(Request $request, string $id): Response
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);

        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');
        Gate::authorize('view', $exam);

        $participantIds = $exam->settings['participants'] ?? [];
        $participants   = [];
        if (!empty($participantIds)) {
            $participants = User::whereIn('id', $participantIds)
                ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status')
                ->get()
                ->toArray();
        }

        $seksi = $exam->settings['seksi'] ?? [];

        foreach ($participants as &$p) {
            $p['is_present'] = (rand(0, 10) > 1);
            if (!$p['is_present']) {
                $p['total_score']     = 0;
                $p['correct_total']   = 0;
                $p['incorrect_total'] = 0;
                $p['unanswered_total'] = 0;
                $p['seksi_breakdown'] = [];
                $p['passed']          = false;
                continue;
            }

            $correctTotal   = 0;
            $incorrectTotal = 0;
            $unansweredTotal = 0;
            $totalScore     = 0;
            $seksiBreakdown = [];
            $passedSeksiCount = 0;

            foreach ($seksi as $sec) {
                $count      = $sec['soal_count'] ?? 30;
                $correct    = rand(floor($count * 0.4), $count);
                $unanswered = rand(0, floor(($count - $correct) * 0.3));
                $incorrect  = $count - $correct - $unanswered;

                $correctPoints   = $sec['correct_points'] ?? 5;
                $incorrectPoints = $sec['incorrect_points'] ?? 0;
                $score           = ($correct * $correctPoints) - ($incorrect * $incorrectPoints);

                $correctTotal    += $correct;
                $incorrectTotal  += $incorrect;
                $unansweredTotal += $unanswered;
                $totalScore      += $score;

                $passingGrade = $sec['passing_grade'] ?? 0;
                $isPassed     = ($passingGrade == 0 || $score >= $passingGrade);
                if ($isPassed) $passedSeksiCount++;

                $seksiBreakdown[] = [
                    'title'        => $sec['title'],
                    'correct'      => $correct,
                    'incorrect'    => $incorrect,
                    'unanswered'   => $unanswered,
                    'score'        => $score,
                    'passing_grade' => $passingGrade,
                    'passed'       => $isPassed,
                ];
            }

            $p['correct_total']    = $correctTotal;
            $p['incorrect_total']  = $incorrectTotal;
            $p['unanswered_total'] = $unansweredTotal;
            $p['total_score']      = $totalScore;
            $p['seksi_breakdown']  = $seksiBreakdown;

            $examPassingGrade       = $exam->passing_grade ?? 65;
            $hasSeksiPassingGrades  = collect($seksi)->contains(fn($s) => ($s['passing_grade'] ?? 0) > 0);

            if ($hasSeksiPassingGrades) {
                $p['passed'] = ($passedSeksiCount === count($seksi));
            } else {
                $maxPossibleScore = collect($seksi)->sum(fn($s) => ($s['soal_count'] ?? 30) * ($s['correct_points'] ?? 5));
                $pct = $maxPossibleScore > 0 ? ($totalScore / $maxPossibleScore) * 100 : 0;
                $p['passed'] = ($pct >= $examPassingGrade);
            }
        }

        return Inertia::render('ManajemenUjian/Report', [
            'exam'         => $exam,
            'participants' => $participants,
        ]);
    }

    /**
     * Return participants list as JSON (for async search).
     */
    public function pesertaList(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404);

        Gate::authorize('view', $exam);

        $participantIds = $exam->settings['participants'] ?? [];
        $query = User::whereIn('id', $participantIds)
            ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status');

        if ($q = $request->query('q')) {
            $query->where(function ($qb) use ($q) {
                $qb->where('name', 'like', "%{$q}%")
                   ->orWhere('email', 'like', "%{$q}%")
                   ->orWhere('nip_nik', 'like', "%{$q}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Add participants to an exam.
     */
    public function pesertaAdd(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404);

        Gate::authorize('manageParticipants', $exam);

        $request->validate([
            'user_ids'   => 'required|array|min:1',
            'user_ids.*' => 'string|exists:users,id',
        ]);

        $existing = $exam->settings['participants'] ?? [];
        $merged   = array_values(array_unique(array_merge($existing, $request->user_ids)));

        $this->examService->updateExam($id, $user->institution_id, [
            'settings' => ['participants' => $merged],
        ]);

        return redirect()->route('ujian.show', $id)
            ->with('success', count($request->user_ids) . ' peserta berhasil ditambahkan.');
    }

    /**
     * Remove a participant from an exam.
     */
    public function pesertaRemove(Request $request, string $id, string $userId): RedirectResponse
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);
        abort_if(!$exam, 404);

        Gate::authorize('manageParticipants', $exam);

        $existing = $exam->settings['participants'] ?? [];
        $updated  = array_values(array_filter($existing, fn($uid) => $uid !== $userId));

        $this->examService->updateExam($id, $user->institution_id, [
            'settings' => ['participants' => $updated],
        ]);

        return redirect()->route('ujian.show', $id)
            ->with('success', 'Peserta berhasil dihapus dari ujian.');
    }
}
