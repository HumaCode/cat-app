import { useState, useEffect, FormEvent, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import '../../../css/bank-soal.css'; // Shared CSS
import '../../../css/peserta.css'; // Page-specific CSS

// Partials
import ParticipantTable from './Partials/ParticipantTable';
import ParticipantFormModal from './Partials/ParticipantFormModal';
import DetailDrawer, { ParticipantItem } from './Partials/DetailDrawer';
import TokenModal from './Partials/TokenModal';
import ImportModal from './Partials/ImportModal';
import RegisterExamModal from './Partials/RegisterExamModal';
import ConfirmDeleteModal from '../Kategori/Partials/ConfirmDeleteModal';

interface PaginatedParticipants {
    data: ParticipantItem[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface IndexProps {
    participants: PaginatedParticipants;
    stats: {
        total: number;
        aktif: number;
        nonaktif: number;
        pending: number;
        perlu_validasi: number;
    };
    exams: string[];
    departments: string[];
    filters: {
        status?: string;
        ujian?: string;
        instansi?: string;
        sort?: string;
        search?: string;
        per_page?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function PesertaIndex() {
    const {
        participants = { data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0, links: [] },
        stats = { total: 0, aktif: 0, nonaktif: 0, pending: 0, perlu_validasi: 0 },
        exams = [],
        departments = [],
        filters = {},
        flash = {}
    } = (usePage<any>().props || {}) as unknown as IndexProps;

    // Toast State
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Modal & Drawer States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formTarget, setFormTarget] = useState<ParticipantItem | null>(null);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerTarget, setDrawerTarget] = useState<ParticipantItem | null>(null);

    const [isTokenOpen, setIsTokenOpen] = useState(false);
    const [tokenVal, setTokenVal] = useState('');
    const [tokenName, setTokenName] = useState('');

    const [isImportOpen, setIsImportOpen] = useState(false);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerTargets, setRegisterTargets] = useState<ParticipantItem[]>([]);

    const [deleteTarget, setDeleteTarget] = useState<ParticipantItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);


    // Filter states with defensive type checking to handle PHP serialization quirks (e.g., empty associative array serializing to JS array where filters.sort is a function)
    const [searchVal, setSearchVal] = useState(typeof filters?.search === 'string' ? filters.search : '');
    const [localSearch, setLocalSearch] = useState(typeof filters?.search === 'string' ? filters.search : '');
    const [statusFilter, setStatusFilter] = useState(typeof filters?.status === 'string' ? filters.status : 'all');
    const [ujianFilter, setUjianFilter] = useState(typeof filters?.ujian === 'string' ? filters.ujian : 'all');
    const [instansiFilter, setInstansiFilter] = useState(typeof filters?.instansi === 'string' ? filters.instansi : 'all');
    const [sortFilter, setSortFilter] = useState(typeof filters?.sort === 'string' ? filters.sort : 'newest');

    // Selection states
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Prepare search select options
    const ujianOptions = [
        { value: 'all', label: 'Semua Ujian' },
        ...exams.map((ex: string) => ({ value: ex, label: ex }))
    ];
    if (!exams.includes('SKD CPNS 2025 — Paket A')) {
        ujianOptions.push({ value: 'SKD CPNS 2025 — Paket A', label: 'SKD CPNS 2025 — Paket A' });
    }
    if (!exams.includes('TKD PPPK Guru Batch 2')) {
        ujianOptions.push({ value: 'TKD PPPK Guru Batch 2', label: 'TKD PPPK Guru Batch 2' });
    }

    const instansiOptions = [
        { value: 'all', label: 'Semua Instansi' },
        ...departments.map((dep: string) => ({ value: dep, label: dep }))
    ];

    // Handle session flashes
    useEffect(() => {
        if (flash?.success) showToast(flash.success, 'success');
        if (flash?.error) showToast(flash.error, 'error');
    }, [flash]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    };

    // Filter updates
    const applyFilters = (newFilters: Record<string, string>) => {
        const queryParams = {
            search: newFilters.search !== undefined ? newFilters.search : searchVal,
            status: newFilters.status !== undefined ? newFilters.status : statusFilter,
            ujian: newFilters.ujian !== undefined ? newFilters.ujian : ujianFilter,
            instansi: newFilters.instansi !== undefined ? newFilters.instansi : instansiFilter,
            sort: newFilters.sort !== undefined ? newFilters.sort : sortFilter,
        };

        // Remove empty filters
        Object.keys(queryParams).forEach((key) => {
            if (!queryParams[key as keyof typeof queryParams]) {
                delete queryParams[key as keyof typeof queryParams];
            }
        });

        router.get(route('peserta.index'), queryParams, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearchVal(localSearch);
        applyFilters({ search: localSearch });
    };

    // Debounce typing in the search bar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== (filters?.search || '')) {
                setSearchVal(localSearch);
                applyFilters({ search: localSearch });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    // Keep local search and query filters synced when they change
    useEffect(() => {
        const currentSearch = typeof filters?.search === 'string' ? filters.search : '';
        setSearchVal(currentSearch);
        setLocalSearch(currentSearch);
    }, [filters?.search]);

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        applyFilters({ status });
    };

    const handleResetFilters = () => {
        setSearchVal('');
        setLocalSearch('');
        setStatusFilter('all');
        setUjianFilter('all');
        setInstansiFilter('all');
        setSortFilter('newest');

        router.get(route('peserta.index'), {}, {
            preserveState: false,
        });
    };

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(participants.data.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((item) => item !== id));
        }
    };

    // CRUD/Action triggers
    const openAddParticipant = () => {
        setFormTarget(null);
        setIsFormOpen(true);
    };

    const openEditParticipant = (participant: ParticipantItem) => {
        setFormTarget(participant);
        setIsFormOpen(true);
    };

    const openDetailDrawer = (participant: ParticipantItem) => {
        setDrawerTarget(participant);
        setIsDrawerOpen(true);
    };

    const openRegisterExamSingle = (participant: ParticipantItem) => {
        setRegisterTargets([participant]);
        setSelectedIds([]); // Clear multi-select to avoid bulk confusion
        setIsRegisterOpen(true);
    };

    const openRegisterExamBulk = () => {
        const targets = participants.data.filter((p) => selectedIds.includes(p.id));
        setRegisterTargets(targets);
        setIsRegisterOpen(true);
    };

    const openDeleteSingle = (participant: ParticipantItem) => {
        setDeleteTarget(participant);
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route('peserta.destroy', { id: deleteTarget.id }), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
                showToast('Peserta berhasil dihapus.', 'success');
            },
        });
    };

    // Bulk actions
    const handleBulkStatusChange = (status: 'aktif' | 'nonaktif' | 'pending') => {
        router.post(
            route('peserta.bulk'),
            {
                action: 'status',
                ids: selectedIds,
                status,
            },
            {
                onSuccess: () => {
                    showToast(`Status ${selectedIds.length} peserta diperbarui.`, 'success');
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleBulkDelete = () => {
        setShowBulkDeleteConfirm(true);
    };

    const handleBulkDeleteConfirm = () => {
        setIsBulkDeleting(true);
        router.post(
            route('peserta.bulk'),
            {
                action: 'delete',
                ids: selectedIds,
            },
            {
                onSuccess: () => {
                    showToast(`${selectedIds.length} peserta berhasil dihapus.`, 'success');
                    setSelectedIds([]);
                    setShowBulkDeleteConfirm(false);
                },
                onFinish: () => {
                    setIsBulkDeleting(false);
                }
            }
        );
    };

    // Check if filters are dirty
    const isFiltered =
        searchVal !== '' ||
        statusFilter !== 'all' ||
        ujianFilter !== 'all' ||
        instansiFilter !== 'all' ||
        sortFilter !== 'newest';

    return (
        <AuthenticatedLayout title="Manajemen Peserta">
            <Head title="Manajemen Peserta - CAT System" />

            <div className="main-inner">
                {/* Page Header Card with Card-based Breadcrumb */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap">
                            <i className="bi bi-people-fill" />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Manajemen <span>Peserta CAT</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '3px 0 0' }}>
                                Kelola registrasi, ujian, kode akses, dan riwayat peserta ujian.
                            </p>
                        </div>
                    </div>
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('dashboard'))}>
                            <i className="bi bi-house-door-fill bc-home-icon" />
                            <span>Dashboard</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <span className="bc-item bc-active">Peserta</span>
                    </nav>
                </div>

                {/* KPI Strip */}
                <div className="kpi-strip anim-in d1">
                    <div className="kpi-mini" style={{ '--clr': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as any}>
                        <div className="kpi-mini-icon">👥</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Total Peserta</div>
                            <div className="kpi-mini-num">{stats.total}</div>
                            <div className="kpi-mini-sub">Terdaftar sistem</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as any}>
                        <div className="kpi-mini-icon">⚡</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Status Aktif</div>
                            <div className="kpi-mini-num">{stats.aktif}</div>
                            <div className="kpi-mini-sub">Bisa masuk ujian</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--amber)', '--clr-s': 'var(--amber-s)' } as any}>
                        <div className="kpi-mini-icon">⏳</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Pending / Baru</div>
                            <div className="kpi-mini-num">{stats.pending}</div>
                            <div className="kpi-mini-sub">Menunggu verifikasi</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--rose)', '--clr-s': 'var(--rose-s)' } as any}>
                        <div className="kpi-mini-icon">⛔</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Nonaktif</div>
                            <div className="kpi-mini-num">{stats.nonaktif}</div>
                            <div className="kpi-mini-sub">Akses ditutup</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--sky)', '--clr-s': 'var(--sky-s)' } as any}>
                        <div className="kpi-mini-icon">⚠️</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Perlu Validasi</div>
                            <div className="kpi-mini-num">{stats.perlu_validasi}</div>
                            <div className="kpi-mini-sub">Profil belum lengkap</div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="filter-bar anim-in d1">
                    <div className="tab-pills">
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('all')}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'aktif' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('aktif')}
                        >
                            Aktif <span className="pill-count">{stats.aktif}</span>
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'nonaktif' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('nonaktif')}
                        >
                            Nonaktif <span className="pill-count">{stats.nonaktif}</span>
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('pending')}
                        >
                            Pending <span className="pill-count">{stats.pending}</span>
                        </button>
                    </div>

                    <div className="fdiv"></div>

                    {/* Ujian Filter */}
                    <SearchableSelect
                        value={ujianFilter}
                        onChange={(val) => {
                            setUjianFilter(val);
                            applyFilters({ ujian: val });
                        }}
                        placeholder="Semua Ujian"
                        options={ujianOptions}
                    />

                    {/* Instansi Filter */}
                    <SearchableSelect
                        value={instansiFilter}
                        onChange={(val) => {
                            setInstansiFilter(val);
                            applyFilters({ instansi: val });
                        }}
                        placeholder="Semua Instansi"
                        options={instansiOptions}
                    />

                    {/* Sorting Filter */}
                    <select
                        className="fsel"
                        value={sortFilter}
                        onChange={(e) => {
                            setSortFilter(e.target.value);
                            applyFilters({ sort: e.target.value });
                        }}
                    >
                        <option value="newest">Terbaru</option>
                        <option value="name_asc">Nama (A-Z)</option>
                        <option value="nilai_desc">Nilai Tertinggi</option>
                        <option value="ujian_desc">Ujian Terbanyak</option>
                    </select>

                    {/* Reset Button (placed next to Terbaru/sorting filter) */}
                    {isFiltered && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleResetFilters}
                            style={{
                                height: '32px',
                                padding: '0 12px',
                                fontSize: '12.5px',
                                border: '1px solid #f43f5e',
                                color: '#f43f5e',
                                background: 'transparent',
                                borderRadius: 'var(--r-xs)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#fff1f2';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            ✕ Reset Filter
                        </button>
                    )}

                    <div className="fspacer"></div>

                    {/* Search Field */}
                    <form onSubmit={handleSearchSubmit}>
                        <div className="fsearch">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="Cari nama, email, nip..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                style={{ outline: 'none', boxShadow: 'none', border: 'none', background: 'transparent' }}
                            />
                        </div>
                    </form>
                </div>

                {/* Bulk Action Panel (Shows only when checkbox is selected) */}
                {selectedIds.length > 0 && (
                    <div className="bulk-bar anim-in">
                        <span className="bulk-count">⚡ {selectedIds.length} peserta terpilih</span>
                        <div className="bulk-actions">
                            <button type="button" className="bulk-btn white" onClick={openRegisterExamBulk}>
                                <i className="bi bi-clipboard-check" style={{ marginRight: '6px' }} /> Daftarkan ke Ujian
                            </button>
                            <button type="button" className="bulk-btn light" onClick={() => handleBulkStatusChange('aktif')}>
                                <i className="bi bi-check-lg" style={{ marginRight: '6px' }} /> Aktifkan
                            </button>
                            <button type="button" className="bulk-btn light" onClick={() => handleBulkStatusChange('nonaktif')}>
                                <i className="bi bi-dash-circle" style={{ marginRight: '6px' }} /> Nonaktifkan
                            </button>
                            <button type="button" className="bulk-btn danger-b" onClick={handleBulkDelete}>
                                <i className="bi bi-trash3" style={{ marginRight: '6px' }} /> Hapus
                            </button>
                            <button type="button" className="bulk-btn light" onClick={() => setSelectedIds([])}>
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="table-card anim-in d2">
                    <div className="table-card-head">
                        <div>
                            <h4 className="tc-title">Daftar Peserta CAT</h4>
                            <p className="tc-sub">Total {participants.total} peserta cocok dengan kriteria filter.</p>
                        </div>
                        <div className="header-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsImportOpen(true)}>
                                <i className="bi bi-download"></i> Import Excel
                            </button>
                            <button type="button" className="btn-primary" onClick={openAddParticipant}>
                                <i className="bi bi-plus-lg"></i> Tambah Peserta
                            </button>
                        </div>
                    </div>

                    <ParticipantTable
                        participants={participants.data}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectOne={handleSelectOne}
                        onViewDetail={openDetailDrawer}
                        onEdit={openEditParticipant}
                        onDelete={openDeleteSingle}
                        onRegisterExam={openRegisterExamSingle}
                    />

                    {/* Pagination Footer */}
                    {participants.last_page > 1 && (
                        <div className="pagination">
                            <div className="pg-info">
                                Menampilkan <strong>{participants.from}</strong> - <strong>{participants.to}</strong> dari{' '}
                                <strong>{participants.total}</strong> peserta
                            </div>
                            <div className="pg-controls">
                                {(() => {
                                    const currentPage = participants.current_page;
                                    const lastPage = participants.last_page || 1;
                                    const links = participants.links;
                                    
                                    const prevLink = links.find(l => l.label.includes('Previous'));
                                    const nextLink = links.find(l => l.label.includes('Next'));
                                    
                                    const getUrlForPage = (pageNum: number) => {
                                        const found = links.find(l => l.label === String(pageNum));
                                        if (found) return found.url;
                                        const anyUrl = links.find(l => l.url !== null)?.url;
                                        if (anyUrl) {
                                            try {
                                                const urlObj = new URL(anyUrl);
                                                urlObj.searchParams.set('page', String(pageNum));
                                                return urlObj.toString();
                                            } catch (e) {
                                                return null;
                                            }
                                        }
                                        return null;
                                    };

                                    const pages = [];
                                    
                                    // Previous
                                    pages.push({
                                        label: '« Sblm',
                                        url: prevLink ? prevLink.url : null,
                                        active: false,
                                        wide: true
                                    });

                                    let start = Math.max(1, currentPage - 2);
                                    let end = Math.min(lastPage, currentPage + 2);

                                    if (end - start + 1 < 5) {
                                        if (start === 1) {
                                            end = Math.min(lastPage, start + 4);
                                        } else if (end === lastPage) {
                                            start = Math.max(1, end - 4);
                                        }
                                    }

                                    if (start > 1) {
                                        pages.push({ label: '1', url: getUrlForPage(1), active: currentPage === 1 });
                                        if (start > 2) {
                                            pages.push({ label: '...', url: null, active: false });
                                        }
                                    }

                                    for (let i = start; i <= end; i++) {
                                        pages.push({ label: String(i), url: getUrlForPage(i), active: currentPage === i });
                                    }

                                    if (end < lastPage) {
                                        if (end < lastPage - 1) {
                                            pages.push({ label: '...', url: null, active: false });
                                        }
                                        pages.push({ label: String(lastPage), url: getUrlForPage(lastPage), active: currentPage === lastPage });
                                    }

                                    // Next
                                    pages.push({
                                        label: 'Sldt »',
                                        url: nextLink ? nextLink.url : null,
                                        active: false,
                                        wide: true
                                    });

                                    return pages.map((link, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!link.url}
                                            className={`pg-btn ${link.active ? 'active' : ''} ${link.wide ? 'wide' : ''}`}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url, {}, { preserveState: true });
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </button>
                                    ));
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals and Drawers */}
            <ParticipantFormModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setFormTarget(null);
                }}
                editParticipant={formTarget}
                exams={exams}
                showToast={showToast}
            />

            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setDrawerTarget(null);
                }}
                participant={drawerTarget}
            />

            <TokenModal
                isOpen={isTokenOpen}
                onClose={() => setIsTokenOpen(false)}
                token={tokenVal}
                participantName={tokenName}
            />

            <ImportModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                exams={exams}
                showToast={showToast}
            />

            <RegisterExamModal
                isOpen={isRegisterOpen}
                onClose={() => {
                    setIsRegisterOpen(false);
                    setRegisterTargets([]);
                }}
                participants={registerTargets}
                selectedIds={selectedIds}
                exams={exams}
                showToast={showToast}
            />

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title="Hapus Peserta?"
                message={`Peserta "${deleteTarget?.name}" akan dihapus secara permanen beserta semua data riwayat ujiannya.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                isLoading={isDeleting}
            />

            <ConfirmDeleteModal
                isOpen={showBulkDeleteConfirm}
                title={`Hapus ${selectedIds.length} Peserta?`}
                message={`Apakah Anda yakin ingin menghapus ${selectedIds.length} peserta terpilih secara permanen beserta semua data riwayat ujiannya?`}
                onConfirm={handleBulkDeleteConfirm}
                onCancel={() => setShowBulkDeleteConfirm(false)}
                isLoading={isBulkDeleting}
            />

            {/* Toast Notifications */}
            <div className={`dynamic-island-toast-container ${toast.show ? 'show' : ''}`}>
                <style>{`
                    .dynamic-island-toast-container {
                        position: fixed;
                        bottom: 30px;
                        left: 50%;
                        transform: translateX(-50%) translateY(100px);
                        z-index: 9999;
                        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        pointer-events: none;
                    }
                    .dynamic-island-toast-container.show {
                        transform: translateX(-50%) translateY(0);
                    }
                    .dynamic-island-toast {
                        background: #111827;
                        color: #fff;
                        padding: 10px 18px;
                        border-radius: 30px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        pointer-events: auto;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                    }
                    .dynamic-island-toast.success {
                        border-color: rgba(16, 185, 129, 0.3);
                    }
                    .dynamic-island-toast.error {
                        border-color: rgba(239, 68, 68, 0.3);
                    }
                    .dynamic-island-icon {
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 11px;
                        font-weight: bold;
                        flex-shrink: 0;
                    }
                    .dynamic-island-toast.success .dynamic-island-icon {
                        background: #10b981;
                        color: #fff;
                    }
                    .dynamic-island-toast.error .dynamic-island-icon {
                        background: #ef4444;
                        color: #fff;
                    }
                    .dynamic-island-content {
                        font-size: 13px;
                        font-weight: 500;
                        white-space: nowrap;
                    }
                    .dynamic-island-close {
                        background: none;
                        border: none;
                        color: #9ca3af;
                        cursor: pointer;
                        font-size: 11px;
                        padding: 2px;
                        margin-left: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: color 0.15s;
                    }
                    .dynamic-island-close:hover {
                        color: #fff;
                    }
                `}</style>
                <div className={`dynamic-island-toast ${toast.type}`}>
                    <div className="dynamic-island-icon">
                        {toast.type === 'success' ? '✓' : '✕'}
                    </div>
                    <div className="dynamic-island-content">{toast.message}</div>
                    <button
                        type="button"
                        className="dynamic-island-close"
                        onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
}

function SearchableSelect({ value, onChange, placeholder, options }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredValue, setHoveredValue] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
        }
    }, [isOpen]);

    const selectedOption = options.find((o) => o.value === value);
    const filteredOptions = options.filter((o) =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div ref={dropdownRef} className="custom-select-container" style={{ position: 'relative' }}>
            <div
                className="fsel"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--surface)',
                    padding: '0 10px 0 10px',
                    minWidth: '160px',
                    height: '32px',
                    backgroundImage: 'none'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span style={{ color: selectedOption ? 'var(--ink-2)' : 'var(--ink-4)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12.5px' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span style={{ color: 'var(--ink-4)', fontSize: '9px', marginLeft: '6px', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                </span>
            </div>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--r-xs)',
                        boxShadow: 'var(--shadow-lg)',
                        maxHeight: '220px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        minWidth: '220px'
                    }}
                >
                    <div style={{ padding: '6px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface-2)', position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                fontSize: '12px',
                                padding: '4px 28px 4px 8px',
                                height: '28px',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--r-2xs)',
                                background: 'var(--surface)',
                                outline: 'none',
                                boxShadow: 'none',
                                color: 'var(--ink)'
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                        <i className="bi bi-search" style={{ position: 'absolute', right: '14px', fontSize: '11px', color: 'var(--ink-4)', pointerEvents: 'none' }} />
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1, padding: '3px 0' }}>
                        {filteredOptions.length === 0 ? (
                            <div style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--ink-4)', textAlign: 'center' }}>
                                Tidak ditemukan
                            </div>
                        ) : (
                            filteredOptions.map((o) => {
                                const isHovered = hoveredValue === o.value;
                                const isSelected = value === o.value;
                                return (
                                    <div
                                        key={o.value}
                                        onMouseEnter={() => setHoveredValue(o.value)}
                                        onMouseLeave={() => setHoveredValue(null)}
                                        onClick={() => {
                                            onChange(o.value);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '12.5px',
                                            color: isSelected ? 'var(--indigo)' : 'var(--ink)',
                                            cursor: 'pointer',
                                            background: isSelected ? 'var(--indigo-s)' : (isHovered ? 'var(--bg-2)' : 'transparent'),
                                            fontWeight: isSelected ? 600 : 400,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {o.label}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
