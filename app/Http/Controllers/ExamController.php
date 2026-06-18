<?php

namespace App\Http\Controllers;

use App\Services\ExamService;
use App\Services\CategoryService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $institutionId = $user->institution_id;

        $filters = $request->only(['q', 'status', 'type', 'page']);

        $exams = $this->examService->getPaginatedExams(
            $institutionId,
            $filters,
            $request->query('per_page', 10)
        );

        $categories = $this->categoryService->getCategoriesByInstitution($institutionId);
        $stats = $this->examService->getExamStats($institutionId);

        return Inertia::render('ManajemenUjian/Index', [
            'exams' => $exams,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => (object) $filters,
        ]);
    }

    /**
     * Store a newly created exam in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'type'           => 'required|string|in:Simulasi,Latihan,Resmi',
            'duration'       => 'required|integer|min:1',
            'passing_grade'  => 'nullable|integer|min:0|max:100',
            'category_id'    => 'nullable|string|exists:categories,id',
            'start_time'     => 'nullable|date',
            'end_time'       => 'nullable|date|after_or_equal:start_time',
            'instructions'   => 'nullable|string',
            'settings'       => 'nullable|array',
            'status'         => 'nullable|string|in:draft,aktif,terjadwal,selesai',
        ]);

        $this->examService->createExam($user->institution_id, $user->id, $validated);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dibuat.');
    }

    /**
     * Update the specified exam in storage.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'type'           => 'sometimes|required|string|in:Simulasi,Latihan,Resmi',
            'duration'       => 'sometimes|required|integer|min:1',
            'passing_grade'  => 'nullable|integer|min:0|max:100',
            'category_id'    => 'nullable|string|exists:categories,id',
            'start_time'     => 'nullable|date',
            'end_time'       => 'nullable|date|after_or_equal:start_time',
            'instructions'   => 'nullable|string',
            'settings'       => 'nullable|array',
            'status'         => 'nullable|string|in:draft,aktif,terjadwal,selesai',
        ]);

        $this->examService->updateExam($id, $user->institution_id, $validated);

        return redirect()->route('ujian.show', $id)
            ->with('success', 'Ujian berhasil diperbarui.');
    }

    /**
     * Display the exam detail page with registered participants.
     */
    public function show(Request $request, string $id): Response
    {
        $user    = $request->user();
        $exam    = $this->examService->getExamById($id, $user->institution_id);

        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');

        // Load participant user data from settings.participants (array of user IDs)
        $participantIds = $exam->settings['participants'] ?? [];
        $participants   = [];
        if (!empty($participantIds)) {
            $participants = User::whereIn('id', $participantIds)
                ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status')
                ->get()
                ->toArray();
        }

        // Available participants (peserta role, not yet added)
        $availableQuery = User::where('role', 'peserta')
            ->whereNotIn('id', $participantIds);

        if ($user->role !== 'admin' && $user->role !== 'dev') {
            $availableQuery->where('institution_id', $user->institution_id);
        }

        $available = $availableQuery
            ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik')
            ->orderBy('name')
            ->get()
            ->toArray();

        // Fetch all institution names from database
        $institutions = \App\Models\Institution::orderBy('name')->pluck('name')->toArray();
        $categories = $this->categoryService->getCategoriesByInstitution($user->institution_id);

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
     * Display the exam live monitoring page.
     */
    public function monitor(Request $request, string $id): Response
    {
        $user = $request->user();
        $exam = $this->examService->getExamById($id, $user->institution_id);

        abort_if(!$exam, 404, 'Ujian tidak ditemukan.');

        // Load participant user data from settings.participants (array of user IDs)
        $participantIds = $exam->settings['participants'] ?? [];
        $participants   = [];
        if (!empty($participantIds)) {
            $participants = User::whereIn('id', $participantIds)
                ->select('id', 'name', 'username', 'email', 'instansi', 'nip_nik', 'jabatan', 'status')
                ->get()
                ->toArray();
        }

        // Add mock live monitoring data (remaining time, questions answered, cheat logs, online status)
        foreach ($participants as &$p) {
            $p['is_online'] = (rand(0, 10) > 2); // 80% online
            $p['answered_count'] = rand(5, 45); // answered questions
            $p['sisa_waktu'] = rand(10, $exam->duration);
            $p['violations_count'] = (rand(0, 10) > 8) ? rand(1, 3) : 0; // 20% cheat probability
            $p['violations'] = [];
            if ($p['violations_count'] > 0) {
                $violationTypes = ['Keluar Fullscreen', 'Tab Blur (Buka halaman lain)', 'Copy-paste terdeteksi'];
                for ($i = 0; $i < $p['violations_count']; $i++) {
                    $p['violations'][] = [
                        'time' => date('H:i:s', time() - rand(60, 1800)),
                        'type' => $violationTypes[array_rand($violationTypes)]
                    ];
                }
            }
        }

        return Inertia::render('ManajemenUjian/Monitor', [
            'exam'                  => $exam,
            'participants'          => $participants,
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

        $existing = $exam->settings['participants'] ?? [];
        $updated  = array_values(array_filter($existing, fn($uid) => $uid !== $userId));

        $this->examService->updateExam($id, $user->institution_id, [
            'settings' => ['participants' => $updated],
        ]);

        return redirect()->route('ujian.show', $id)
            ->with('success', 'Peserta berhasil dihapus dari ujian.');
    }

    /**
     * Remove the specified exam from storage.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();

        $this->examService->deleteExam($id, $user->institution_id);

        return redirect()->route('ujian.index')
            ->with('success', 'Ujian berhasil dihapus.');
    }
}
