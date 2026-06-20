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

        // Get exams where the user is registered as a participant (in settings->participants)
        $registeredExams = \App\Models\Exam::with('category')
            ->where('institution_id', $user->institution_id)
            ->whereJsonContains('settings->participants', $user->id)
            ->get();

        $isRegistered = $registeredExams->isNotEmpty();

        // Stats — in a real app these come from DB queries
        $stats = $this->buildStats($user);

        // Ongoing exam (if any)
        $ongoingExam = $isRegistered ? $this->getOngoingExam($user, $registeredExams) : null;

        // Available exams
        $availableExams = $isRegistered ? $this->getAvailableExams($user, $registeredExams) : [];

        // Upcoming schedule
        $schedule = $isRegistered ? $this->getUpcomingSchedule($user, $registeredExams) : [];

        // Score breakdown per category
        $categoryScores = $this->getCategoryScores($user, $registeredExams);

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
            'isRegistered'   => $isRegistered,
        ]);
    }

    // ──────────────────────────────────────────────────────────────
    // Private helpers
    // ──────────────────────────────────────────────────────────────

    private function buildStats($user): array
    {
        $riwayat = is_array($user->exam_data) && isset($user->exam_data['riwayat']) ? $user->exam_data['riwayat'] : [];
        
        $lastScore = 0.0;
        if (!empty($riwayat)) {
            $lastScore = floatval($riwayat[0]['nilai'] ?? 0.0);
        }

        $nilaiArray = collect($riwayat)->pluck('nilai')->filter();

        return [
            'total_selesai'  => count($riwayat),
            'total_lulus'    => collect($riwayat)->where('lulus', true)->count(),
            'skor_tertinggi' => $nilaiArray->isNotEmpty() ? $nilaiArray->max() : 0.0,
            'ranking'        => count($riwayat) > 0 ? '#1' : '—',
            'avg_score'      => $lastScore,
        ];
    }

    private function getOngoingExam($user, $registeredExams): ?array
    {
        $riwayat = is_array($user->exam_data) && isset($user->exam_data['riwayat']) ? $user->exam_data['riwayat'] : [];

        // Find the first registered exam that has status 'aktif' and has not reached attempt limit
        $exam = $registeredExams->first(function($e) use ($riwayat) {
            if ($e->status !== 'aktif') {
                return false;
            }
            $attemptsLimit = $e->settings['attempts_limit'] ?? null;
            if ($attemptsLimit !== null && $attemptsLimit > 0) {
                $attemptsCount = collect($riwayat)->where('nama', $e->title)->count();
                if ($attemptsCount >= $attemptsLimit) {
                    return false;
                }
            }
            return true;
        });

        if (!$exam) {
            return null;
        }

        $type = $exam->type ?? 'Latihan';
        
        // Choose styles based on exam type
        if ($type === 'Resmi' || $type === 'Official') {
            $color = '#BE123C';
            $badgeBg = 'rgba(190,18,60,0.1)';
            $badgeColor = '#BE123C';
        } elseif ($type === 'Simulasi') {
            $color = '#4338CA';
            $badgeBg = 'rgba(67,56,202,0.1)';
            $badgeColor = '#4338CA';
        } else {
            $color = '#0F766E';
            $badgeBg = 'rgba(15,118,110,0.1)';
            $badgeColor = '#0F766E';
        }

        // Sum up total questions
        $totalSoal = 0;
        if (is_array($exam->settings) && isset($exam->settings['seksi'])) {
            foreach ($exam->settings['seksi'] as $seksi) {
                $totalSoal += $seksi['soal_count'] ?? 0;
            }
        }
        if ($totalSoal === 0) {
            $totalSoal = 100;
        }

        $tags = [];
        if ($exam->category) {
            $tags[] = $exam->category->name;
        } else {
            $tags = ['TWK', 'TIU', 'TKP', 'Acak'];
        }

        return [
            'id'           => $exam->id,
            'title'        => $exam->title,
            'type'         => $type,
            'duration'     => $exam->duration,
            'passing_grade' => $exam->passing_grade,
            'total_soal'   => $totalSoal,
            'answered'     => 0,
            'progress_pct' => 0,
            'sisa_waktu_s' => $exam->duration * 60,
            'current_seksi'=> 'TWK',
            'current_soal' => 1,
            'tags'         => $tags,
            'color'        => $color,
            'badge_bg'     => $badgeBg,
            'badge_color'  => $badgeColor,
        ];
    }

    private function getAvailableExams($user, $registeredExams): array
    {
        $riwayat = is_array($user->exam_data) && isset($user->exam_data['riwayat']) ? $user->exam_data['riwayat'] : [];

        // Filter registered exams to those that are active
        $exams = $registeredExams->filter(fn($e) => $e->status === 'aktif');

        // Filter out exams that have reached their attempts limit
        $exams = $exams->filter(function ($exam) use ($riwayat) {
            $attemptsLimit = $exam->settings['attempts_limit'] ?? null;
            if ($attemptsLimit !== null && $attemptsLimit > 0) {
                $attemptsCount = collect($riwayat)->where('nama', $exam->title)->count();
                if ($attemptsCount >= $attemptsLimit) {
                    return false;
                }
            }
            return true;
        });

        return $exams->map(function ($exam) {
            $type = $exam->type ?? 'Latihan';
            
            // Choose styles based on exam type
            if ($type === 'Resmi' || $type === 'Official') {
                $color = '#BE123C';
                $badgeBg = 'rgba(190,18,60,0.1)';
                $badgeColor = '#BE123C';
            } elseif ($type === 'Simulasi') {
                $color = '#4338CA';
                $badgeBg = 'rgba(67,56,202,0.1)';
                $badgeColor = '#4338CA';
            } else {
                $color = '#0F766E';
                $badgeBg = 'rgba(15,118,110,0.1)';
                $badgeColor = '#0F766E';
            }

            // Difficulty label based on passing grade
            if ($exam->passing_grade >= 75) {
                $difficulty = '🔴 Sulit';
            } elseif ($exam->passing_grade <= 60) {
                $difficulty = '🟢 Mudah';
            } else {
                $difficulty = '🟡 Sedang';
            }

            // Sum up total questions from settings['seksi'] if exists, otherwise fallback to 100
            $totalSoal = 0;
            if (is_array($exam->settings) && isset($exam->settings['seksi'])) {
                foreach ($exam->settings['seksi'] as $seksi) {
                    $totalSoal += $seksi['soal_count'] ?? 0;
                }
            }
            if ($totalSoal === 0) {
                $totalSoal = 100;
            }

            // Tags
            $tags = [];
            if ($exam->category) {
                $tags[] = $exam->category->name;
            } else {
                $tags = ['Kompetensi Teknis', 'Latihan'];
            }

            return [
                'id'            => $exam->id,
                'title'         => $exam->title,
                'type'          => $type,
                'difficulty'    => $difficulty,
                'total_soal'    => $totalSoal,
                'duration'      => $exam->duration,
                'passing_grade' => $exam->passing_grade,
                'has_pembahasan'=> $exam->settings['show_answers'] ?? true,
                'max_attempts'  => $exam->settings['attempts_limit'] ?? null,
                'tags'          => $tags,
                'color'         => $color,
                'badge_bg'      => $badgeBg,
                'badge_color'   => $badgeColor,
            ];
        })->values()->toArray();
    }

    private function getUpcomingSchedule($user, $registeredExams): array
    {
        $scheduled = $registeredExams->filter(fn($e) => $e->status === 'terjadwal');

        return $scheduled->map(function ($exam) {
            $startTime = $exam->start_time; // Carbon/DateTime object since it's cast as datetime
            
            $day = '1';
            $month = 'Jun';
            $timeLabel = '08:00 — 09:30 WIB';
            $daysLeft = 'Segera';

            if ($startTime) {
                $day = $startTime->format('d');
                $month = $startTime->format('M');
                
                $endTime = $exam->end_time;
                $timeLabel = $startTime->format('H:i') . ($endTime ? ' — ' . $endTime->format('H:i') : '') . ' WIB';
                
                $diff = now()->diffInDays($startTime, false);
                if ($diff <= 0) {
                    $daysLeft = 'Hari ini';
                } else {
                    $daysLeft = $diff . ' hari lagi';
                }
            }

            return [
                'day' => $day,
                'month' => $month,
                'title' => $exam->title,
                'time' => $timeLabel,
                'badge' => $daysLeft,
                'badge_type' => ($daysLeft === 'Hari ini' || str_contains($daysLeft, '1 ') || str_contains($daysLeft, '2 ')) ? 'soon' : 'upcoming',
            ];
        })->values()->toArray();
    }

    private function getCategoryScores($user, $registeredExams): array
    {
        if ($registeredExams->isEmpty()) {
            return [];
        }

        // Define gradients for typical sections
        $gradients = [
            'TWK' => 'linear-gradient(90deg,#4338CA,#818CF8)',
            'TIU' => 'linear-gradient(90deg,#0F766E,#2DD4BF)',
            'TKP' => 'linear-gradient(90deg,#047857,#34D399)',
            'Verbal' => 'linear-gradient(90deg,#B45309,#FCD34D)',
            'Numerik' => 'linear-gradient(90deg,#5B21B6,#A78BFA)',
        ];

        $categories = [];
        foreach ($registeredExams as $exam) {
            if (is_array($exam->settings) && isset($exam->settings['seksi'])) {
                foreach ($exam->settings['seksi'] as $seksi) {
                    $title = $seksi['title'];
                    // Extract short label, e.g. "TWK — Tes Wawasan Kebangsaan" -> "TWK"
                    $parts = explode('—', $title);
                    if (count($parts) < 2) {
                        $parts = explode('-', $title);
                    }
                    $label = trim($parts[0]);
                    
                    if (!isset($categories[$label])) {
                        $categories[$label] = [
                            'label' => $label,
                            'max' => 100,
                            'gradient' => $gradients[$label] ?? 'linear-gradient(90deg,#4F46E5,#818CF8)',
                        ];
                    }
                }
            }
        }

        // Fallback to exam categories relation if settings->seksi is empty
        if (empty($categories)) {
            foreach ($registeredExams as $exam) {
                if ($exam->category) {
                    $label = $exam->category->name;
                    if (!isset($categories[$label])) {
                        $categories[$label] = [
                            'label' => $label,
                            'max' => 100,
                            'gradient' => $gradients[$label] ?? 'linear-gradient(90deg,#4F46E5,#818CF8)',
                        ];
                    }
                }
            }
        }

        // Map values from user history if available
        $riwayat = is_array($user->exam_data) && isset($user->exam_data['riwayat']) ? $user->exam_data['riwayat'] : [];
        
        $result = [];
        foreach ($categories as $label => $cat) {
            $value = 0;
            // Search in history for a matching name
            foreach ($riwayat as $r) {
                $rName = $r['nama'] ?? '';
                if (stripos($rName, $label) !== false) {
                    $value = $r['nilai'] ?? 0;
                    break;
                }
            }
            
            // No mock fallback values; default is 0 if not yet worked on

            $cat['value'] = $value;
            $result[] = $cat;
        }

        return $result;
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
        // Check if there is history in user's exam_data['riwayat']
        if (is_array($user->exam_data) && !empty($user->exam_data['riwayat'])) {
            // Pre-cache exams by title to avoid N+1 queries
            $examTitles = collect($user->exam_data['riwayat'])->pluck('nama')->filter()->unique()->toArray();
            $examsMap = \App\Models\Exam::whereIn('title', $examTitles)->pluck('id', 'title')->toArray();

            return collect($user->exam_data['riwayat'])->map(function ($h) use ($examsMap) {
                $score = $h['nilai'] ?? null;
                $scoreClass = 'mid';
                if ($score !== null) {
                    if ($score >= 80) $scoreClass = 'high';
                    elseif ($score < 60) $scoreClass = 'low';
                }

                $lulus = $h['lulus'] ?? false;
                $status = $lulus ? 'Lulus' : 'Tidak Lulus';
                $statusClass = $lulus ? 'lulus' : 'gagal';

                $examId = $h['exam_id'] ?? null;
                if (!$examId && isset($h['nama'])) {
                    $examId = $examsMap[$h['nama']] ?? null;
                }

                return [
                    'exam_id' => $examId,
                    'title' => $h['nama'] ?? 'Ujian',
                    'date' => $h['tgl'] ?? '—',
                    'score' => $score,
                    'score_class' => $scoreClass,
                    'rank' => '—',
                    'rank_class' => '',
                    'duration' => '—',
                    'status' => $status,
                    'status_class' => $statusClass,
                ];
            })->toArray();
        }

        return [];
    }
}
