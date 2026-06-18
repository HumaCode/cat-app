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

        // --- GENERATE ADDITIONAL QUESTIONS TO SATISFY EXAM QUOTAS ---
        $twkQuestions = [
            // Nasionalisme
            [
                'q' => 'Sikap cinta tanah air yang ditunjukkan dengan kerelaan berkorban demi kepentingan bangsa dan negara merupakan perwujudan dari nilai...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Patriotisme', 'Chauvinisme', 'Sektarianisme', 'Primordialisme', 'Etnosentrisme'],
                'benar' => 0
            ],
            [
                'q' => 'Salah satu tantangan nasionalisme di era digital adalah maraknya penyebaran informasi bohong (hoax) yang dapat memecah belah bangsa. Sikap kita sebagai warga negara adalah...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Menyebarkan kembali informasi tersebut agar orang lain waspada', 'Melakukan verifikasi dan saring sebelum sharing', 'Membiarkan saja karena bukan urusan pribadi', 'Melaporkan semua akun media sosial yang berbeda pendapat', 'Menghapus aplikasi media sosial'],
                'benar' => 1
            ],
            [
                'q' => 'Nasionalisme Indonesia adalah nasionalisme yang bersifat inklusif, artinya...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Menjunjung tinggi suku bangsa sendiri di atas suku lain', 'Terbuka menghargai perbedaan ras, suku, dan agama dalam bingkai persatuan', 'Menutup diri dari pengaruh budaya asing', 'Mengadopsi seluruh kebudayaan luar tanpa seleksi', 'Hanya mengakui kebudayaan Jawa sebagai budaya nasional'],
                'benar' => 1
            ],
            [
                'q' => 'Peristiwa Sumpah Pemuda pada tanggal 28 Oktober 1928 merupakan tonggak sejarah penting bagi nasionalisme Indonesia karena...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Merupakan awal berdirinya organisasi Boedi Oetomo', 'Menyatukan visi perjuangan kedaerahan menjadi perjuangan nasional yang satu', 'Menandai berakhirnya penjajahan Belanda', 'Menyepakati teks Proklamasi Kemerdekaan', 'Dihadiri oleh seluruh raja di nusantara'],
                'benar' => 1
            ],
            [
                'q' => 'Implementasi nilai nasionalisme dalam kehidupan sehari-hari bagi seorang Aparatur Sipil Negara (ASN) adalah...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Memberikan pelayanan terbaik tanpa membedakan latar belakang suku dan ras', 'Mengutamakan sanak saudara dalam rekrutmen pegawai', 'Hanya melayani masyarakat yang satu daerah asal', 'Menggunakan fasilitas negara untuk kepentingan kampanye', 'Bekerja secara lambat jika tidak diberi uang pelicin'],
                'benar' => 0
            ],
            [
                'q' => 'Tujuan utama dari gerakan kebangkitan nasional yang dirintis oleh Budi Utomo pada tahun 1908 adalah...',
                'kat' => 'TWK → Nasionalisme',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Mendirikan partai politik berbasis agama', 'Menyadarkan masyarakat akan pentingnya pendidikan dan persatuan untuk kemerdekaan', 'Melakukan pemberontakan bersenjata melawan Belanda', 'Bekerjasama dengan Jepang untuk mengusir sekutu', 'Memperluas wilayah kekuasaan kerajaan Surakarta'],
                'benar' => 1
            ],
            
            // Integritas
            [
                'q' => 'Nilai integritas yang tercermin dari kesesuaian antara perkataan dan perbuatan nyata adalah...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kejujuran', 'Keberanian', 'Kedisiplinan', 'Tanggung jawab', 'Keadilan'],
                'benar' => 0
            ],
            [
                'q' => 'Seorang ASN menolak gratifikasi berupa uang dari keluarga calon peserta ujian agar diloloskan. Tindakan ini mencerminkan sikap...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Loyalitas buta', 'Integritas tinggi', 'Ketakutan berlebih', 'Kurang bersosialisasi', 'Keterbatasan wewenang'],
                'benar' => 1
            ],
            [
                'q' => 'Dalam konteks pencegahan korupsi, sikap transparan dalam pengelolaan anggaran daerah merupakan perwujudan integritas di bidang...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Akuntabilitas publik', 'Nepotisme terselubung', 'Sentralisasi kekuasaan', 'Efisiensi subjektif', 'Kepemimpinan otoriter'],
                'benar' => 0
            ],
            [
                'q' => 'Salah satu pilar integritas nasional adalah penegakan hukum yang tidak tebang pilih. Hal ini diatur dalam UUD 1945 pasal...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Pasal 27 ayat 1', 'Pasal 28A', 'Pasal 29 ayat 2', 'Pasal 30 ayat 1', 'Pasal 31 ayat 1'],
                'benar' => 0
            ],
            [
                'q' => 'Sikap berani mengakui kesalahan diri sendiri dan menerima konsekuensi hukum atau sanksi moral menunjukkan nilai...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Tanggung jawab', 'Kesederhanaan', 'Kemampuan diplomasi', 'Keras kepala', 'Kewaspadaan'],
                'benar' => 0
            ],
            [
                'q' => 'Nilai kepedulian sosial yang tinggi terhadap kesusahan orang lain di lingkungan kerja tanpa pamrih merupakan wujud integritas...',
                'kat' => 'TWK → Integritas',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kemanusiaan', 'Keuntungan material', 'Pencitraan diri', 'Kepatuhan formal', 'Kewajiban administratif'],
                'benar' => 0
            ],

            // Bela Negara
            [
                'q' => 'Bela negara bukan hanya tugas TNI/Polri, melainkan hak dan kewajiban setiap warga negara. Hal ini secara tegas diatur dalam UUD 1945...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Pasal 27 ayat 3 dan Pasal 30 ayat 1', 'Pasal 27 ayat 1 dan Pasal 28', 'Pasal 29 ayat 1 dan Pasal 31', 'Pasal 33 ayat 1 dan Pasal 34', 'Pasal 35 dan Pasal 36'],
                'benar' => 0
            ],
            [
                'q' => 'Upaya bela negara yang dapat dilakukan oleh seorang mahasiswa dalam kehidupan akademik sehari-hari adalah...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Mengikuti demonstrasi anarkis', 'Belajar dengan tekun dan mengukir prestasi demi mengharumkan nama bangsa', 'Membeli senjata tajam untuk berjaga-jaga', 'Mengabaikan mata kuliah Pancasila', 'Membuat kelompok belajar eksklusif'],
                'benar' => 1
            ],
            [
                'q' => 'Sikap bangga menggunakan produk-produk buatan dalam negeri merupakan wujud bela negara yang didasari oleh nilai...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Cinta tanah air', 'Kesadaran berbangsa', 'Rela berkorban', 'Kepatuhan hukum', 'Keyakinan pada ideologi Pancasila'],
                'benar' => 0
            ],
            [
                'q' => 'Ketika wilayah kedaulatan negara terancam oleh klaim sepihak negara asing, sikap bela negara yang paling tepat bagi masyarakat sipil adalah...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Mendukung TNI secara moral dan menjaga persatuan bangsa di ruang publik', 'Melakukan demonstrasi di depan kedutaan besar negara lain secara merusak', 'Pindah kewarganegaraan ke negara netral', 'Membiarkan saja karena urusan pemerintah', 'Menuntut pemerintah untuk menyerah'],
                'benar' => 0
            ],
            [
                'q' => 'Nilai bela negara "Rela Berkorban demi Bangsa dan Negara" dicontohkan dalam kehidupan bernegara melalui...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Membayar pajak tepat waktu untuk pembangunan nasional', 'Menghindari tugas dinas luar kota yang melelahkan', 'Meminta kompensasi tinggi atas setiap pekerjaan', 'Mengikuti kerja bakti jika diberi upah', 'Menolak program imunisasi gratis dari pemerintah'],
                'benar' => 0
            ],
            [
                'q' => 'Kesiapan fisik dan mental serta menjaga kesehatan tubuh agar selalu prima untuk mendukung pertahanan negara merupakan wujud nilai bela negara...',
                'kat' => 'TWK → Bela Negara',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Mempunyai kemampuan awal bela negara', 'Sadar berbangsa dan bernegara', 'Setia kepada Pancasila sebagai ideologi negara', 'Rela berkorban demi bangsa dan negara', 'Cinta tanah air'],
                'benar' => 0
            ],

            // Pancasila & UUD
            [
                'q' => 'Sila ke-4 Pancasila, "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan", mengamanatkan pengambilan keputusan bersama melalui...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Musyawarah untuk mufakat dengan menghargai pendapat orang lain', 'Voting mutlak tanpa diskusi terlebih dahulu', 'Keputusan sepihak pimpinan rapat', 'Menolak berpartisipasi dalam diskusi', 'Mengikuti pendapat kelompok mayoritas tanpa kompromi'],
                'benar' => 0
            ],
            [
                'q' => 'Amandemen UUD 1945 yang dilakukan sebanyak 4 kali bertujuan untuk...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Mengubah bentuk negara Kesatuan menjadi Federal', 'Menyempurnakan aturan dasar penyelenggaraan negara sesuai perkembangan zaman', 'Memperpanjang masa jabatan Presiden tanpa batas', 'Menghapus keberadaan Majelis Permusyawaratan Rakyat', 'Mengganti ideologi Pancasila'],
                'benar' => 1
            ],
            [
                'q' => 'Kekuasaan kehakiman yang merdeka untuk menyelenggarakan peradilan guna menegakkan hukum dan keadilan dijalankan oleh...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Mahkamah Agung dan Mahkamah Konstitusi', 'Presiden dan DPR', 'Kementerian Hukum dan HAM', 'Komisi Pemberantasan Korupsi', 'Kepolisian dan Kejaksaan'],
                'benar' => 0
            ],
            [
                'q' => 'Nilai kemanusiaan yang adil dan beradab dalam Pancasila melarang segala bentuk tindakan yang...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Merendahkan harkat dan martabat manusia seperti perundungan dan kekerasan', 'Meningkatkan taraf hidup ekonomi masyarakat miskin', 'Mendirikan panti asuhan', 'Melakukan donor darah nasional', 'Menyelenggarakan bakti sosial'],
                'benar' => 0
            ],
            [
                'q' => 'Sistem pembagian kekuasaan (distribution of power) di Indonesia membagi kekuasaan menjadi beberapa lembaga negara. Kekuasaan membuat undang-undang disebut kekuasaan...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Legislatif', 'Eksekutif', 'Yudikatif', 'Eksaminatif', 'Moneter'],
                'benar' => 0
            ],
            [
                'q' => 'UUD 1945 Pasal 29 ayat 2 menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing dan untuk beribadat menurut agamanya dan kepercayaannya itu. Hal ini menegaskan bahwa Indonesia adalah negara yang...',
                'kat' => 'TWK → Pancasila & UUD',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Menjunjung tinggi kebebasan beragama berdasarkan Ketuhanan Yang Maha Esa', 'Negara sekuler yang memisahkan agama dari urusan negara', 'Hanya mengakui satu agama resmi saja', 'Negara teokrasi yang hukumnya murni dari satu kitab suci', 'Negara yang membebaskan warganya untuk tidak mempercayai Tuhan'],
                'benar' => 0
            ],

            // Bhinneka Tunggal Ika
            [
                'q' => 'Bhinneka Tunggal Ika yang tertulis pada lambang negara Garuda Pancasila memiliki arti...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Berbeda-beda tetapi tetap satu jua', 'Satu Nusa Satu Bangsa', 'Bersatu kita teguh bercerai kita runtuh', 'Keadilan sosial bagi seluruh rakyat', 'Persatuan Indonesia'],
                'benar' => 0
            ],
            [
                'q' => 'Sikap toleransi antarumat beragama yang paling tepat ditunjukkan dengan...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Menghormati ibadah pemeluk agama lain tanpa mencampuri keyakinan mereka', 'Mengikuti ritual ibadah agama lain agar dianggap toleran', 'Melarang pembangunan tempat ibadah pemeluk agama minoritas', 'Memaksa orang lain untuk mengikuti agama kita', 'Menganggap semua ajaran agama adalah salah'],
                'benar' => 0
            ],
            [
                'q' => 'Keberagaman suku, ras, bahasa daerah, dan adat istiadat di Indonesia merupakan...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kekayaan dan perekat bangsa jika dikelola dengan semangat persatuan', 'Penyebab utama runtuhnya pertahanan negara', 'Beban ekonomi bagi pembangunan nasional', 'Penghambat modernisasi teknologi', 'Alasan untuk memisahkan diri dari NKRI'],
                'benar' => 0
            ],
            [
                'q' => 'Ketika menghadapi perbedaan pendapat dalam rapat tingkat RT/RW, langkah yang mencerminkan Bhinneka Tunggal Ika adalah...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Mendengarkan argumen orang lain dengan lapang dada dan mencari titik temu', 'Keluar dari rapat karena usulan pribadi ditolak', 'Memaksakan kehendak dengan nada keras', 'Membuat rapat tandingan di tempat lain', 'Mengadu domba antar tetangga'],
                'benar' => 0
            ],
            [
                'q' => 'Seni pertunjukan Reog Ponorogo, Tari Kecak, dan Wayang Kulit merupakan contoh warisan budaya nasional yang harus...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Dilestarikan dan dibanggakan sebagai identitas budaya bersama', 'Diganti dengan kebudayaan modern dari luar negeri', 'Dibatasi pementasannya agar tidak memicu kurungan', 'Klaim oleh perseorangan untuk keuntungan pribadi', 'Diabaikan hingga punah dengan sendirinya'],
                'benar' => 0
            ],
            [
                'q' => 'Diskriminasi rasial atau pembedaan perlakuan berdasarkan warna kulit atau suku asal bertentangan dengan prinsip Bhinneka Tunggal Ika dan melanggar UUD 1945 pasal...',
                'kat' => 'TWK → Bhinneka Tunggal Ika',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Pasal 28I ayat 2', 'Pasal 29 ayat 1', 'Pasal 30 ayat 2', 'Pasal 33 ayat 2', 'Pasal 34 ayat 1'],
                'benar' => 0
            ]
        ];

        $tiuQuestions = [
            // Kemampuan Verbal
            [
                'q' => 'Persamaan kata (sinonim) dari "EVALUASI" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Penilaian', 'Perencanaan', 'Pelaksanaan', 'Pengawasan', 'Pendidikan'],
                'benar' => 0
            ],
            [
                'q' => 'Lawan kata (antonim) dari "APRESIASI" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Penghargaan', 'Pelecehan', 'Penolakan', 'Depresiasi', 'Pengabaian'],
                'benar' => 3
            ],
            [
                'q' => 'Analogi kata: MOBIL : BENSIN = MANUSIA : ...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Makanan', 'Oksigen', 'Air', 'Energi', 'Pakaian'],
                'benar' => 0
            ],
            [
                'q' => 'Persamaan kata (sinonim) dari "KOLABORASI" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kerjasama', 'Persaingan', 'Pemisahan', 'Pertikaian', 'Pembagian'],
                'benar' => 0
            ],
            [
                'q' => 'Lawan kata (antonim) dari "PROGRESIF" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Maju', 'Modern', 'Regresif', 'Aktif', 'Cepat'],
                'benar' => 2
            ],
            [
                'q' => 'Analogi kata: GENTENG : TANAH LIAT = CANGKIR : ...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kaca', 'Keramik', 'Plastik', 'Air', 'Kopi'],
                'benar' => 1
            ],
            [
                'q' => 'Persamaan kata (sinonim) dari "ASUMSI" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Kenyataan', 'Anggapan', 'Kesimpulan', 'Bukti', 'Analisis'],
                'benar' => 1
            ],
            [
                'q' => 'Lawan kata (antonim) dari "IMPLISIT" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Tersirat', 'Tersurat (Eksplisit)', 'Gelap', 'Dalam', 'Jelas'],
                'benar' => 1
            ],
            [
                'q' => 'Analogi kata: SENAPAN : BERBURU = JALA : ...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Menembak', 'Menangkap ikan', 'Memancing', 'Menyelam', 'Perahu'],
                'benar' => 1
            ],
            [
                'q' => 'Persamaan kata (sinonim) dari "DEDIKASI" adalah...',
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Pengabdian', 'Penolakan', 'Pekerjaan', 'Kemampuan', 'Kewajiban'],
                'benar' => 0
            ],
            
            // Kemampuan Numerik
            [
                'q' => 'Jika x = 5 dan y = 12, berapakah nilai dari akar kuadrat (x^2 + y^2)?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['13', '15', '17', '19', '21'],
                'benar' => 0
            ],
            [
                'q' => 'Sebuah proyek pembangunan dapat diselesaikan oleh 12 pekerja dalam waktu 30 hari. Jika proyek tersebut harus selesai dalam waktu 20 hari, berapakah pekerja tambahan yang dibutuhkan?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['6 pekerja', '8 pekerja', '10 pekerja', '12 pekerja', '18 pekerja'],
                'benar' => 0
            ],
            [
                'q' => 'Berapakah hasil dari 2.5 dikali 40 ditambah 15% dari 200?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['110', '120', '130', '140', '150'],
                'benar' => 2
            ],
            [
                'q' => 'Sebuah baju dijual dengan harga Rp 120.000 setelah mendapat diskon 20%. Berapakah harga asli baju tersebut?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Rp 140.000', 'Rp 150.000', 'Rp 160.000', 'Rp 180.000', 'Rp 200.000'],
                'benar' => 1
            ],
            [
                'q' => 'Deret angka: 2, 4, 8, 16, 32, ... Angka berikutnya adalah...',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['48', '64', '80', '96', '128'],
                'benar' => 1
            ],
            [
                'q' => 'Deret angka: 50, 45, 39, 32, 24, ... Angka berikutnya adalah...',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['18', '17', '16', '15', '14'],
                'benar' => 3
            ],
            [
                'q' => 'Deret angka: 3, 5, 9, 17, 33, ... Angka berikutnya adalah...',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['45', '50', '60', '65', '80'],
                'benar' => 3
            ],
            [
                'q' => 'Jika 3a + 5 = 20, berapakah nilai dari 6a - 2?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['28', '24', '18', '38', '16'],
                'benar' => 0
            ],
            [
                'q' => 'Seorang pedagang membeli 5 lusin buku dengan harga total Rp 150.000. Jika pedagang tersebut menjual kembali dengan harga Rp 3.500 per buku, berapakah persentase keuntungan pedagang tersebut?',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['10%', '20%', '30%', '40%', '50%'],
                'benar' => 3
            ],
            [
                'q' => 'Hasil perkalian dari 0.125 dengan 800 adalah...',
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['80', '100', '120', '150', '200'],
                'benar' => 1
            ],

            // Kemampuan Logis
            [
                'q' => 'Semua guru adalah pendidik. Sebagian guru adalah penulis. Kesimpulan yang paling tepat adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Sebagian penulis adalah pendidik', 'Semua penulis adalah guru', 'Semua pendidik adalah guru', 'Sebagian penulis bukan pendidik', 'Semua guru adalah penulis'],
                'benar' => 0
            ],
            [
                'q' => 'Jika hari hujan, maka jalanan basah. Hari ini jalanan tidak basah. Kesimpulan yang benar adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Hari ini hujan', 'Hari ini tidak hujan', 'Mungkin hari ini hujan', 'Jalanan kering karena panas', 'Hari ini mendung'],
                'benar' => 1
            ],
            [
                'q' => 'Semua mamalia menyusui anaknya. Paus adalah mamalia yang hidup di laut. Kesimpulan yang benar adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Paus menyusui anaknya', 'Paus bukan mamalia', 'Semua hewan laut menyusui', 'Paus bertelur di laut', 'Paus tidak menyusui anaknya'],
                'benar' => 0
            ],
            [
                'q' => 'Jika Andi rajin belajar, maka ia lulus ujian. Andi lulus ujian. Kesimpulan yang paling tepat adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Andi pasti rajin belajar', 'Andi tidak rajin belajar', 'Andi lulus karena beruntung', 'Tidak dapat ditarik kesimpulan yang pasti tentang kerajinan Andi belajar', 'Andi malas belajar'],
                'benar' => 3
            ],
            [
                'q' => 'Semua mahasiswa memakai almamater saat ospek. Budi tidak memakai almamater saat ospek. Kesimpulan yang benar adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Budi adalah mahasiswa', 'Budi bukan mahasiswa', 'Budi lupa membawa almamater', 'Budi adalah panitia', 'Budi sedang dihukum'],
                'benar' => 1
            ],
            [
                'q' => 'Premis 1: Jika laptop rusak, maka pekerjaan tertunda. Premis 2: Jika pekerjaan tertunda, maka bonus berkurang. Kesimpulan dari kedua premis tersebut adalah...',
                'kat' => 'TIU → Kemampuan Logis',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Jika laptop rusak, maka bonus berkurang', 'Jika bonus berkurang, maka laptop rusak', 'Laptop rusak karena pekerjaan tertunda', 'Bonus berkurang karena pekerjaan lancar', 'Pekerjaan tertunda meskipun laptop baik'],
                'benar' => 0
            ],

            // Kemampuan Spasial
            [
                'q' => 'Sebuah jaring-jaring kubus memiliki 6 sisi persegi. Jika jaring-jaring tersebut dilipat membentuk kubus, sisi yang berhadapan dengan sisi atas adalah...',
                'kat' => 'TIU → Kemampuan Spasial',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => ['Sisi bawah', 'Sisi kiri', 'Sisi kanan', 'Sisi depan', 'Sisi belakang'],
                'benar' => 0
            ],
            [
                'q' => 'Jika sebuah segitiga sama sisi diputar sebesar 120 derajat searah jarum jam pada pusatnya, bagaimanakah posisi penampilannya dibandingkan semula?',
                'kat' => 'TIU → Kemampuan Spasial',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Sama persis dengan posisi semula', 'Terbalik ke atas bawah', 'Miring ke kanan', 'Miring ke kiri', 'Menjadi persegi'],
                'benar' => 0
            ],
            [
                'q' => 'Sebuah lingkaran dipotong menjadi 8 bagian sama besar. Jika 3 bagian di antaranya diarsir, berapakah derajat total sudut dari bagian yang tidak diarsir?',
                'kat' => 'TIU → Kemampuan Spasial',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['135 derajat', '180 derajat', '225 derajat', '270 derajat', '315 derajat'],
                'benar' => 2
            ],
            [
                'q' => 'Jika sebuah persegi panjang dilipat secara diagonal, bangun datar apa yang terbentuk dari area tumpang tindihnya?',
                'kat' => 'TIU → Kemampuan Spasial',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => ['Segitiga', 'Trapesium', 'Jajar genjang', 'Layang-layang', 'Persegi'],
                'benar' => 0
            ]
        ];

        // Generate Math Arithmetic programmatically
        $tiuNumerikGenerated = [];
        for ($i = 1; $i <= 15; $i++) {
            $x = $i * 12 + 5;
            $y = $i * 8 + 3;
            $ans = $x + $y;
            $tiuNumerikGenerated[] = [
                'q' => "Berapakah hasil penjumlahan dari {$x} dan {$y}?",
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => [
                    (string)($ans),
                    (string)($ans - 5),
                    (string)($ans + 10),
                    (string)($ans - 2),
                    (string)($ans + 5)
                ],
                'benar' => 0
            ];
        }

        // Generate Math Discount programmatically
        for ($i = 1; $i <= 10; $i++) {
            $harga = $i * 50000;
            $diskon = 10 + ($i * 5);
            $potongan = $harga * ($diskon / 100);
            $hargaAkhir = $harga - $potongan;
            $tiuNumerikGenerated[] = [
                'q' => "Sebuah barang seharga Rp " . number_format($harga, 0, ',', '.') . " mendapatkan diskon sebesar {$diskon}%. Berapakah harga barang setelah diskon?",
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => [
                    "Rp " . number_format($hargaAkhir + 10000, 0, ',', '.'),
                    "Rp " . number_format($hargaAkhir, 0, ',', '.'),
                    "Rp " . number_format($hargaAkhir - 5000, 0, ',', '.'),
                    "Rp " . number_format($hargaAkhir + 5000, 0, ',', '.'),
                    "Rp " . number_format($harga - 10000, 0, ',', '.')
                ],
                'benar' => 1
            ];
        }

        // Generate Number Series programmatically
        for ($i = 1; $i <= 10; $i++) {
            $start = $i * 3;
            $diff = $i + 2;
            $series = [
                $start,
                $start + $diff,
                $start + (2 * $diff),
                $start + (3 * $diff),
                $start + (4 * $diff)
            ];
            $next = $start + (5 * $diff);
            $tiuNumerikGenerated[] = [
                'q' => "Tentukan angka selanjutnya dari deret berikut: " . implode(', ', $series) . ", ...",
                'kat' => 'TIU → Kemampuan Numerik',
                'tipe' => 'pg',
                'diff' => 'Sedang',
                'poin' => 5,
                'opts' => [
                    (string)($next - 2),
                    (string)($next + 4),
                    (string)($next),
                    (string)($next - 5),
                    (string)($next + 2)
                ],
                'benar' => 2
            ];
        }

        // Generate Verbal Synonyms and Antonyms
        $verbalPairs = [
            ['OTODIDAK', 'Belajar Sendiri', 'Mandiri', 'Terstruktur', 'Formal', 'Terbimbing'],
            ['KONSTITUSI', 'Undang-Undang Dasar', 'Peraturan', 'Kebiasaan', 'Hukum Adat', 'Keputusan'],
            ['AKURAT', 'Tepat', 'Benar', 'Meleset', 'Palsu', 'Kira-kira'],
            ['SKEPTIS', 'Ragu-ragu', 'Yakin', 'Percaya', 'Pasrah', 'Optimis'],
            ['NOMADEN', 'Berpindah-pindah', 'Menetap', 'Berkelana', 'Singgah', 'Terdampar'],
            ['ALTRUISME', 'Mengutamakan Orang Lain', 'Egois', 'Kikir', 'Mandiri', 'Kreatif'],
            ['DIVERGENSI', 'Penyebaran', 'Penyatuan', 'Pembagian', 'Pecahan', 'Pertemuan'],
            ['EFEKTIF', 'Tepat Guna', 'Bermanfaat', 'Sia-sia', 'Cepat', 'Boros'],
            ['INISIATIF', 'Prakarsa', 'Tindakan', 'Tiruan', 'Pasif', 'Ikut-ikutan'],
            ['FIKTIF', 'Khayalan', 'Nyata', 'Rekayasa', 'Palsu', 'Dongeng'],
        ];

        $tiuVerbalGenerated = [];
        foreach ($verbalPairs as $pair) {
            $tiuVerbalGenerated[] = [
                'q' => "Persamaan kata (sinonim) dari kata \"{$pair[0]}\" yang paling tepat adalah...",
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => [$pair[1], $pair[3], $pair[4], $pair[2], $pair[5]],
                'benar' => 0
            ];
            $tiuVerbalGenerated[] = [
                'q' => "Lawan kata (antonim) dari kata \"{$pair[0]}\" yang paling tepat adalah...",
                'kat' => 'TIU → Kemampuan Verbal',
                'tipe' => 'pg',
                'diff' => 'Mudah',
                'poin' => 5,
                'opts' => [$pair[1], $pair[3], $pair[4], $pair[2], $pair[5]],
                'benar' => 1
            ];
        }

        // Generate TKP programmatically (Situational Judgment)
        $tkpTemplates = [
            [
                'q' => 'Anda ditugaskan memimpin sebuah tim untuk menyelesaikan proyek {proyek} dalam waktu sangat singkat. Namun, {masalah}. Sikap Anda adalah...',
                'p1' => 'digitalisasi administrasi', 'p2' => 'sistem pengarsipan daerah', 'p3' => 'sosialisasi pelayanan publik', 'p4' => 'penyusunan laporan anggaran', 'p5' => 'audit kinerja instansi',
                'w1' => 'salah satu anggota tim utama mendadak sakit keras',
                'w2' => 'terjadi perbedaan pendapat yang tajam antar anggota tim',
                'w3' => 'fasilitas penunjang utama mengalami kerusakan',
                'w4' => 'anggaran yang tersedia dipangkas setengahnya',
                'w5' => 'ada kendala server yang mati total selama beberapa jam',
                'opts' => [
                    'Mengambil alih pekerjaan secara penuh dan menyelesaikannya sendiri hingga larut malam.',
                    'Melakukan pembagian ulang tugas secara adil dan memotivasi tim agar tetap fokus bekerja.',
                    'Melaporkan kendala tersebut kepada atasan untuk meminta perpanjangan waktu pengerjaan.',
                    'Membiarkan proyek berjalan apa adanya dan menyalahkan keadaan jika terlambat.',
                    'Menegur anggota tim secara keras agar mereka bekerja lebih giat tanpa banyak alasan.'
                ],
                'benar' => 1,
                'sub' => 'TKP → Profesionalisme'
            ],
            [
                'q' => 'Saat sedang melayani antrean warga yang sangat padat untuk {layanan}, tiba-tiba datang seorang {warga} yang meminta didahulukan tanpa antre. Sikap Anda adalah...',
                'p1' => 'pencetakan kartu identitas', 'p2' => 'pengurusan perizinan usaha', 'p3' => 'pendaftaran bantuan sosial', 'p4' => 'konsultasi administrasi kesehatan', 'p5' => 'pengaduan pelayanan publik',
                'w1' => 'kerabat dekat atasan Anda',
                'w2' => 'tokoh masyarakat setempat yang berpengaruh',
                'w3' => 'oknum yang menawarkan sejumlah uang pelicin',
                'w4' => 'warga yang mengaku terburu-buru karena urusan pribadi',
                'w5' => 'pengusaha kaya yang mendesak Anda',
                'opts' => [
                    'Mendahulukannya segera demi menjaga hubungan baik dan menghindari konflik.',
                    'Menolaknya dengan tegas namun santun serta menjelaskan bahwa semua warga harus antre.',
                    'Meminta rekan kerja lain untuk melayaninya di ruangan khusus agar tidak terlihat warga lain.',
                    'Memarahinya di depan umum agar menjadi contoh bagi pengantre lainnya.',
                    'Menerima permintaannya jika ia mau memberikan kompensasi atau imbalan tambahan.'
                ],
                'benar' => 1,
                'sub' => 'TKP → Pelayanan Publik'
            ],
            [
                'q' => 'Ketika menghadiri {acara} yang melibatkan perwakilan berbagai daerah di Indonesia, Anda melihat {perbedaan}. Sikap Anda adalah...',
                'p1' => 'forum diskusi kebudayaan nasional', 'p2' => 'pelatihan kepemimpinan lintas provinsi', 'p3' => 'pameran inovasi pelayanan publik', 'p4' => 'rapat koordinasi antar lembaga', 'p5' => 'studi banding instansi pemerintah',
                'w1' => 'beberapa peserta kesulitan berkomunikasi dalam bahasa Indonesia yang baku',
                'w2' => 'perbedaan kebiasaan adat yang dirasa aneh oleh peserta lain',
                'w3' => 'adanya kesalahpahaman karena perbedaan dialek cara bicara',
                'w4' => 'beberapa perwakilan enggan berbaur dengan kelompok di luar daerahnya',
                'w5' => 'debat sengit yang menjurus pada sentimen suku dan daerah asal',
                'opts' => [
                    'Mengabaikan situasi tersebut dan berkumpul hanya dengan rekan sedaerah saja.',
                    'Menjadi jembatan komunikasi, menghargai perbedaan, dan mengajak berbaur secara harmonis.',
                    'Mengkritik kebiasaan daerah lain yang dianggap kurang sopan atau kurang praktis.',
                    'Melaporkan perwakilan daerah tersebut kepada panitia agar ditegur.',
                    'Meminta agar panitia memisahkan meja diskusi berdasarkan daerah masing-masing.'
                ],
                'benar' => 1,
                'sub' => 'TKP → Sosial Budaya'
            ],
            [
                'q' => 'Sebagai panitia {kegiatan}, Anda ditawari oleh salah satu vendor untuk menerima {hadiah} dengan syarat mempermudah proses pemilihan vendor tersebut. Sikap Anda adalah...',
                'p1' => 'pengadaan komputer kantor', 'p2' => 'kegiatan outbound instansi', 'p3' => 'renovasi gedung pelayanan', 'p4' => 'penyediaan konsumsi pelatihan', 'p5' => 'pembuatan modul pembelajaran digital',
                'w1' => 'voucher belanja senilai jutaan rupiah sebagai tanda terima kasih',
                'w2' => 'fasilitas liburan gratis bersama keluarga setelah acara selesai',
                'w3' => 'persentase keuntungan (kickback) berupa uang tunai langsung',
                'w4' => 'perangkat elektronik terbaru (gadget) secara cuma-cuma',
                'w5' => 'dana sponsor pribadi yang diklaim sebagai hadiah persahabatan',
                'opts' => [
                    'Menerima tawaran tersebut karena tidak ada pihak yang dirugikan secara langsung.',
                    'Menolak dengan tegas tawaran tersebut dan memproses tender sesuai ketentuan yang berlaku.',
                    'Menerima hadiah tersebut tetapi tetap menyeleksi vendor secara objektif.',
                    'Melaporkan vendor tersebut kepada atasan untuk dimasukkan ke dalam daftar hitam (blacklist).',
                    'Meminta vendor menaikkan nilai hadiahnya sebelum Anda menyetujui kontrak kerja.'
                ],
                'benar' => 1,
                'sub' => 'TKP → Anti Korupsi'
            ]
        ];

        $generatedTkp = [];
        foreach ($tkpTemplates as $tpl) {
            for ($p = 1; $p <= 5; $p++) {
                for ($w = 1; $w <= 5; $w++) {
                    $qText = str_replace(
                        ['{proyek}', '{masalah}', '{layanan}', '{warga}', '{acara}', '{perbedaan}', '{kegiatan}', '{hadiah}'],
                        [$tpl['p'.$p], $tpl['w'.$w], $tpl['p'.$p], $tpl['w'.$w], $tpl['p'.$p], $tpl['w'.$w], $tpl['p'.$p], $tpl['w'.$w]],
                        $tpl['q']
                    );
                    $generatedTkp[] = [
                        'q' => $qText,
                        'kat' => $tpl['sub'],
                        'tipe' => 'pg',
                        'diff' => ['Mudah', 'Sedang', 'Sulit'][($p + $w) % 3],
                        'poin' => 5,
                        'opts' => $tpl['opts'],
                        'benar' => $tpl['benar']
                    ];
                }
            }
        }

        // Merge all original and programmatic questions
        $allQuestions = array_merge(
            $soalData,
            $twkQuestions,
            $tiuQuestions,
            $tiuNumerikGenerated,
            $tiuVerbalGenerated,
            $generatedTkp
        );

        foreach ($allQuestions as $s) {
            $catId = $categoryMap[$s['kat']] ?? \App\Models\Category::first()->id;

            $question = \App\Models\Question::create([
                'institution_id' => $institution->id,
                'category_id' => $catId,
                'type' => $s['tipe'] ?? 'pg',
                'difficulty' => $s['diff'] ?? 'Sedang',
                'points' => $s['poin'] ?? 5,
                'question_text' => $s['q'],
                'is_active' => true,
            ]);

            if (isset($s['opts'])) {
                foreach ($s['opts'] as $oIdx => $oVal) {
                    $isCorrect = false;
                    if (($s['tipe'] ?? 'pg') === 'pgk') {
                        $isCorrect = in_array($oIdx, $s['benar'] ?? []);
                    } else {
                        $isCorrect = ($s['benar'] ?? 0) === $oIdx;
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
            $inst = \App\Models\Institution::firstOrCreate(
                ['name' => $p['instansi']],
                ['slug' => \Illuminate\Support\Str::slug($p['instansi'])]
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

        // 9. Buat Default Exams
        $admin = User::where('role', 'admin')->first();
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

        foreach ($exams as $exam) {
            \App\Models\Exam::create([
                'institution_id' => $institution->id,
                'user_id' => $admin ? $admin->id : null,
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
                            'icon' => '📚',
                            'soal_count' => 30,
                            'duration' => 30,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ],
                        [
                            'title' => 'TIU — Tes Intelegensia Umum',
                            'icon' => '🔢',
                            'soal_count' => 35,
                            'duration' => 35,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ],
                        [
                            'title' => 'TKP — Tes Karakteristik Pribadi',
                            'icon' => '❤️',
                            'soal_count' => 45,
                            'duration' => 35,
                            'correct_points' => 5,
                            'incorrect_points' => 0,
                            'status' => 'aktif'
                        ]
                    ],
                    'participants' => []
                ]
            ]);
        }
    }
}
