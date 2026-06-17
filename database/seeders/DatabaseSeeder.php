<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Institusi Default
        $institution = \App\Models\Institution::create([
            'name' => 'Panitia Pusat Cerdas Cermat',
            'slug' => 'panitia-pusat',
            'subscription_plan' => 'professional',
        ]);

        // 2. Buat Admin User
        User::factory()->admin()->create([
            'name' => 'Admin Utama',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'institution_id' => $institution->id,
        ]);

        // 3. Buat Proctor User (Pengawas)
        User::factory()->proctor()->create([
            'name' => 'Pengawas Satu',
            'username' => 'proctor',
            'email' => 'proctor@example.com',
            'institution_id' => $institution->id,
        ]);

        // 4. Buat Peserta User
        User::factory()->create([
            'name' => 'Peserta Ujian',
            'username' => 'peserta',
            'email' => 'peserta@example.com',
            'institution_id' => $institution->id,
        ]);

        // 5. Buat Developer User
        User::factory()->create([
            'name' => 'Developer',
            'username' => 'dev',
            'email' => 'dev@example.com',
            'password' => bcrypt('123'),
            'role' => 'dev',
            'institution_id' => $institution->id,
        ]);

        // 6. Buat Kategori Soal Default
        $cats = [
            [
                'name' => 'TWK',
                'icon' => '🏛️',
                'ch' => [
                    ['name' => 'Nasionalisme', 'icon' => '🇮🇩'],
                    ['name' => 'Integritas', 'icon' => '⚖️'],
                    ['name' => 'Bela Negara', 'icon' => '🎖️'],
                    ['name' => 'Pancasila & UUD', 'icon' => '📜'],
                    ['name' => 'Bhinneka Tunggal Ika', 'icon' => '🕊️'],
                ]
            ],
            [
                'name' => 'TIU',
                'icon' => '🧠',
                'ch' => [
                    ['name' => 'Kemampuan Verbal', 'icon' => '💬'],
                    ['name' => 'Kemampuan Numerik', 'icon' => '🔢'],
                    ['name' => 'Kemampuan Logis', 'icon' => '🔗'],
                    ['name' => 'Kemampuan Spasial', 'icon' => '📐'],
                ]
            ],
            [
                'name' => 'TKP',
                'icon' => '🤝',
                'ch' => [
                    ['name' => 'Sosial Budaya', 'icon' => '🌐'],
                    ['name' => 'Pelayanan Publik', 'icon' => '🏢'],
                    ['name' => 'Profesionalisme', 'icon' => '💼'],
                    ['name' => 'Anti Korupsi', 'icon' => '🛡️'],
                ]
            ],
            [
                'name' => 'Diklat & Kompetensi',
                'icon' => '📚',
                'ch' => [
                    ['name' => 'Kompetensi IT', 'icon' => '💻'],
                    ['name' => 'Manajemen ASN', 'icon' => '📋'],
                    ['name' => 'Lainnya', 'icon' => '📄'],
                ]
            ],
        ];

        $categoryMap = [];

        foreach ($cats as $idx => $cData) {
            $parent = \App\Models\Category::create([
                'institution_id' => $institution->id,
                'name' => $cData['name'],
                'icon' => $cData['icon'],
                'slug' => \Illuminate\Support\Str::slug($cData['name']),
                'order_column' => $idx,
            ]);

            foreach ($cData['ch'] as $cidx => $chData) {
                $child = \App\Models\Category::create([
                    'institution_id' => $institution->id,
                    'parent_id' => $parent->id,
                    'name' => $chData['name'],
                    'icon' => $chData['icon'],
                    'slug' => \Illuminate\Support\Str::slug($chData['name']),
                    'order_column' => $cidx,
                ]);
                $categoryMap[$parent->name . ' → ' . $child->name] = $child->id;
            }
        }

        // 7. Buat Soal Ujian Default
        $soalData = [
            [
                'q' => 'Pancasila sebagai dasar negara memiliki fungsi pokok dalam kehidupan berbangsa dan bernegara. Apa yang dimaksud dengan fungsi Pancasila sebagai dasar negara?',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Landasan idiil negara', 'Pedoman moral bangsa', 'Sumber dari segala sumber hukum', 'Perekat persatuan bangsa', 'Simbol identitas nasional'],
                'benar' => 2
            ],
            [
                'q' => 'Seorang pegawai menemukan rekan kerjanya melakukan pungutan liar kepada masyarakat. Tindakan yang paling tepat sesuai nilai integritas ASN adalah…',
                'kat' => 'TKP → Anti Korupsi',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Diam saja agar tidak terlibat', 'Melaporkan ke atasan atau Inspektorat', 'Mengingatkan secara langsung di depan umum', 'Ikut serta agar tidak dikucilkan', 'Membahas bersama rekan lain'],
                'benar' => 1
            ],
            [
                'q' => 'Jika A lebih tinggi dari B, dan C lebih rendah dari B tetapi lebih tinggi dari D. Manakah urutan yang benar dari yang paling rendah ke tertinggi?',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Sulit',
                'poin' => 5,
                'opts' => ['D, C, B, A', 'C, D, B, A', 'A, B, C, D', 'D, B, C, A'],
                'benar' => 0
            ],
            [
                'q' => 'Jelaskan pengertian Bhinneka Tunggal Ika dan bagaimana penerapannya dalam kehidupan bermasyarakat di era digital saat ini.',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'essay',
                'diff' => 'Sedang',
                'poin' => 20
            ],
            [
                'q' => 'Pernyataan: "Setiap warga negara wajib menjunjung hukum dan pemerintahan tanpa terkecuali." Pernyataan ini sesuai dengan UUD 1945 Pasal 27 Ayat 1.',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'tf',
                'diff' => 'Mudah',
                'poin' => 3
            ],
            [
                'q' => 'Berapakah hasil dari: 15% dari 840 ditambah 20% dari 650?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['246', '256', '266', '276'],
                'benar' => 0
            ],
            [
                'q' => 'Pasangkan setiap lembaga negara dengan fungsinya yang paling tepat: DPR, MPR, MA, MK, KY.',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'jodoh',
                'diff' => 'Sedang',
                'poin' => 10
            ],
            [
                'q' => 'Susunlah langkah-langkah berikut sesuai dengan prosedur pengaduan pelayanan publik yang benar berdasarkan UU No. 25 Tahun 2009.',
                'kat' => 'TKP → Pelayanan Publik',
                'tipe' => 'urutan',
                'diff' => 'Mudah',
                'poin' => 8,
                'aktif' => false
            ],
            [
                'q' => 'Pilih SEMUA yang merupakan asas-asas umum pemerintahan yang baik (AUPB) berdasarkan UU No. 30 Tahun 2014 tentang Administrasi Pemerintahan.',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pgk',
                'diff' => 'Sulit',
                'poin' => 10,
                'opts' => ['Kepastian hukum', 'Kemanfaatan', 'Ketidakberpihakan', 'Kecermatan', 'Paksaan administratif'],
                'benar' => [0, 1, 2, 3]
            ],
            [
                'q' => 'Istilah "____" merujuk pada kemampuan seseorang dalam mengelola tugas dan tanggung jawab kerja secara efisien dan profesional.',
                'kat' => 'TKP → Profesionalisme',
                'tipe' => 'isian',
                'diff' => 'Mudah',
                'poin' => 3
            ],
            [
                'q' => 'Manakah di bawah ini yang BUKAN merupakan nilai-nilai dasar Bela Negara menurut UU No. 23 Tahun 2019 tentang Pengelolaan Sumber Daya Nasional?',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Sulit',
                'poin' => 5,
                'opts' => ['Cinta tanah air', 'Sadar berbangsa dan bernegara', 'Setia Pancasila', 'Kewirausahaan sosial', 'Rela berkorban'],
                'benar' => 3
            ],
            [
                'q' => 'Deret angka: 3, 7, 13, 21, 31, … Angka selanjutnya adalah?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['41', '43', '45', '47'],
                'benar' => 1
            ],
            [
                'q' => 'Persamaan kata (sinonim) dari kata "INSTRUKTIF" yang paling tepat adalah…',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Bersifat petunjuk', 'Bersifat memaksa', 'Bersifat persuasif', 'Bersifat informatif'],
                'benar' => 0
            ],
            [
                'q' => 'Identifikasi minimal 3 tantangan utama birokrasi Indonesia dalam era transformasi digital dan jelaskan strategi konkret mengatasinya.',
                'kat' => 'Diklat → Kemampuan IT', // Adjusted slightly to match seeded subcategories
                'tipe' => 'essay',
                'diff' => 'Sulit',
                'poin' => 25
            ],
            [
                'q' => 'Dalam konteks pelayanan publik, sistem "one stop service" bertujuan untuk meningkatkan efisiensi dan efektivitas layanan kepada masyarakat.',
                'kat' => 'TKP → Pelayanan Publik',
                'tipe' => 'tf',
                'diff' => 'Mudah',
                'poin' => 3
            ],
        ];

        foreach ($soalData as $s) {
            $catId = $categoryMap[$s['kat']] ?? \App\Models\Category::first()->id;

            $question = \App\Models\Question::create([
                'institution_id' => $institution->id,
                'category_id' => $catId,
                'type' => $s['tipe'],
                'difficulty' => $s['diff'],
                'points' => $s['poin'],
                'question_text' => $s['q'],
                'is_active' => $s['aktif'] ?? true,
            ]);

            if (isset($s['opts'])) {
                foreach ($s['opts'] as $oIdx => $oVal) {
                    $isCorrect = false;
                    if ($s['tipe'] === 'pgk') {
                        $isCorrect = in_array($oIdx, $s['benar']);
                    } else {
                        $isCorrect = $s['benar'] === $oIdx;
                    }

                    \App\Models\QuestionOption::create([
                        'question_id' => $question->id,
                        'option_text' => $oVal,
                        'is_correct' => $isCorrect,
                        'order_column' => $oIdx,
                    ]);
                }
            }
        }
    }
}
