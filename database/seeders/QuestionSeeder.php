<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Institution;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
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

        // Get users to own the questions
        $admins = User::whereIn('role', ['dev', 'admin'])->pluck('id')->toArray();
        if (empty($admins)) {
            $admins = [User::first()->id];
        }

        // Mapping categories parent_name -> child_name to child_id
        $categoryMap = [];
        $children = Category::whereNotNull('parent_id')->with('parent')->get();
        foreach ($children as $child) {
            $key = $child->parent->name . ' → ' . $child->name;
            $categoryMap[$key] = $child->id;
        }

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
                'kat' => 'Diklat & Kompetensi → Kompetensi IT',
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

        $twkQuestions = [
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
            $catId = $categoryMap[$s['kat']] ?? Category::first()->id;

            $question = Question::create([
                'institution_id' => $institution->id,
                'user_id'        => $admins[array_rand($admins)],
                'category_id'    => $catId,
                'type'           => $s['tipe'] ?? 'pg',
                'difficulty'     => $s['diff'] ?? 'Sedang',
                'points'         => $s['poin'] ?? 5,
                'question_text'  => $s['q'],
                'is_active'      => $s['aktif'] ?? true,
            ]);

            if (isset($s['opts'])) {
                foreach ($s['opts'] as $oIdx => $oVal) {
                    $isCorrect = false;
                    if (($s['tipe'] ?? 'pg') === 'pgk') {
                        $isCorrect = in_array($oIdx, $s['benar'] ?? []);
                    } else {
                        $isCorrect = ($s['benar'] ?? 0) === $oIdx;
                    }

                    QuestionOption::create([
                        'question_id'  => $question->id,
                        'option_text'  => $oVal,
                        'is_correct'   => $isCorrect,
                        'order_column' => $oIdx,
                    ]);
                }
            }
        }
    }
}
