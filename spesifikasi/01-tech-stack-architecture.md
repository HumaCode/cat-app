# CAT System — Tech Stack & Architecture

## Tech Stack

### Backend
- [ ] Laravel 11 (PHP 8.3+)
- [ ] MySQL 8.0 — Primary database
- [ ] Redis — Session, cache, queue
- [ ] Laravel Horizon — Queue worker & monitoring
- [ ] Laravel Sanctum — SPA authentication
- [ ] Laravel Echo + Pusher — Realtime WebSocket
- [ ] Spatie Laravel Permission — RBAC roles & permissions
- [ ] Spatie Laravel Media Library — File & media management
- [ ] Laravel Telescope — Debugging & monitoring (dev)
- [ ] Maatwebsite Excel — Import/export Excel

### Frontend
- [ ] React 19 + Inertia.js
- [ ] TypeScript — Type safety
- [ ] Zustand — Client state management
- [ ] TanStack Query (React Query) — Server state & caching
- [ ] Tailwind CSS v4 — Styling
- [ ] Shadcn/UI — Component library
- [ ] React Hook Form + Zod — Form validation
- [ ] Tiptap — Rich text editor (soal essay)
- [ ] DnD Kit — Drag & drop (soal puzzle/menjodohkan)
- [ ] Recharts — Grafik & analitik

### DevOps & Infrastructure
- [ ] Docker + Laravel Sail — Local development
- [ ] Nginx — Web server
- [ ] MinIO / AWS S3 — File storage (media soal)
- [ ] GitHub Actions — CI/CD pipeline
- [ ] Pest PHP — Unit & feature testing

---

## Arsitektur Sistem (Request Flow)

Pattern: **Route → Middleware → Controller → Service → Repository → Model**

```
React SPA (Inertia.js)
    │
    ▼
[ Middleware Layer ]
    ├── Auth (Sanctum)
    ├── Role & Permission (Spatie)
    ├── Rate Limiting
    └── Activity Logger
    │
    ▼
[ Controller ]         ← Thin: hanya validasi & delegasi
    │
    ▼
[ Service Layer ]      ← Business logic, orchestration
    │
    ▼
[ Repository Layer ]   ← Query abstraction via Interface
    │
    ▼
[ Model (Eloquent) ]
    │
    ▼
[ MySQL / Redis ]
    │
    ▼
[ Resource / ResponseHelper ]  ← JSON transform & standard response
    │
    ▼
React SPA (re-render via Inertia)
```

### Struktur Folder Laravel

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── Admin/
│   │   ├── Exam/
│   │   ├── Question/
│   │   └── Report/
│   ├── Middleware/
│   │   ├── CheckExamAccess.php
│   │   ├── CheckExamSession.php
│   │   └── LogActivity.php
│   └── Resources/
│       ├── ExamResource.php
│       ├── QuestionResource.php
│       └── SessionResource.php
├── Services/
│   ├── AuthService.php
│   ├── ExamService.php
│   ├── QuestionService.php
│   ├── SessionService.php
│   ├── ScoringService.php
│   └── ReportService.php
├── Repositories/
│   ├── Interfaces/
│   │   ├── ExamRepositoryInterface.php
│   │   ├── QuestionRepositoryInterface.php
│   │   └── SessionRepositoryInterface.php
│   ├── ExamRepository.php
│   ├── QuestionRepository.php
│   └── SessionRepository.php
├── Models/
│   ├── User.php
│   ├── Institution.php
│   ├── Question.php
│   ├── QuestionOption.php
│   ├── Exam.php
│   ├── ExamSession.php
│   ├── Answer.php
│   └── ActivityLog.php
├── Constants/
│   ├── ExamStatus.php
│   ├── QuestionType.php
│   └── RoleConstant.php
└── Helpers/
    └── ResponseHelper.php
```

### Standard Response (ResponseHelper)

```php
// Success
return ResponseHelper::success($data, 'Berhasil', 200);

// Error
return ResponseHelper::error('Tidak ditemukan', 404);

// Paginated
return ResponseHelper::paginate($data, new PaginateResource());
```

---

## Environment & Config Checklist

- [ ] Setup `.env` production variables
- [ ] Configure Redis connection
- [ ] Configure Pusher / Laravel Echo credentials
- [ ] Configure S3 / MinIO bucket
- [ ] Setup queue worker (Supervisor + Horizon)
- [ ] Configure mail driver (SMTP / Mailgun)
- [ ] Set APP_ENV, APP_DEBUG, APP_KEY
- [ ] Configure rate limiting di `RouteServiceProvider`
- [ ] Setup CORS untuk Inertia SPA
