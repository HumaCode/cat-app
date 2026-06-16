# CAT System — Modul Utama Sistem

---

## Modul 1: Auth & User Management

### Authentication
- [ ] Register & login (email + password)
- [ ] Login dengan kode peserta (token-based, tanpa email)
- [ ] Logout & invalidate session
- [ ] Forgot password / reset via email
- [ ] Remember me token
- [ ] 2FA optional (TOTP / email OTP)

### Role & Permission (RBAC)
- [ ] Role: Super Admin
- [ ] Role: Admin Institusi
- [ ] Role: Pembuat Soal (Question Master)
- [ ] Role: Pengawas (Proctor)
- [ ] Role: Peserta (Participant)
- [ ] Permission granular per modul (CRUD)
- [ ] Middleware guard per route

### Manajemen User
- [ ] CRUD user oleh Admin
- [ ] Assign role ke user
- [ ] Nonaktifkan / aktifkan user
- [ ] Import peserta massal via Excel
- [ ] Reset password oleh Admin
- [ ] Profile & avatar peserta

### Multi-Tenant (Institusi)
- [ ] CRUD institusi oleh Super Admin
- [ ] Setiap data (soal, ujian, peserta) ter-scope per institusi
- [ ] Admin hanya bisa akses data institusinya sendiri

---

## Modul 2: Bank Soal (Question Bank)

### Kategori Soal
- [ ] Kategori bertingkat (parent-child, unlimited level)
- [ ] Contoh: Mapel → Topik → Sub-topik
- [ ] Contoh CPNS: TWK → Nasionalisme → Pancasila
- [ ] CRUD kategori
- [ ] Reorder urutan kategori

### Manajemen Soal
- [ ] Buat soal baru (semua tipe)
- [ ] Edit soal
- [ ] Hapus soal (soft delete)
- [ ] Duplikat soal
- [ ] Preview soal sebelum publish
- [ ] Set status aktif/nonaktif soal
- [ ] Tag difficulty: Mudah / Sedang / Sulit
- [ ] Tag level Bloom's Taxonomy (C1–C6)
- [ ] Set poin default per soal

### Tipe Soal
- [ ] Pilihan ganda (single answer, opsi A–E)
- [ ] Pilihan ganda kompleks (multiple answer)
- [ ] Essay (rich text, penilaian manual)
- [ ] Benar / Salah (True/False)
- [ ] Isian singkat (short answer, exact match)
- [ ] Menjodohkan (drag-drop matching, pasangan kiri-kanan)
- [ ] Urutan (drag-drop ordering, susun langkah)
- [ ] Soal berbasis gambar (image embedded)
- [ ] Soal berbasis audio (listening)
- [ ] Soal berbasis video

### Media Soal
- [ ] Upload gambar ke soal / opsi jawaban
- [ ] Upload audio (MP3/WAV) ke soal
- [ ] Upload video (MP4) ke soal
- [ ] Preview media di editor soal
- [ ] Storage via S3/MinIO

### Import & Export
- [ ] Template Excel untuk import soal massal
- [ ] Import soal dari Excel (validasi per baris)
- [ ] Export bank soal ke Excel
- [ ] Import soal dari format Aiken (.txt)
- [ ] Export soal ke PDF (untuk arsip)

### Statistik Soal
- [ ] Total pemakaian soal di berbagai ujian
- [ ] Tingkat kesukaran empiris (dari hasil ujian)
- [ ] Daya beda soal
- [ ] Persentase jawaban benar

---

## Modul 3: Manajemen Ujian

### Template & Pengaturan Ujian
- [ ] Buat ujian baru
- [ ] Judul, deskripsi, instruksi ujian
- [ ] Tipe ujian: Latihan / Simulasi / Resmi
- [ ] Durasi total ujian (menit)
- [ ] Passing grade (nilai minimum lulus)
- [ ] Batas maksimal percobaan (attempt)
- [ ] Toggle: acak urutan soal
- [ ] Toggle: acak urutan opsi jawaban
- [ ] Toggle: tampilkan hasil setelah submit
- [ ] Toggle: tampilkan kunci jawaban & pembahasan
- [ ] Jadwal: tanggal & jam mulai–selesai window

### Seksi / Sub-tes (untuk CPNS dll)
- [ ] Buat seksi dalam satu ujian (misal TWK, TIU, TKP)
- [ ] Durasi per seksi
- [ ] Jumlah soal per seksi
- [ ] Kategori soal per seksi
- [ ] Poin per seksi (bobot nilai berbeda)
- [ ] Navigasi antar seksi

