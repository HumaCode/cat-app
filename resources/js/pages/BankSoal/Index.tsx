import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../../css/bank-soal.css';

import KategoriTree from './Partials/KategoriTree';
import FilterBar from './Partials/FilterBar';
import BulkStatusBar from './Partials/BulkStatusBar';
import QuestionTable from './Partials/QuestionTable';
import QuestionGrid from './Partials/QuestionGrid';
import TambahSoalModal from './Partials/TambahSoalModal';
import PreviewSoalModal from './Partials/PreviewSoalModal';
import ImportSoalModal from './Partials/ImportSoalModal';
import KategoriModal from './Partials/KategoriModal';

interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    icon?: string;
    questions_count?: number;
}

interface QuestionOption {
    id: string;
    option_text: string;
    is_correct: boolean;
    order_column: number;
    pair_text?: string;
}

interface Question {
    id: string;
    category_id?: string;
    category?: {
        id: string;
        name: string;
        parent?: {
            name: string;
        };
    };
    type: string;
    difficulty: string;
    points: number;
    bloom_level?: string;
    question_text: string;
    explanation?: string;
    is_active: boolean;
    created_at: string;
    options?: QuestionOption[];
}

interface Paginator {
    data: Question[];
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total_soal: number;
    pg_count: number;
    essay_count: number;
    other_count: number;
    draft: number;
}

interface IndexProps {
    categories: Category[];
    questions: Paginator;
    stats: Stats;
    filters: {
        category_id?: string;
        type?: string;
        difficulty?: string;
        search?: string;
    };
}

