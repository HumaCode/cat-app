import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import KpiCards from './Components/KpiCards';
import LiveMonitorStrip from './Components/LiveMonitorStrip';
import ExamTable from './Components/ExamTable';
import ExamCardGrid from './Components/ExamCardGrid';
import ExamFormModal from './Components/ExamFormModal';
import { ExamItem, CategoryItem } from './Components/types';

import '../../../css/bank-soal.css'; // Standard page CSS
import '../../../css/manajemen-ujian.css'; // Exam specific CSS

interface PaginatedExams {
    data: ExamItem[];
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
    exams: PaginatedExams;
    categories: CategoryItem[];
    stats: {
        total: number;
        aktif: number;
        terjadwal: number;
        draft: number;
        selesai: number;
    };
    filters: {
        q?: string;
        status?: string;
        type?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ExamIndex() {
    const {
        exams,
        categories = [],
        stats = { total: 0, aktif: 0, terjadwal: 0, draft: 0, selesai: 0 },
        filters = {},
        flash = {}
    } = usePage<any>().props as unknown as IndexProps;

    // View toggle state (Table vs Card Grid)
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Modal & Toast states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formTarget, setFormTarget] = useState<ExamItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ExamItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | '' }>({
        show: false,
        message: '',
        type: 'success',
    });

