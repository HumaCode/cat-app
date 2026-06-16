# CAT System — Roadmap Development

Estimasi total: **26–34 minggu** (solo developer, full-time)

---

## Fase 1 — MVP (± 8–10 minggu)

> Target: sistem bisa dipakai untuk ujian pilihan ganda dasar dari awal sampai akhir.

### Setup & Infrastruktur
- [ ] Init project Laravel 11 + React + Inertia.js + TypeScript
- [ ] Setup Docker / Laravel Sail
- [ ] Konfigurasi Tailwind CSS v4 + Shadcn/UI
- [ ] Setup Spatie Permission, Sanctum, Telescope
- [ ] Buat struktur folder (Service, Repository, Interface, Constants, ResponseHelper)
- [ ] Setup database MySQL + konfigurasi Redis
- [ ] CI/CD GitHub Actions (lint, test, deploy)
- [ ] Setup MinIO / S3 untuk file storage

### Auth & User
- [ ] Register & login peserta
- [ ] Login Admin
- [ ] Middleware auth + role guard
- [ ] CRUD user (Admin)
- [ ] Manajemen institusi (Super Admin)
- [ ] Halaman profil user

### Bank Soal — Dasar
- [ ] CRUD kategori soal (bertingkat)
- [ ] CRUD soal pilihan ganda (A–E, single answer)
- [ ] CRUD soal essay
- [ ] Upload gambar ke soal
- [ ] Set difficulty & poin soal
- [ ] List & filter soal di bank soal

### Ujian — Dasar
- [ ] Buat ujian (judul, durasi, passing grade)
- [ ] Pilih soal dari bank soal ke ujian
- [ ] Daftarkan peserta ke ujian
- [ ] Halaman pengerjaan ujian (PG + essay)
- [ ] Timer countdown (sinkron server)
- [ ] Auto-save jawaban (interval)
- [ ] Submit ujian (manual)
- [ ] Auto-submit saat waktu habis

### Penilaian & Hasil
- [ ] Skoring otomatis pilihan ganda
- [ ] Antrian penilaian essay (manual oleh Admin)
- [ ] Halaman hasil peserta (nilai, lulus/tidak)
- [ ] Daftar nilai semua peserta (Admin)
- [ ] Export nilai ke Excel (sederhana)

### Admin Panel — Dasar
- [ ] Dashboard ringkasan (total ujian, peserta, soal)
- [ ] Manajemen semua modul dasar via panel Admin

---

## Fase 2 — Advanced (± 6–8 minggu)

> Target: fitur lengkap untuk ujian profesional dan simulasi CPNS.

### Tipe Soal Lengkap
- [ ] Pilihan ganda kompleks (multiple answer)
- [ ] Benar / Salah (True/False)
- [ ] Isian singkat (short answer)
- [ ] Menjodohkan (drag-drop matching)
- [ ] Urutan / Puzzle (drag-drop ordering)
- [ ] Soal berbasis audio

### Bank Soal — Lanjutan
- [ ] Import soal massal dari Excel
- [ ] Export bank soal ke Excel
- [ ] Duplikat soal
- [ ] Statistik penggunaan soal
- [ ] Soft delete & restore soal

### Ujian — Lanjutan
- [ ] Seksi / sub-tes dalam satu ujian
- [ ] Timer per seksi + navigasi antar seksi
- [ ] Randomisasi soal & opsi per peserta
- [ ] Generasi paket soal otomatis dari pool
- [ ] Template ujian CPNS SKD (TWK/TIU/TKP)
- [ ] Formula nilai TKP (skala 1–5)
- [ ] Import peserta massal via Excel
- [ ] Kode akses / token per peserta
- [ ] Halaman review jawaban sebelum submit
- [ ] Flag / bookmark soal

### Anti-cheat Dasar
- [ ] Fullscreen lockdown mode
- [ ] Deteksi tab switching (blur event) + peringatan
- [ ] Disable right-click & copy-paste
- [ ] Log aktivitas peserta ke database
- [ ] Token sesi ujian unik per attempt

### Laporan Lanjutan
- [ ] Distribusi nilai (grafik)
- [ ] Analisis per soal (% benar/salah/skip)
- [ ] Breakdown nilai per seksi/kategori
- [ ] Ranking peserta per ujian
- [ ] Export kartu hasil peserta ke PDF
- [ ] Export rekap ujian ke PDF

