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

        // 8. Buat Peserta Mock dari cat-peserta.html
        $participants = [
            [
                'name' => 'Rina Wijayanti, S.Pd',
                'nip_nik' => '198702142010012014',
                'email' => 'rina.wijayanti@gmail.com',
                'telepon' => '081234567890',
                'instansi' => 'Dinas Pendidikan',
                'jabatan' => 'Guru Ahli Muda',
                'status' => 'aktif',
                'created_at' => '2025-01-03 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket A',
                    'ujian_count' => 3,
                    'nilai' => 84.5,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'SKD CPNS 2025 — Paket A', 'tgl' => '10 Jun 2025', 'nilai' => 84.5, 'lulus' => true],
                        ['nama' => 'Simulasi TIU Sesi 2', 'tgl' => '28 Mei 2025', 'nilai' => 78.0, 'lulus' => true],
                        ['nama' => 'Latihan TWK', 'tgl' => '15 Mei 2025', 'nilai' => 91.3, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Dimas Prasetyo, S.Kom',
                'nip_nik' => '199005202018031002',
                'email' => 'dimas.pras@yahoo.com',
                'telepon' => '082198765432',
                'instansi' => 'Diskominfo',
                'jabatan' => 'Pranata Komputer',
                'status' => 'aktif',
                'created_at' => '2025-01-12 10:00:00',
                'exam_data' => [
                    'ujian' => 'Ujian Kompetensi Teknis IT',
                    'ujian_count' => 2,
                    'nilai' => 91.2,
                    'attempts' => [true, true, false],
                    'riwayat' => [
                        ['nama' => 'Ujian Kompetensi Teknis IT', 'tgl' => '9 Jun 2025', 'nilai' => 91.2, 'lulus' => true],
                        ['nama' => 'SKD CPNS 2024', 'tgl' => '20 Nov 2024', 'nilai' => 76.4, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Siti Rahayu',
                'nip_nik' => '199312082020122001',
                'email' => 'siti.rahayu@pekalongan.go.id',
                'telepon' => '085611223344',
                'instansi' => 'BKPSDM',
                'jabatan' => 'Pengelola Kepegawaian',
                'status' => 'aktif',
                'created_at' => '2025-01-20 10:00:00',
                'exam_data' => [
                    'ujian' => 'TKD PPPK Guru Batch 2',
                    'ujian_count' => 1,
                    'nilai' => 62.0,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'TKD PPPK Guru Batch 2', 'tgl' => '8 Jun 2025', 'nilai' => 62.0, 'lulus' => false]
                    ]
                ]
            ],
            [
                'name' => 'Ahmad Fauzi, S.AP',
                'nip_nik' => '198808152014031007',
                'email' => 'a.fauzi@dinkes.id',
                'telepon' => '087766554433',
                'instansi' => 'Dinas Kesehatan',
                'jabatan' => 'Analis Kebijakan',
                'status' => 'aktif',
                'created_at' => '2025-02-05 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket A',
                    'ujian_count' => 4,
                    'nilai' => 77.8,
                    'attempts' => [true, true, false],
                    'riwayat' => [
                        ['nama' => 'SKD CPNS 2025 — Paket A', 'tgl' => '10 Jun 2025', 'nilai' => 77.8, 'lulus' => true],
                        ['nama' => 'SKD CPNS 2025 — Paket B', 'tgl' => '5 Jun 2025', 'nilai' => 74.2, 'lulus' => true],
                        ['nama' => 'Simulasi SKD Sesi 3', 'tgl' => '20 Mei 2025', 'nilai' => 80.1, 'lulus' => true],
                        ['nama' => 'Latihan TWK', 'tgl' => '10 Mei 2025', 'nilai' => 88.5, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Dewi Permatasari, S.H',
                'nip_nik' => '199107292019032010',
                'email' => 'd.permata@pemkot.id',
                'telepon' => '081355443322',
                'instansi' => 'Bagian Hukum',
                'jabatan' => 'Analis Hukum',
                'status' => 'pending',
                'created_at' => '2025-02-14 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket A',
                    'ujian_count' => 2,
                    'nilai' => null,
                    'attempts' => [false, false, false],
                    'riwayat' => []
                ]
            ],
            [
                'name' => 'Budi Santoso',
                'nip_nik' => '198503112009031006',
                'email' => 'budi.s@dispora.id',
                'telepon' => '089988776655',
                'instansi' => 'Dispora',
                'jabatan' => 'Pengelola Keolahragaan',
                'status' => 'aktif',
                'created_at' => '2025-02-18 10:00:00',
                'exam_data' => [
                    'ujian' => 'TKD PPPK Guru Batch 2',
                    'ujian_count' => 1,
                    'nilai' => 55.4,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'TKD PPPK Guru Batch 2', 'tgl' => '8 Jun 2025', 'nilai' => 55.4, 'lulus' => false]
                    ]
                ]
            ],
            [
                'name' => 'Nur Hidayah, S.Sos',
                'nip_nik' => '199204032021032003',
                'email' => 'nur.hidayah@bkpsdm.id',
                'telepon' => '082211334455',
                'instansi' => 'BKPSDM',
                'jabatan' => 'Analis SDM Aparatur',
                'status' => 'aktif',
                'created_at' => '2025-02-22 10:00:00',
                'exam_data' => [
                    'ujian' => 'Diklat Kepemimpinan IV',
                    'ujian_count' => 3,
                    'nilai' => 88.0,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'Diklat Kepemimpinan IV', 'tgl' => '3 Jun 2025', 'nilai' => 88.0, 'lulus' => true],
                        ['nama' => 'SKD CPNS 2025 — Paket A', 'tgl' => '10 Jun 2025', 'nilai' => 81.5, 'lulus' => true],
                        ['nama' => 'Simulasi TIU', 'tgl' => '1 Jun 2025', 'nilai' => 79.0, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Hendra Wijaya, S.T',
                'nip_nik' => '198901172017031004',
                'email' => 'hendra.w@gmail.com',
                'telepon' => '085577889900',
                'instansi' => 'Dinas PUPR',
                'jabatan' => 'Pengawas Bangunan',
                'status' => 'nonaktif',
                'created_at' => '2025-03-01 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket B',
                    'ujian_count' => 2,
                    'nilai' => 69.3,
                    'attempts' => [true, true, false],
                    'riwayat' => [
                        ['nama' => 'SKD CPNS 2025 — Paket B', 'tgl' => '5 Jun 2025', 'nilai' => 69.3, 'lulus' => false],
                        ['nama' => 'Latihan TWK', 'tgl' => '20 Mei 2025', 'nilai' => 72.1, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Lilis Suryani, A.Md',
                'nip_nik' => '199509102020122006',
                'email' => 'lilis.surya@dinkes.id',
                'telepon' => '081399887766',
                'instansi' => 'Dinas Kesehatan',
                'jabatan' => 'Perawat Terampil',
                'status' => 'aktif',
                'created_at' => '2025-03-08 10:00:00',
                'exam_data' => [
                    'ujian' => 'TKD PPPK Guru Batch 2',
                    'ujian_count' => 1,
                    'nilai' => 73.6,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'TKD PPPK Guru Batch 2', 'tgl' => '8 Jun 2025', 'nilai' => 73.6, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Reza Firmansyah, S.Pd',
                'nip_nik' => '199308162019031011',
                'email' => 'reza.f@disdik.id',
                'telepon' => '087612345678',
                'instansi' => 'Dinas Pendidikan',
                'jabatan' => 'Guru Ahli Pertama',
                'status' => 'pending',
                'created_at' => '2025-03-15 10:00:00',
                'exam_data' => [
                    'ujian' => 'TKD PPPK Guru Batch 2',
                    'ujian_count' => 2,
                    'nilai' => null,
                    'attempts' => [false, false, false],
                    'riwayat' => []
                ]
            ],
            [
                'name' => 'Fitri Andayani, S.AP',
                'nip_nik' => '199011242018032008',
                'email' => 'fitri.a@disdukcapil.id',
                'telepon' => '082334455667',
                'instansi' => 'Disdukcapil',
                'jabatan' => 'Analis Administrasi',
                'status' => 'aktif',
                'created_at' => '2025-03-20 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket A',
                    'ujian_count' => 3,
                    'nilai' => 80.2,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'SKD CPNS 2025 — Paket A', 'tgl' => '10 Jun 2025', 'nilai' => 80.2, 'lulus' => true],
                        ['nama' => 'Latihan TWK', 'tgl' => '1 Jun 2025', 'nilai' => 85.0, 'lulus' => true],
                        ['nama' => 'Simulasi TIU', 'tgl' => '25 Mei 2025', 'nilai' => 76.3, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Wahyu Nugroho, S.E',
                'nip_nik' => '198712052014031009',
                'email' => 'wahyu.n@bpkad.id',
                'telepon' => '089977665544',
                'instansi' => 'BPKAD',
                'jabatan' => 'Analis Keuangan',
                'status' => 'aktif',
                'created_at' => '2025-04-02 10:00:00',
                'exam_data' => [
                    'ujian' => 'Diklat Kepemimpinan IV',
                    'ujian_count' => 1,
                    'nilai' => 92.5,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'Diklat Kepemimpinan IV', 'tgl' => '3 Jun 2025', 'nilai' => 92.5, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Anggraeni Putri, S.Gz',
                'nip_nik' => '199606182021032005',
                'email' => 'anggraeni.p@dinkes.id',
                'telepon' => '081544556677',
                'instansi' => 'Dinas Kesehatan',
                'jabatan' => 'Nutrisionis Terampil',
                'status' => 'aktif',
                'created_at' => '2025-04-10 10:00:00',
                'exam_data' => [
                    'ujian' => 'SKD CPNS 2025 — Paket A',
                    'ujian_count' => 1,
                    'nilai' => 58.9,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'SKD CPNS 2025 — Paket A', 'tgl' => '10 Jun 2025', 'nilai' => 58.9, 'lulus' => false]
                    ]
                ]
            ],
            [
                'name' => 'Teguh Prabowo, S.H',
                'nip_nik' => '198604072015031003',
                'email' => 'teguh.p@kejaksaan.id',
                'telepon' => '082266778899',
                'instansi' => 'Kejaksaan',
                'jabatan' => 'Jaksa Fungsional',
                'status' => 'nonaktif',
                'created_at' => '2025-04-18 10:00:00',
                'exam_data' => [
                    'ujian' => 'Diklat Kepemimpinan IV',
                    'ujian_count' => 2,
                    'nilai' => 87.3,
                    'attempts' => [true, true, false],
                    'riwayat' => [
                        ['nama' => 'Diklat Kepemimpinan IV', 'tgl' => '3 Jun 2025', 'nilai' => 87.3, 'lulus' => true],
                        ['nama' => 'SKD CPNS 2024', 'tgl' => '15 Nov 2024', 'nilai' => 80.0, 'lulus' => true]
                    ]
                ]
            ],
            [
                'name' => 'Maulida Sari, S.Pd.I',
                'nip_nik' => '199403102022032002',
                'email' => 'maulida.s@kemenag.id',
                'telepon' => '085133445566',
                'instansi' => 'Kemenag Kota',
                'jabatan' => 'Penyuluh Agama',
                'status' => 'aktif',
                'created_at' => '2025-04-25 10:00:00',
                'exam_data' => [
                    'ujian' => 'TKD PPPK Guru Batch 2',
                    'ujian_count' => 1,
                    'nilai' => 71.0,
                    'attempts' => [true, false, false],
                    'riwayat' => [
                        ['nama' => 'TKD PPPK Guru Batch 2', 'tgl' => '8 Jun 2025', 'nilai' => 71.0, 'lulus' => true]
                    ]
                ]
            ]
        ];

        foreach ($participants as $p) {
            User::create([
                'institution_id' => $institution->id,
                'role' => 'peserta',
                'name' => $p['name'],
                'username' => explode('@', $p['email'])[0],
                'email' => $p['email'],
                'password' => bcrypt('password'),
                'telepon' => $p['telepon'],
                'instansi' => $p['instansi'],
                'jabatan' => $p['jabatan'],
                'nip_nik' => $p['nip_nik'],
                'status' => $p['status'],
                'exam_data' => $p['exam_data'],
                'created_at' => $p['created_at'],
                'updated_at' => $p['created_at'],
            ]);
        }
    }
}
