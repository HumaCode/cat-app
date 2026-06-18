<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Institution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
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

        // Admin User 1
        User::factory()->admin()->create([
            'name' => 'Admin Satu',
            'username' => 'admin1',
            'email' => 'admin1@example.com',
            'password' => bcrypt('123'),
            'institution_id' => $institution->id,
        ]);

        // Admin User 2
        User::factory()->admin()->create([
            'name' => 'Admin Dua',
            'username' => 'admin2',
            'email' => 'admin2@example.com',
            'password' => bcrypt('123'),
            'institution_id' => $institution->id,
        ]);

        // Proctor User
        User::factory()->proctor()->create([
            'name' => 'Pengawas Satu',
            'username' => 'proctor',
            'email' => 'proctor@example.com',
            'institution_id' => $institution->id,
        ]);

        // Peserta User
        User::factory()->create([
            'name' => 'Peserta Ujian',
            'username' => 'peserta',
            'email' => 'peserta@example.com',
            'institution_id' => $institution->id,
            'exam_data' => [
                'ujian' => 'SKD CPNS 2025 — Paket A',
                'attempts' => [false, false, false],
                'ujian_count' => 1,
                'nilai' => null,
                'riwayat' => []
            ]
        ]);

        // Developer User
        User::factory()->create([
            'name' => 'Developer',
            'username' => 'dev',
            'email' => 'dev@example.com',
            'password' => bcrypt('123'),
            'role' => 'dev',
            'institution_id' => $institution->id,
        ]);

        // Mock Participants
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
            $inst = Institution::firstOrCreate(
                ['name' => $p['instansi']],
                ['slug' => Str::slug($p['instansi'])]
            );

            User::create([
                'institution_id' => $inst->id,
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