### Notifikasi
- [ ] Email reminder ujian (H-1 & hari-H)
- [ ] Email hasil ujian ke peserta
- [ ] Queue-based email via Redis

---

## Fase 3 — Pro (± 6–8 minggu)

> Target: sistem siap produksi skala besar, proctoring aktif, multi-tenant penuh.

### Proctoring Webcam
- [ ] Akses kamera peserta saat ujian dimulai
- [ ] Snapshot berkala (setiap N menit)
- [ ] Deteksi wajah (face-api.js atau API eksternal)
- [ ] Peringatan + log jika wajah tidak terdeteksi
- [ ] Simpan snapshot ke S3/MinIO
- [ ] Halaman review foto oleh Pengawas

### Monitoring Realtime
- [ ] Dashboard Pengawas: peserta online realtime (Echo/Pusher)
- [ ] Status per peserta: mengerjakan / idle / selesai
- [ ] Progress soal tiap peserta (jumlah terjawab)
- [ ] Paksa submit peserta dari dashboard Pengawas
- [ ] Kirim pesan/notifikasi ke peserta tertentu
- [ ] Flag peserta dengan banyak pelanggaran

### Analitik Soal (Item Analysis)
- [ ] Tingkat kesukaran empiris per soal
- [ ] Daya beda soal (point-biserial)
- [ ] Distribusi pilihan opsi (distractor analysis)
- [ ] Rekomendasi soal yang perlu direvisi

### Multi-Tenant Penuh
- [ ] Setiap institusi punya domain/subdomain sendiri (opsional)
- [ ] Quota soal & ujian per institusi (billing-ready)
- [ ] Super Admin bisa impersonate Admin institusi
- [ ] Log audit lintas institusi

### PWA & Mobile
- [ ] Service Worker + manifest PWA
- [ ] Jawaban tersimpan lokal (IndexedDB) saat offline
- [ ] Sync ke server saat koneksi kembali
- [ ] UI mobile responsif + gesture navigasi soal
- [ ] Push notification (sisa waktu ujian)

### Performa & Skalabilitas
- [ ] Query optimization + proper indexing
- [ ] Redis caching untuk data statis (soal, kategori)
- [ ] Horizon queue worker tuning
- [ ] Load testing (k6 / Locust)
- [ ] Pagination & lazy loading di semua list

---

## Fase 4 — AI & Intelligence (± 6–8 minggu)

> Target: sistem cerdas yang bisa generate soal, nilai essay, dan beri rekomendasi.

### Auto-grade Essay (AI)
- [ ] Integrasi LLM API (OpenAI GPT / Gemini / lokal Ollama)
- [ ] Sistem prompt untuk penilaian esai per mata pelajaran
- [ ] Skor saran AI + override manual oleh penilai
- [ ] Highlight bagian esai relevan / tidak relevan
- [ ] Logging keputusan AI untuk audit & review

### Generate Soal dengan AI
- [ ] Form generate soal: topik, tipe, difficulty, jumlah
- [ ] AI generate soal + opsi + kunci + pembahasan
- [ ] Review & edit sebelum simpan ke bank soal
- [ ] Generate variasi soal dari soal existing
- [ ] Generate soal dari dokumen yang di-upload (PDF/DOCX)

### Adaptive Testing (IRT)
- [ ] Implementasi algoritma IRT (3PL model)
- [ ] Kalkulasi theta (kemampuan peserta) tiap jawaban
- [ ] Pemilihan soal berikutnya berdasarkan theta
- [ ] Stopping rule (jumlah soal / standard error threshold)
- [ ] Laporan hasil adaptif: estimasi kemampuan + CI

### Rekomendasi Belajar
- [ ] Analisis kelemahan per topik/kategori dari riwayat ujian
- [ ] Rekomendasi materi/video belajar berdasarkan kelemahan
- [ ] Prediksi kelulusan dari pola latihan
- [ ] Learning path otomatis untuk peserta

### Integrasi Eksternal
- [ ] SSO Google OAuth
- [ ] SSO Microsoft Azure AD
- [ ] REST API publik + API key management
- [ ] Webhook event (ujian selesai, nilai keluar)
- [ ] Dokumentasi API (Swagger / Scribe)