### Paket Soal
- [ ] Pilih soal dari bank soal ke paket ujian
- [ ] Override poin per soal dalam paket
- [ ] Set jumlah soal yang ditampilkan (dari pool lebih besar)
- [ ] Generasi soal otomatis dari kategori + difficulty
- [ ] Setiap peserta dapat paket soal acak yang berbeda

### Peserta Ujian
- [ ] Daftarkan peserta ke ujian (satu per satu)
- [ ] Import peserta massal via Excel
- [ ] Generate kode akses / token per peserta
- [ ] Batasi akses hanya peserta terdaftar
- [ ] Akses ujian publik (tanpa pendaftaran)

### Pelaksanaan Ujian (runtime)
- [ ] Halaman ujian fullscreen
- [ ] Timer countdown (sinkronisasi dengan server)
- [ ] Navigasi antar soal (panel nomor soal)
- [ ] Tandai soal (flag/bookmark untuk review)
- [ ] Auto-save jawaban setiap X detik
- [ ] Auto-submit saat waktu habis
- [ ] Submit manual dengan konfirmasi
- [ ] Halaman review jawaban sebelum submit
- [ ] Reconnect otomatis jika koneksi putus (jawaban tersimpan lokal)

---

## Modul 4: Penilaian & Hasil

### Skoring Otomatis
- [ ] Skoring otomatis pilihan ganda (benar/salah)
- [ ] Skoring otomatis true/false
- [ ] Skoring otomatis isian singkat (exact/fuzzy match)
- [ ] Penilaian manual essay oleh Pengawas/Admin
- [ ] Partial score untuk pilihan ganda kompleks
- [ ] Formula skor negatif (opsional, untuk CPNS TKP)

### Hasil Peserta
- [ ] Halaman hasil setelah submit
- [ ] Total nilai & status lulus/tidak
- [ ] Breakdown nilai per seksi / kategori
- [ ] Pembahasan soal (jika diizinkan)
- [ ] Waktu pengerjaan total & per soal
- [ ] Riwayat percobaan (attempt history)

### Laporan & Analitik
- [ ] Dashboard nilai real-time (Admin/Pengawas)
- [ ] Daftar nilai semua peserta per ujian
- [ ] Distribusi nilai (grafik histogram)
- [ ] Rata-rata, median, nilai tertinggi/terendah
- [ ] Persentase kelulusan
- [ ] Analisis per soal: % benar, % salah, % skip
- [ ] Analisis butir soal (item analysis)
- [ ] Export hasil ke Excel
- [ ] Export kartu hasil peserta ke PDF
- [ ] Export rekap nilai ke PDF

---

## Modul 5: Pengawasan (Proctoring)

### Lockdown Browser
- [ ] Fullscreen mode wajib saat ujian
- [ ] Deteksi tab switching (blur event)
- [ ] Deteksi window resize / minimize
- [ ] Disable right-click
- [ ] Disable copy-paste (keyboard shortcut)
- [ ] Disable developer tools (F12)
- [ ] Peringatan otomatis saat pelanggaran
- [ ] Auto-submit setelah N kali pelanggaran

### Activity Logging
- [ ] Log setiap event: tab_blur, paste_attempt, fullscreen_exit, dll.
- [ ] Timestamp & metadata tiap event
- [ ] Dashboard log aktivitas per peserta (Admin/Pengawas)
- [ ] Flag peserta dengan aktivitas mencurigakan

### Webcam Proctoring (Fase 3)
- [ ] Akses kamera saat ujian dimulai
- [ ] Snapshot berkala (setiap X menit)
- [ ] Deteksi wajah (face present/absent)
- [ ] Peringatan jika wajah tidak terdeteksi
- [ ] Simpan snapshot ke storage
- [ ] Review foto oleh Pengawas

### Monitoring Realtime (Fase 3)
- [ ] Dashboard Pengawas: daftar peserta online
- [ ] Status per peserta: mengerjakan / idle / selesai
- [ ] Lihat progress soal tiap peserta
- [ ] Paksa submit peserta tertentu
- [ ] Kirim notifikasi/pesan ke peserta tertentu
- [ ] Notifikasi jika ada peserta dengan banyak pelanggaran