export default function Index({
    categories,
    questions,
    stats,
    filters
}: IndexProps) {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        cancelText?: string;
        type?: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: 'Ya, Hapus',
        cancelText: 'Batal',
        type: 'danger'
    });

    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Modal states
    const [isTambahOpen, setIsTambahOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isKategoriOpen, setIsKategoriOpen] = useState(false);

    // Selected items for edit / preview
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    // Clear selection on filter changes
    useEffect(() => {
        setSelectedIds([]);
    }, [filters]);

    // Handle single row checkbox toggling
    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Handle header checkbox toggling
    const handleToggleSelectAll = (checked: boolean) => {
        if (checked) {
            const pageIds = questions.data.map(q => q.id);
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
        } else {
            const pageIds = questions.data.map(q => q.id);
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
        }
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    // Actions
    const handlePreview = (question: Question) => {
        setActiveQuestion(question);
        setIsPreviewOpen(true);
    };

    const handleEdit = (question: Question) => {
        setActiveQuestion(question);
        setIsTambahOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Soal Ujian',
            message: 'Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            type: 'danger',
            onConfirm: () => {
                setIsDeleting(true);
                router.delete(route('bank-soal.destroy', { id }), {
                    onSuccess: () => {
                        setSelectedIds(prev => prev.filter(item => item !== id));
                        showToast('Soal berhasil dihapus', 'success');
                    },
                    onError: () => {
                        showToast('Gagal menghapus soal', 'error');
                    },
                    onFinish: () => {
                        setIsDeleting(false);
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
            }
        });
    };

    // Bulk actions dispatch
    const handleBulkUpdateStatus = (status: boolean) => {
        router.post(route('bank-soal.bulk'), {
            ids: selectedIds,
            action: status ? 'active' : 'draft'
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                showToast(`Status ${selectedIds.length} soal berhasil diperbarui`, 'success');
            },
            onError: () => {
                showToast('Gagal memperbarui status soal', 'error');
            }
        });
    };

    const handleBulkDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Soal Terpilih',
            message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} soal terpilih? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Ya, Hapus Semua',
            cancelText: 'Batal',
            type: 'danger',
            onConfirm: () => {
                const count = selectedIds.length;
                setIsDeleting(true);
                router.post(route('bank-soal.bulk'), {
                    ids: selectedIds,
                    action: 'delete'
                }, {
                    onSuccess: () => {
                        setSelectedIds([]);
                        showToast(`${count} soal terpilih berhasil dihapus`, 'success');
                    },
                    onError: () => {
                        showToast('Gagal menghapus soal terpilih', 'error');
                    },
                    onFinish: () => {
                        setIsDeleting(false);
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
            }
        });
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                replace: true
            });
        }
    };

    const cleanLabel = (label: string) => {
        if (label.includes('Previous')) return '« Sblm';
        if (label.includes('Next')) return 'Sldt »';
        return label;
    };

    // Get active category name
    const getActiveCategoryName = () => {
        if (!filters.category_id) return 'Semua Soal';
        const cat = categories.find(c => c.id === filters.category_id);
        return cat ? cat.name : 'Semua Soal';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bank Soal - CAT System" />

            <div className="main-inner">
                {/* Page Header Card */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap">
                            <i className="bi bi-bank"></i>
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Manajemen <span>Bank Soal</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '3px', margin: '3px 0 0' }}>
                                Kelola koleksi soal ujian, kategori bertingkat, dan media pendukung.
                            </p>
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button
                            type="button"
                            className="bc-item bc-link"
                            onClick={() => router.get(route('dashboard'))}
                        >
                            <i className="bi bi-house-door-fill bc-home-icon"></i>
                            <span>Dashboard</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep"></i>
                        <span className="bc-item bc-active">Bank Soal</span>
                    </nav>
                </div>

                {/* KPI Strip */}
                <div className="kpi-strip anim-in">
                    <div className="kpi-mini" style={{ '--clr': 'var(--sky)', '--clr-s': 'var(--sky-s)' } as any}>
                        <div className="kpi-mini-icon">📚</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Total Soal</div>
                            <div className="kpi-mini-num">{stats.total_soal}</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as any}>
                        <div className="kpi-mini-icon">📝</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Pilihan Ganda</div>
                            <div className="kpi-mini-num">{stats.pg_count}</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as any}>
                        <div className="kpi-mini-icon">✍️</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Essay</div>
                            <div className="kpi-mini-num">{stats.essay_count}</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--violet)', '--clr-s': 'var(--violet-s)' } as any}>
                        <div className="kpi-mini-icon">🧩</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Tipe Lainnya</div>
                            <div className="kpi-mini-num">{stats.other_count}</div>
                        </div>
                    </div>
                    <div className="kpi-mini" style={{ '--clr': 'var(--amber)', '--clr-s': 'var(--amber-s)' } as any}>
                        <div className="kpi-mini-icon">📁</div>
                        <div className="kpi-mini-body">
                            <div className="kpi-mini-label">Status Draft</div>
                            <div className="kpi-mini-num">{stats.draft}</div>
                        </div>
                    </div>
                </div>

                {/* Body Layout (Categories + Panel Content) */}
                <div className="body-layout">
                    {/* Left Kategori Tree */}
                    <KategoriTree
                        categories={categories}
                        selectedCategoryId={filters.category_id || null}
                        onAddCategoryClick={() => setIsKategoriOpen(true)}
                    />

                    {/* Right Question List panel */}
                    <div className="panel">
                        {/* Bulk operations bar */}
                        <BulkStatusBar
                            selectedIds={selectedIds}
                            onClearSelection={handleClearSelection}
                            onBulkUpdateStatus={handleBulkUpdateStatus}
                            onBulkDelete={handleBulkDelete}
                        />

                        {/* Filter Bar */}
                        <FilterBar
                            filters={filters}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            onImportClick={() => setIsImportOpen(true)}
                            onAddClick={() => {
                                setActiveQuestion(null);
                                setIsTambahOpen(true);
                            }}
                        />

                        {/* Questions List/Grid Card */}
                        <div className="table-card anim-in d2">
                            <div className="table-card-head">
                                <div>
                                    <div className="table-card-title" id="panelTitle">
                                        {getActiveCategoryName()}
                                    </div>
                                    <div className="table-card-sub" id="panelSub">
                                        Menampilkan <strong>{questions.from || 0}–{questions.to || 0}</strong> dari <strong>{questions.total}</strong> soal
                                    </div>
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <QuestionTable
                                    questions={questions.data}
                                    selectedIds={selectedIds}
                                    onToggleSelect={handleToggleSelect}
                                    onToggleSelectAll={handleToggleSelectAll}
                                    onPreview={handlePreview}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ) : (
                                <div style={{ padding: '20px' }}>
                                    <QuestionGrid
                                        questions={questions.data}
                                        onPreview={handlePreview}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {questions.total > 0 && (
                                <div className="pagination">
                                    <div className="pg-info">
                                        Halaman <strong>{questions.current_page}</strong> dari <strong>{questions.last_page || 1}</strong>
                                    </div>
                                    <div className="pg-controls">
                                        {(() => {
                                            const currentPage = questions.current_page;
                                            const lastPage = questions.last_page || 1;
                                            const links = questions.links;
                                            
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
                                                    type="button"
                                                    className={`pg-btn ${link.url ? '' : 'disabled'} ${link.active ? 'active' : ''} ${link.wide ? 'wide' : ''}`}
                                                    disabled={!link.url}
                                                    onClick={() => handlePageChange(link.url)}
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
                </div>
            </div>

            {/* Modals */}
            {isMounted && isTambahOpen && createPortal(
                <TambahSoalModal
                    isOpen={isTambahOpen}
                    onClose={() => {
                        setIsTambahOpen(false);
                        setActiveQuestion(null);
                    }}
                    categories={categories}
                    editingQuestion={activeQuestion}
                    showToast={showToast}
                />,
                document.body
            )}

            {isMounted && isPreviewOpen && createPortal(
                <PreviewSoalModal
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                        setActiveQuestion(null);
                    }}
                    question={activeQuestion}
                />,
                document.body
            )}

            {isMounted && isImportOpen && createPortal(
                <ImportSoalModal
                    isOpen={isImportOpen}
                    onClose={() => setIsImportOpen(false)}
                />,
                document.body
            )}

            {isMounted && isKategoriOpen && createPortal(
                <KategoriModal
                    isOpen={isKategoriOpen}
                    onClose={() => setIsKategoriOpen(false)}
                    categories={categories}
                />,
                document.body
            )}

            {/* Dynamic Island Toast */}
            <div className={`dynamic-island-toast-container ${toast.show ? 'show' : ''}`}>
                <style>{`
                    .dynamic-island-toast-container {
                        position: fixed;
                        bottom: 32px;
                        left: 50%;
                        transform: translateX(-50%) scale(0.9);
                        z-index: 9999;
                        opacity: 0;
                        pointer-events: none;
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    .dynamic-island-toast-container.show {
                        opacity: 1;
                        pointer-events: auto;
                        transform: translateX(-50%) scale(1);
                    }
                    .dynamic-island-toast {
                        background: #0d0e12;
                        color: #ffffff;
                        border-radius: 24px;
                        padding: 12px 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1.5px var(--neon-color);
                        border: 1px solid var(--neon-color);
                        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                        min-width: 250px;
                        max-width: 450px;
                    }
                    .dynamic-island-toast.success {
                        --neon-color: #00ffcc;
                    }
                    .dynamic-island-toast.error {
                        --neon-color: #ff3366;
                    }
                    .dynamic-island-icon {
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 13px;
                        font-weight: bold;
                        flex-shrink: 0;
                    }
                    .dynamic-island-toast.success .dynamic-island-icon {
                        color: #00ffcc;
                        background: rgba(0, 255, 204, 0.15);
                        box-shadow: 0 0 8px rgba(0, 255, 204, 0.3);
                    }
                    .dynamic-island-toast.error .dynamic-island-icon {
                        color: #ff3366;
                        background: rgba(255, 51, 102, 0.15);
                        box-shadow: 0 0 8px rgba(255, 51, 102, 0.3);
                    }
                    .dynamic-island-content {
                        flex: 1;
                        font-size: 13.5px;
                        font-weight: 500;
                        line-height: 1.4;
                    }
                    .dynamic-island-close {
                        cursor: pointer;
                        background: none;
                        border: none;
                        color: rgba(255, 255, 255, 0.4);
                        font-size: 11px;
                        padding: 4px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s;
                        flex-shrink: 0;
                    }
                    .dynamic-island-close:hover {
                        color: #fff;
                        background: rgba(255, 255, 255, 0.1);
                    }
                `}</style>
                <div className={`dynamic-island-toast ${toast.type}`}>
                    <div className="dynamic-island-icon">
                        {toast.type === 'success' ? '✓' : '✕'}
                    </div>
                    <div className="dynamic-island-content">
                        {toast.message}
                    </div>
                    <button 
                        type="button" 
                        className="dynamic-island-close" 
                        onClick={() => setToast(prev => ({ ...prev, show: false }))}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Custom Confirm Dialog Modal */}
            {isMounted && confirmModal.isOpen && createPortal(
                <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && !isDeleting && setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
                    <div className="modal-card">
                        <div className="modal-icon-wrap" style={{
                            background: confirmModal.type === 'danger' ? 'var(--rose-s)' : 'rgba(79, 70, 229, 0.1)',
                            color: confirmModal.type === 'danger' ? 'var(--rose)' : 'var(--indigo)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px'
                        }}>
                            {confirmModal.type === 'danger' ? '⚠️' : 'ℹ️'}
                        </div>
                        <h3 className="modal-title">
                            {confirmModal.title}
                        </h3>
                        <p className="modal-desc">
                            {confirmModal.message}
                        </p>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-modal cancel"
                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                disabled={isDeleting}
                            >
                                {confirmModal.cancelText || 'Batal'}
                            </button>
                            <button
                                type="button"
                                className="btn-modal confirm"
                                onClick={confirmModal.onConfirm}
                                disabled={isDeleting}
                                style={confirmModal.type !== 'danger' ? {
                                    background: 'var(--indigo)',
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                                } : undefined}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Sedang proses...
                                    </>
                                ) : (
                                    confirmModal.confirmText || 'Ya, Hapus'
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AuthenticatedLayout>
    );
}
