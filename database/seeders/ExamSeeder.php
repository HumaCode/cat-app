<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institution = Institution::first();
        if (!$institution) {
            $institution = Institution::create([
                'name' => 'Panitia Pusat Cerdas Cermat',
                'slug' => 'panitia-pusat',
                'subscription_plan' => 'professional',
            ]);
        }

        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $admin = User::first();
        }

        $exams = [
            [
                'title' => 'SKD CPNS 2025 — Paket A',
                'type' => 'Simulasi',
                'duration' => 100,
                'passing_grade' => 65,
                'status' => 'aktif',
                'start_time' => now()->subHours(2),
                'end_time' => now()->addHours(6),
                'instructions' => 'Kerjakan ujian dengan jujur dan teliti. Ujian ini terdiri dari TWK, TIU, dan TKP.',
            ],
            [
                'title' => 'TIU Verbal Reasoning Batch 3',
                'type' => 'Latihan',
                'duration' => 60,
                'passing_grade' => 65,
                'status' => 'aktif',
                'start_time' => now()->subHour(),
                'end_time' => now()->addHours(3),
                'instructions' => 'Latihan intensif mengenai sinonim, antonim, analogi, dan silogisme.',
            ],
            [
                'title' => 'TKD PPPK Guru 2025 Batch 2',
                'type' => 'Simulasi',
                'duration' => 120,
                'passing_grade' => 65,
                'status' => 'aktif',
                'start_time' => now(),
                'end_time' => now()->addHours(4),
                'instructions' => 'Simulasi kompetensi teknis, manajerial, sosio-kultural, dan wawancara.',
            ],
            [
                'title' => 'SKD CPNS 2025 — Paket B',
                'type' => 'Simulasi',
                'duration' => 100,
                'passing_grade' => 65,
                'status' => 'terjadwal',
                'start_time' => now()->addDay(),
                'end_time' => now()->addDay()->addHours(3),
                'instructions' => 'Ujian simulasi SKD paket B untuk pemantapan materi.',
            ],
            [
                'title' => 'TWK Intensif — Sesi Sore',
                'type' => 'Latihan',
                'duration' => 45,
                'passing_grade' => 65,
                'status' => 'terjadwal',
                'start_time' => now()->addDay()->addHours(6),
                'end_time' => now()->addDay()->addHours(8),
                'instructions' => 'Fokus pada bela negara dan pilar negara.',
            ],
            [
                'title' => 'Diklat Kepemimpinan Tk. III',
                'type' => 'Resmi',
                'duration' => 180,
                'passing_grade' => 70,
                'status' => 'terjadwal',
                'start_time' => now()->addDays(2),
                'end_time' => now()->addDays(2)->addHours(4),
                'instructions' => 'Ujian kompetensi resmi kedinasan BKPSDM Pekalongan.',
            ],
            [
                'title' => 'Simulasi SKB Teknis IT',
                'type' => 'Simulasi',
                'duration' => 90,
                'passing_grade' => 65,
                'status' => 'terjadwal',
                'start_time' => now()->addDays(3),
                'end_time' => now()->addDays(3)->addHours(2),
                'instructions' => 'Soal mencakup rekayasa perangkat lunak, basis data, dan jaringan.',
            ],
            [
                'title' => 'Ujian Kompetensi Bidang Keuangan',
                'type' => 'Resmi',
                'duration' => 120,
                'passing_grade' => 68,
                'status' => 'terjadwal',
                'start_time' => now()->addDays(5),
                'end_time' => now()->addDays(5)->addHours(2),
                'instructions' => 'Ujian kompetensi akuntansi dan anggaran daerah.',
            ],
            [
                'title' => 'Latihan Soal TWK — Percobaan 1',
                'type' => 'Latihan',
                'duration' => 30,
                'passing_grade' => 60,
                'status' => 'draft',
                'start_time' => null,
                'end_time' => null,
                'instructions' => 'Latihan mandiri wawasan kebangsaan.',
            ],
            [
                'title' => 'TWK Nasionalisme Draft',
                'type' => 'Simulasi',
                'duration' => 40,
                'passing_grade' => 65,
                'status' => 'draft',
                'start_time' => null,
                'end_time' => null,
                'instructions' => 'Draft simulasi TWK khusus pilar NKRI.',
            ],
        ];

        $twkCategory = \App\Models\Category::where('name', 'TWK')->first();
        $tiuCategory = \App\Models\Category::where('name', 'TIU')->first();
        $tkpCategory = \App\Models\Category::where('name', 'TKP')->first();

        foreach ($exams as $exam) {
            // Find participants registered to this exam in UserSeeder
            $participantIds = User::where('role', 'peserta')
                ->get()
                ->filter(function ($u) use ($exam) {
                    return is_array($u->exam_data) && isset($u->exam_data['ujian']) && $u->exam_data['ujian'] === $exam['title'];
                })
                ->pluck('id')
                ->toArray();

            Exam::create([
                'institution_id' => $institution->id,
                'user_id' => $admin->id,
                'title' => $exam['title'],
                'type' => $exam['type'],
                'duration' => $exam['duration'],
                'passing_grade' => $exam['passing_grade'],
                'status' => $exam['status'],
                'start_time' => $exam['start_time'],
                'end_time' => $exam['end_time'],
                'instructions' => $exam['instructions'],
                'settings' => [
                    'show_results' => true,
                    'show_answers' => false,
                    'shuffle_questions' => true,
                    'shuffle_options' => true,
                    'lockdown_mode' => true,
                    'activity_logging' => true,
                    'attempts_limit' => 1,
                    'access_type' => 'Hanya peserta terdaftar',
                    'seksi' => [
                        [
                            'title' => 'TWK — Tes Wawasan Kebangsaan',
                            'category_id' => $twkCategory?->id,
                            'icon' => '📚',
                            'soal_count' => 30,
                            'duration' => 30,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ],
                        [
                            'title' => 'TIU — Tes Intelegensia Umum',
                            'category_id' => $tiuCategory?->id,
                            'icon' => '🔢',
                            'soal_count' => 35,
                            'duration' => 35,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ],
                        [
                            'title' => 'TKP — Tes Karakteristik Pribadi',
                            'category_id' => $tkpCategory?->id,
                            'icon' => '❤️',
                            'soal_count' => 45,
                            'duration' => 35,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ]
                    ],
                    'participants' => array_values($participantIds)
                ]
            ]);
        }
    }
}
