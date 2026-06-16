# CAT System — Project Documentation

Sistem Computer Assisted Test (CAT) untuk ujian online, simulasi CPNS, dan bank soal.
Stack: **Laravel 11 + React 19 (Inertia.js) + MySQL + Redis**

---

## Daftar Dokumen

| File | Isi |
|------|-----|
| `01-tech-stack-architecture.md` | Tech stack, request flow, struktur folder |
| `02-modules.md` | Modul utama: Auth, Bank Soal, Ujian, Penilaian, Proctoring |
| `03-advanced-features.md` | Fitur advanced: Realtime, PWA, AI, CPNS khusus |
| `04-roadmap.md` | Roadmap 4 fase dengan checklist per fitur |
| `05-database-schema.md` | Skema database lengkap + migration checklist |

---

## Progress Summary

Tandai `[x]` di setiap checklist saat fitur selesai diimplementasikan.

### Fase saat ini
- [ ] Fase 1 — MVP (target: ~8–10 minggu)
- [ ] Fase 2 — Advanced
- [ ] Fase 3 — Pro
- [ ] Fase 4 — AI & Intelligence

---

## Konvensi Kode

- Pattern: `Route → Middleware → Controller → Service → Repository → Model`
- Response: selalu gunakan `ResponseHelper::success()` / `ResponseHelper::error()`
- Semua business logic di **Service layer**, bukan Controller
- Semua query Eloquent di **Repository layer** via Interface
- Konstanta (status, enum, role) di folder `app/Constants/`
- Tipe soal, status sesi, event log → gunakan PHP Enum (Laravel 11)