    // Filter values (derived from query params or local state)
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'semua');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    // Show flash notifications
    useEffect(() => {
        if (flash.success) {
            triggerToast(flash.success, 'success');
        } else if (flash.error) {
            triggerToast(flash.error, 'error');
        }
    }, [flash]);

    const triggerToast = (message: string, type: 'success' | 'error' | '') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Trigger Inertia reload when filters mutate
    const applyFilters = (updates: Record<string, string>) => {
        const nextFilters = {
            q: updates.q !== undefined ? updates.q : searchQuery,
            status: updates.status !== undefined ? updates.status : statusFilter,
            type: updates.type !== undefined ? updates.type : typeFilter,
        };

        router.get(route('ujian.index'), nextFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ q: searchQuery });
    };

    const handleTabChange = (tab: string) => {
        setStatusFilter(tab);
        applyFilters({ status: tab });
    };

    const handleTypeChange = (type: string) => {
        setTypeFilter(type);
        applyFilters({ type });
    };

    const handlePageChange = (url: string) => {
        router.get(url, {}, { preserveState: true });
    };

    const handleOpenCreateModal = () => {
        setFormTarget(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (exam: ExamItem) => {
        setFormTarget(exam);
        setIsFormOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setDeleteTarget(null);
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        router.delete(route('ujian.destroy', deleteTarget.id), {
            onSuccess: () => {
                setDeleteTarget(null);
                triggerToast('Ujian berhasil dihapus!', 'success');
            },
            onError: () => {
                triggerToast('Gagal menghapus ujian.', 'error');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Ujian — CAT System" />

            <div className="main-inner">
                {/* Page Header Card with Card-based Breadcrumb */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap">
                            <i className="bi bi-journal-text" />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Manajemen <span>Ujian</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '3px 0 0' }}>
                                Buat, kelola seksi soal, jadwal pelaksanaan, dan pantau aktivitas ujian secara realtime.
                            </p>
                        </div>
                    </div>
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('dashboard'))}>
                            <i className="bi bi-house-door-fill bc-home-icon" />
                            <span>Dashboard</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <span className="bc-item bc-active">Ujian</span>
                    </nav>
                </div>

            {/* KPI Cards Row */}
            <KpiCards stats={stats} />

            {/* Live Monitor Strip */}
            <LiveMonitorStrip
                onOpenMonitor={() => {
                    const activeExam = exams.data.find(e => e.status === 'aktif');
                    if (activeExam) {
                        router.visit(route('ujian.monitor', activeExam.id));
                    } else if (exams.data.length > 0) {
                        router.visit(route('ujian.monitor', exams.data[0].id));
                    } else {
                        triggerToast('Tidak ada ujian aktif saat ini.', 'error');
                    }
                }}
            />

            {/* Unified Filter Bar */}
            <div className="filter-bar anim-in d4" style={{ marginTop: '20px', marginBottom: '20px' }}>
                {/* Status Tab Pills */}
                <div className="tab-pills">
                    <button
                        type="button"
                        className={`tab-pill ${statusFilter === 'semua' ? 'active' : ''}`}
                        onClick={() => handleTabChange('semua')}
                    >
                        Semua <span className="pill-count">{stats.total}</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-pill ${statusFilter === 'aktif' ? 'active' : ''}`}
                        onClick={() => handleTabChange('aktif')}
                    >
                        Aktif <span className="pill-count">{stats.aktif}</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-pill ${statusFilter === 'terjadwal' ? 'active' : ''}`}
                        onClick={() => handleTabChange('terjadwal')}
                    >
                        Terjadwal <span className="pill-count">{stats.terjadwal}</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-pill ${statusFilter === 'draft' ? 'active' : ''}`}
                        onClick={() => handleTabChange('draft')}
                    >
                        Draft <span className="pill-count">{stats.draft}</span>
                    </button>
                    <button
                        type="button"
                        className={`tab-pill ${statusFilter === 'selesai' ? 'active' : ''}`}
                        onClick={() => handleTabChange('selesai')}
                    >
                        Selesai <span className="pill-count">{stats.selesai}</span>
                    </button>
                </div>

                <div className="filter-divider"></div>

                {/* Dropdown Type Filter */}
                <select
                    className="filter-select"
                    value={typeFilter}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    style={{ height: '32px', padding: '0 28px 0 10px', fontSize: '12.5px' }}
                >
                    <option value="">Semua Tipe</option>
                    <option value="Simulasi">Simulasi</option>
                    <option value="Latihan">Latihan</option>
                    <option value="Resmi">Resmi</option>
                </select>

                {/* Spacer to push search and action buttons to the right */}
                <div className="filter-spacer"></div>

                {/* Inline Search Bar */}
                <form onSubmit={handleSearch}>
                    <div className="filter-search">
                        <input
                            type="text"
                            placeholder="Cari nama ujian..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', width: '160px' }}
                        />
                        <i className="bi bi-search" style={{ fontSize: '13px', color: 'var(--ink-4)', cursor: 'default' }} />
                    </div>
                </form>

                {/* View Mode Toggle switcher */}
                <div className="view-toggle">
                    <button
                        type="button"
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        title="Tampilan tabel"
                    >
                        <i className="bi bi-list-ul" style={{ fontSize: '15px' }} />
                    </button>
                    <button
                        type="button"
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Tampilan kartu"
                    >
                        <i className="bi bi-grid-fill" style={{ fontSize: '13px' }} />
                    </button>
                </div>

                {/* Action Button: Buat Ujian Baru */}
                <div style={{ display: 'flex', gap: '6px', marginLeft: '4px', flexShrink: 0 }}>
                    <button
                        type="button"
                        className="btn-modal confirm"
                        onClick={handleOpenCreateModal}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: 'var(--indigo)',
                            color: '#fff',
                            border: 'none',
                            padding: '0 14px',
                            fontWeight: 600,
                            fontSize: '12.5px',
                            height: '32px',
                            borderRadius: 'var(--r-xs)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                    >
                        <i className="bi bi-plus-lg" /> Buat Ujian Baru
                    </button>
                </div>
            </div>

            {/* Main View Container (Table vs Card Grid) */}
            <div className="anim-in d5">
                {viewMode === 'table' ? (
                    <ExamTable
                        exams={exams}
                        onEdit={handleOpenEditModal}
                        onDelete={setDeleteTarget}
                        onActionTriggered={triggerToast}
                        onPageChange={handlePageChange}
                    />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <ExamCardGrid
                            exams={exams.data}
                            onEdit={handleOpenEditModal}
                            onDelete={setDeleteTarget}
                            onActionTriggered={triggerToast}
                        />
                        {/* Pagination fallback for card layout */}
                        {exams.links && exams.links.length > 3 && (
                            <div className="table-card" style={{ padding: '12px 20px' }}>
                                <div className="pagination-row" style={{ borderTop: 'none', padding: 0 }}>
                                    <div className="pagination-info">
                                        Menampilkan <strong>{exams.from || 0}–{exams.to || 0}</strong> dari <strong>{exams.total}</strong> ujian
                                    </div>
                                    <div className="pagination-btns">
                                        {exams.links.map((link, idx) => {
                                            let label = link.label;
                                            if (label.includes('Previous')) label = '←';
                                            if (label.includes('Next')) label = '→';

                                            return (
                                                <button
                                                    key={idx}
                                                    className={`page-btn ${link.active ? 'active' : ''}`}
                                                    disabled={!link.url}
                                                    onClick={() => link.url && handlePageChange(link.url)}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create & Edit Modal */}
            <ExamFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                exam={formTarget}
                categories={categories}
                onSuccess={(msg) => triggerToast(msg, 'success')}
                onError={(msg) => triggerToast(msg, 'error')}
            />

            {/* Confirm Delete Modal */}
            {deleteTarget && isMounted && createPortal(
                <div className="modal-overlay open" onClick={handleCloseDeleteModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div className="modal-icon-wrap" style={{ background: 'var(--rose-s)', color: 'var(--rose)' }}>🗑️</div>
                        <h3 className="modal-title">Hapus Ujian?</h3>
                        <p className="modal-desc" style={{ textAlign: 'center' }}>
                            Apakah Anda yakin ingin menghapus ujian <strong>{deleteTarget.title}</strong>? Tindakan ini permanen dan akan menghapus seluruh data progres peserta terkait.
                        </p>
                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button 
                                className="btn-modal cancel" 
                                disabled={isDeleting} 
                                onClick={handleCloseDeleteModal}
                            >
                                Batal
                            </button>
                            <button 
                                className="btn-modal confirm" 
                                style={{ background: 'var(--rose)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} 
                                disabled={isDeleting} 
                                onClick={handleDeleteConfirm}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="spinner" style={{ margin: 0 }} />
                                        <span>sedang proses</span>
                                    </>
                                ) : (
                                    <span>Ya, Hapus</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

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
            </div>
        </AuthenticatedLayout>
    );
}
