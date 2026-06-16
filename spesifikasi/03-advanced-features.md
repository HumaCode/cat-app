# CAT System — Fitur Advanced & Spesial

---

## Realtime Features (Laravel Echo + Pusher)

- [ ] Timer ujian sinkron antara client dan server
- [ ] Auto-submit broadcast saat waktu ujian habis (server-side trigger)
- [ ] Dashboard pengawas: status peserta update realtime
- [ ] Notifikasi ke pengawas saat peserta melakukan pelanggaran
- [ ] Notifikasi ke peserta (pesan dari pengawas)
- [ ] Live progress: jumlah soal terjawab per peserta
- [ ] Counter peserta aktif di halaman ujian (Admin)

---

## PWA & Offline Support

- [ ] Service Worker untuk caching aset
- [ ] Manifest PWA (installable di mobile/desktop)
- [ ] Jawaban tersimpan di IndexedDB saat offline
- [ ] Sync jawaban ke server saat koneksi kembali
- [ ] Notifikasi sisa waktu ujian (push notification)
- [ ] Responsive UI untuk mobile (touch-friendly)
- [ ] Gesture navigasi soal (swipe kiri/kanan di mobile)

---

## Adaptive Testing (Fase 4)

> Difficulty soal berikutnya disesuaikan berdasarkan jawaban sebelumnya (Item Response Theory)

- [ ] Implementasi algoritma IRT (Item Response Theory)
- [ ] Pool soal dikategorikan per tingkat kesukaran
- [ ] Kalkulasi theta (kemampuan peserta) tiap jawaban
- [ ] Pemilihan soal berikutnya berdasarkan theta saat ini
- [ ] Tentukan stopping rule (jumlah soal / SE threshold)
- [ ] Hasil ujian adaptif: estimasi kemampuan + confidence interval

---

## AI Integration (Fase 4)

### Auto-grade Essay
- [ ] Integrasi dengan LLM API (OpenAI / Gemini / lokal)
- [ ] Prompt engineering untuk penilaian esai
- [ ] Skor saran dari AI (tetap bisa di-override manual)
- [ ] Highlight bagian esai yang relevan / tidak relevan
- [ ] Logging keputusan AI untuk audit

### Generate Soal dengan AI
- [ ] Input: topik, tipe soal, difficulty, jumlah soal
- [ ] AI generate soal + opsi jawaban + kunci + pembahasan
- [ ] Review & edit soal sebelum simpan ke bank soal
- [ ] Generate variasi soal dari soal yang sudah ada
- [ ] Generate soal dari teks / dokumen yang di-upload

### Analisis & Rekomendasi
- [ ] Analisis kelemahan peserta per topik/kategori
- [ ] Rekomendasi materi belajar berdasarkan hasil ujian
- [ ] Prediksi kelulusan berdasarkan riwayat latihan
- [ ] Chatbot assistant untuk peserta (tanya materi)

---

## Fitur Ujian CPNS Khusus

- [ ] Template ujian SKD (TWK 30 soal, TIU 35 soal, TKP 45 soal)
- [ ] Timer per sub-tes (navigasi antar sub-tes otomatis)
- [ ] Formula nilai TKP (skala 1–5, tidak ada nilai 0)
- [ ] Formula nilai TWK & TIU (benar +5, salah/kosong 0)
- [ ] Passing grade per sub-tes + passing grade total
- [ ] Ranking peserta per ujian
- [ ] Simulasi SKB (Seleksi Kompetensi Bidang)
- [ ] Countdown hari menuju ujian CPNS (info widget)

---

## Notifikasi & Email

- [ ] Email konfirmasi pendaftaran peserta ke ujian
- [ ] Email reminder H-1 dan H-hari ujian
- [ ] Email hasil ujian ke peserta (jika diizinkan)
- [ ] Email ke Admin saat ada pelanggaran berat
- [ ] Notifikasi in-app (bell icon) untuk semua role
- [ ] Queue-based email (tidak blocking, via Redis queue)

---

## Keamanan Tambahan

- [ ] Rate limiting per endpoint (login, submit jawaban)
- [ ] Token sesi ujian unik per peserta per attempt
- [ ] Enkripsi data jawaban di transit (HTTPS)
- [ ] Validasi waktu submit di server (bukan hanya client)
- [ ] Audit trail semua perubahan data soal & ujian
- [ ] Backup otomatis database terjadwal
- [ ] IP whitelist untuk akses Admin panel (opsional)
- [ ] Lockout akun setelah N kali gagal login

---

## Integrasi Eksternal (Opsional)

- [ ] SSO via Google OAuth
- [ ] SSO via Microsoft Azure AD
- [ ] Integrasi SIASN / sistem kepegawaian (untuk instansi pemerintah)
- [ ] Webhook event ke sistem eksternal (ujian selesai, hasil keluar)
- [ ] REST API publik untuk integrasi pihak ketiga
- [ ] API key management untuk consumer API
