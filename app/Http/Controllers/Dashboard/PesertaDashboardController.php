<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PesertaDashboardController extends Controller
{
    /**
     * Display the peserta dashboard.
     * Only accessible by users with role 'peserta'.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Stats — in a real app these come from DB queries
        $stats = $this->buildStats($user);

        // Ongoing exam (if any) — in real app: query exam_sessions
        $ongoingExam = $this->getOngoingExam($user);

        // Available exams scoped to the user's institution
        $availableExams = $this->getAvailableExams($user);

        // Upcoming schedule
        $schedule = $this->getUpcomingSchedule($user);

        // Score breakdown per category
        $categoryScores = $this->getCategoryScores($user);

        // Achievements
        $achievements = $this->getAchievements($user);

        // Exam history (last 5)
        $history = $this->getExamHistory($user);

        return Inertia::render('Dashboard/Peserta/Index', [
            'user'           => $user->only('id', 'name', 'email', 'instansi', 'jabatan'),
            'stats'          => $stats,
            'ongoingExam'    => $ongoingExam,
            'availableExams' => $availableExams,
            'schedule'       => $schedule,
            'categoryScores' => $categoryScores,
            'achievements'   => $achievements,
            'history'        => $history,
        ]);
    }

    // ──────────────────────────────────────────────────────────────
    // Private helpers (stub data — replace with real DB queries later)
    // ──────────────────────────────────────────────────────────────

    private function buildStats($user): array
    {
        return [
            'total_selesai'  => 12,
            'total_lulus'    => 9,
            'skor_tertinggi' => 97.5,
            'ranking'        => '#1',
            'avg_score'      => 74.2,
        ];
    }

    private function getOngoingExam($user): ?array
    {
        // Stub — replace with: ExamSession::where('user_id', $user->id)->where('status','ongoing')->first()
        return [
            'id'           => 'exam-ongoing-001',
            'title'        => 'SKD CPNS 2025 — Paket A',
            'type'         => 'Official',
            'duration'     => 90,
            'passing_grade' => 65,
            'total_soal'   => 110,
            'answered'     => 42,
            'progress_pct' => 38,
            'sisa_waktu_s' => 5027,
            'current_seksi'=> 'TWK',
            'current_soal' => 21,
            'tags'         => ['TWK', 'TIU', 'TKP', 'Acak'],
            'color'        => '#BE123C',
            'badge_bg'     => 'rgba(190,18,60,0.1)',
            'badge_color'  => '#BE123C',
        ];
    }

    private function getAvailableExams($user): array
    {
        return [
            [
                'id'            => 'exam-001',
                'title'         => 'TKD PPPK Guru — Paket Latihan B',
                'type'          => 'Simulasi',
                'difficulty'    => '🟡 Mudah',
                'total_soal'    => 60,
                'duration'      => 60,
                'passing_grade' => 70,
                'has_pembahasan'=> true,
                'max_attempts'  => 3,
                'tags'          => ['Kompetensi Teknis', 'Pedagogik'],
                'color'         => '#4338CA',
                'badge_bg'      => 'rgba(67,56,202,0.1)',
                'badge_color'   => '#4338CA',
            ],
            [
                'id'            => 'exam-002',
                'title'         => 'Simulasi TWK — Wawasan Kebangsaan Lanjutan',
                'type'          => 'Latihan',
                'difficulty'    => '🔴 Sulit',
                'total_soal'    => 80,
                'duration'      => 75,
                'passing_grade' => 75,
                'has_pembahasan'=> false,
                'max_attempts'  => null,
                'tags'          => ['Pancasila', 'UUD 1945', 'NKRI'],
                'color'         => '#0F766E',
                'badge_bg'      => 'rgba(15,118,110,0.1)',
                'badge_color'   => '#0F766E',
            ],
        ];
    }

    private function getUpcomingSchedule($user): array
    {
        return [
            ['day' => '20', 'month' => 'Jun', 'title' => 'SKD CPNS Paket B',      'time' => '08:00 — 09:30 WIB', 'badge' => '2 hari lagi', 'badge_type' => 'soon'],
            ['day' => '25', 'month' => 'Jun', 'title' => 'TIU — Verbal & Numerik','time' => '10:00 — 11:00 WIB', 'badge' => '7 hari',     'badge_type' => 'upcoming'],
            ['day' => '30', 'month' => 'Jun', 'title' => 'TKP Final Assessment',  'time' => '13:00 — 14:30 WIB', 'badge' => '12 hari',    'badge_type' => 'upcoming'],
        ];
    }

    private function getCategoryScores($user): array
    {
        return [
            ['label' => 'TWK',     'value' => 82, 'max' => 100, 'gradient' => 'linear-gradient(90deg,#4338CA,#818CF8)'],
            ['label' => 'TIU',     'value' => 78, 'max' => 100, 'gradient' => 'linear-gradient(90deg,#0F766E,#2DD4BF)'],
            ['label' => 'TKP',     'value' => 91, 'max' => 100, 'gradient' => 'linear-gradient(90deg,#047857,#34D399)'],
            ['label' => 'Verbal',  'value' => 70, 'max' => 100, 'gradient' => 'linear-gradient(90deg,#B45309,#FCD34D)'],
            ['label' => 'Numerik', 'value' => 85, 'max' => 100, 'gradient' => 'linear-gradient(90deg,#5B21B6,#A78BFA)'],
        ];
    }

    private function getAchievements($user): array
    {
        return [
            ['emoji' => '🥇', 'label' => 'Ranking #1',    'locked' => false],
            ['emoji' => '🔥', 'label' => 'Streak 7 Hari', 'locked' => false],
            ['emoji' => '💯', 'label' => 'Skor Sempurna', 'locked' => false],
            ['emoji' => '⚡', 'label' => 'Fastest Finish','locked' => false],
            ['emoji' => '🎯', 'label' => '10 Lulus',      'locked' => false],
            ['emoji' => '👑', 'label' => 'Juara Umum',    'locked' => true],
            ['emoji' => '🌟', 'label' => '50 Ujian',      'locked' => true],
            ['emoji' => '🚀', 'label' => 'Nilai 100',     'locked' => true],
        ];
    }

    private function getExamHistory($user): array
    {
        return [
            ['title' => 'Simulasi SKD CPNS — Paket X', 'date' => '14 Jun 2025', 'score' => 97.5, 'score_class' => 'high', 'rank' => '🥇 #1',  'rank_class' => 'top', 'duration' => '72 menit', 'status' => 'Lulus',           'status_class' => 'lulus'],
            ['title' => 'TKD PPPK Guru Batch 1',       'date' => '10 Jun 2025', 'score' => 89.0, 'score_class' => 'high', 'rank' => '🥈 #2',  'rank_class' => 'top', 'duration' => '58 menit', 'status' => 'Lulus',           'status_class' => 'lulus'],
            ['title' => 'TWK Latihan — Kebangsaan',    'date' => '07 Jun 2025', 'score' => 76.5, 'score_class' => 'mid',  'rank' => '#5',      'rank_class' => '',    'duration' => '65 menit', 'status' => 'Lulus',           'status_class' => 'lulus'],
            ['title' => 'TIU — Verbal & Numerik Sprint','date' => '03 Jun 2025', 'score' => 58.0, 'score_class' => 'low',  'rank' => '#18',     'rank_class' => '',    'duration' => '60 menit', 'status' => 'Tidak Lulus',     'status_class' => 'gagal'],
            ['title' => 'Essay Kompetensi Teknis IT',  'date' => '01 Jun 2025', 'score' => null, 'score_class' => 'mid',  'rank' => '—',       'rank_class' => '',    'duration' => '50 menit', 'status' => 'Menunggu Nilai',  'status_class' => 'pending'],
        ];
    }
}
