<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ParticipantController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display the participant management dashboard.
     */
    public function index(Request $request): Response
    {
        \Illuminate\Support\Facades\Gate::authorize('viewAny', User::class);

        $user = $request->user();
        $institutionId = $user->institution_id;

        // Fetch all participants for stats
        if ($user->role === 'dev') {
            $participants = User::where('role', 'peserta')->get();
        } else {
            $participants = $this->userService->getParticipantsByInstitution($institutionId);
        }

        // Compute stats
        $total = $participants->count();
        $aktif = $participants->where('status', 'aktif')->count();
        $nonaktif = $participants->where('status', 'nonaktif')->count();
        $pending = $participants->where('status', 'pending')->count();
        
        // Perlu validasi means missing NIP/NIK, Email, or WhatsApp
        $perluValidasi = $participants->filter(function ($p) {
            return empty($p->nip_nik) || empty($p->email) || empty($p->telepon);
        })->count();

        // Apply filters in PHP/Eloquent (Search, Status, Ujian, Instansi, Sort)
        $query = User::where('role', 'peserta');
        if ($user->role !== 'dev') {
            $query->where('institution_id', $institutionId);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nip_nik', 'like', "%{$search}%")
                  ->orWhere('instansi', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($ujian = $request->query('ujian')) {
            if ($ujian !== 'all') {
                $query->where('exam_data->ujian', $ujian);
            }
        }

        if ($instansi = $request->query('instansi')) {
            if ($instansi !== 'all') {
                $query->where('instansi', $instansi);
            }
        }

        $sort = $request->query('sort', 'newest');
        if ($sort === 'name_asc') {
            $query->orderBy('name', 'asc');
        } elseif ($sort === 'nilai_desc') {
            $query->orderBy('exam_data->nilai', 'desc');
        } elseif ($sort === 'ujian_desc') {
            $query->orderBy('exam_data->ujian_count', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginated = $query->paginate($request->query('per_page', 10))->withQueryString();

        // Get unique exams and departments for filtering
        $allExams = $participants->pluck('exam_data.ujian')->filter()->unique()->values()->all();
        $allInstansi = \App\Models\Institution::orderBy('name')->pluck('name')->toArray();

        return Inertia::render('Peserta/Index', [
            'participants' => $paginated,
            'stats' => [
                'total' => $total,
                'aktif' => $aktif,
                'nonaktif' => $nonaktif,
                'pending' => $pending,
                'perlu_validasi' => $perluValidasi,
            ],
            'exams' => $allExams,
            'departments' => $allInstansi,
            'filters' => (object) $request->only(['status', 'ujian', 'instansi', 'sort', 'search', 'per_page']),
        ]);
    }

    /**
     * Store a new participant.
     */
    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('create', User::class);

        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip_nik' => 'nullable|string|max:50',
            'email' => 'required|email|max:255|unique:users,email',
            'telepon' => 'nullable|string|max:50',
            'instansi' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'ujian' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif,pending',
        ]);

        if ($user->role === 'admin') {
            $validated['instansi'] = $user->institution?->name;
        }

        $validated['institution_id'] = $user->institution_id;
        $validated['username'] = explode('@', $validated['email'])[0];
        $validated['password'] = bcrypt('password'); // Default password

        // Build default exam_data if exam is chosen
        if (!empty($validated['ujian'])) {
            $validated['exam_data'] = [
                'ujian' => $validated['ujian'],
                'attempts' => [false, false, false],
                'ujian_count' => 1,
                'nilai' => null,
                'riwayat' => []
            ];
        } else {
            $validated['exam_data'] = [
                'ujian' => null,
                'attempts' => [false, false, false],
                'ujian_count' => 0,
                'nilai' => null,
                'riwayat' => []
            ];
        }

        $this->userService->createParticipant($validated);

        return redirect()->back()->with('success', 'Peserta berhasil ditambahkan.');
    }

    /**
     * Update an existing participant.
     */
    public function update(Request $request, string $id)
    {
        $participant = User::findOrFail($id);
        \Illuminate\Support\Facades\Gate::authorize('update', $participant);

        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip_nik' => 'nullable|string|max:50',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'telepon' => 'nullable|string|max:50',
            'instansi' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'status' => 'required|in:aktif,nonaktif,pending',
        ]);

        if ($user->role === 'admin') {
            $validated['instansi'] = $user->institution?->name;
        }

        $this->userService->updateParticipant($id, $validated);

        return redirect()->back()->with('success', 'Peserta berhasil diperbarui.');
    }

    /**
     * Delete a participant.
     */
    public function destroy(string $id)
    {
        $participant = User::findOrFail($id);
        \Illuminate\Support\Facades\Gate::authorize('delete', $participant);

        $this->userService->deleteParticipant($id);
        return redirect()->back()->with('success', 'Peserta berhasil dihapus.');
    }

    public function bulkAction(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'action' => 'required|in:delete,status,register',
            'ids' => 'required|array|min:1',
            'status' => 'nullable|in:aktif,nonaktif,pending',
            'ujian' => 'nullable|string|max:255',
            'attempts_limit' => 'nullable|integer|min:1|max:10',
        ]);

        $ids = $validated['ids'];

        if ($user->role !== 'dev') {
            $ids = User::whereIn('id', $ids)
                ->where('role', 'peserta')
                ->where('institution_id', $user->institution_id)
                ->pluck('id')
                ->toArray();
        }

        if (empty($ids)) {
            return redirect()->back()->with('error', 'Tidak ada peserta yang bisa dimodifikasi.');
        }

        if ($validated['action'] === 'delete') {
            $this->userService->bulkDelete($ids);
            $message = count($ids) . ' peserta berhasil dihapus.';
        } elseif ($validated['action'] === 'status') {
            $this->userService->bulkUpdateStatus($ids, $validated['status']);
            $message = 'Status ' . count($ids) . ' peserta berhasil diperbarui.';
        } elseif ($validated['action'] === 'register') {
            $this->userService->bulkRegisterToExam($ids, [
                'ujian' => $validated['ujian'],
                'attempts_limit' => $validated['attempts_limit'] ?? 3,
            ]);
            $message = count($ids) . ' peserta berhasil didaftarkan ke ujian.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Import participants from excel.
     */
    public function import(Request $request)
    {
        \Illuminate\Support\Facades\Gate::authorize('create', User::class);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
            'ujian' => 'required|string|max:255',
        ]);

        // Mocking Excel import processing:
        // In a real application, we would use Maatwebsite/Laravel-Excel or similar.
        // For this prototype, we simulate successful import of 3 mock users.
        $user = $request->user();
        $ujian = $request->input('ujian');
        
        $mockNames = ['Lutfi Hakim', 'Riska Amelia', 'Agus Setiawan'];
        foreach ($mockNames as $idx => $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';
            
            // Avoid duplicate email
            if (!User::where('email', $email)->exists()) {
                User::create([
                    'institution_id' => $user->institution_id,
                    'role' => 'peserta',
                    'name' => $name,
                    'username' => str_replace('.', '', strstr($email, '@', true)),
                    'email' => $email,
                    'password' => bcrypt('password'),
                    'telepon' => '08564000' . rand(1000, 9999),
                    'instansi' => 'BKPSDM',
                    'jabatan' => 'Pelaksana Umum',
                    'nip_nik' => '1995081220220310' . rand(10, 99),
                    'status' => 'aktif',
                    'exam_data' => [
                        'ujian' => $ujian,
                        'attempts' => [false, false, false],
                        'ujian_count' => 1,
                        'nilai' => null,
                        'riwayat' => []
                    ],
                ]);
            }
        }

        return redirect()->back()->with('success', 'Berhasil mengimpor 3 peserta dari file Excel.');
    }
}
