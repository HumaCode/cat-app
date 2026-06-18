import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../../css/bank-soal.css';   // shared CSS (modal-overlay, form-*, btn-modal, etc.)
import '../../../css/kategori.css';    // page-specific CSS

import { CategoryItem } from './Partials/KategoriFormModal';
import KategoriFormModal  from './Partials/KategoriFormModal';
import ConfirmDeleteModal from './Partials/ConfirmDeleteModal';
import KategoriTable      from './Partials/KategoriTable';

interface PageProps {
    categories: CategoryItem[];
    auth: { user: { id: string; role: string; name: string } };
    flash?: { success?: string; error?: string };
}

export default function KategoriIndex() {
    const { categories, auth, flash } = usePage<PageProps>().props;
    const user = auth.user;

    // Modal states
    const [isFormOpen, setIsFormOpen]     = useState(false);
    const [editTarget, setEditTarget]     = useState<CategoryItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
    const [isDeleting, setIsDeleting]     = useState(false);

    // Filter states
    const [search, setSearch]             = useState('');
    const [filterType, setFilterType]     = useState<'all' | 'parent' | 'child'>('all');
    const [filterOwner, setFilterOwner]   = useState<'all' | 'mine' | 'global'>('all');

    // Pagination states
    const [currentPage, setCurrentPage]   = useState(1);
    const perPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterType, filterOwner]);

    // Toast
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: '', type: 'success',
    });

    useEffect(() => {
        if (flash?.success) showToast(flash.success, 'success');
        if (flash?.error)   showToast(flash.error,   'error');
    }, [flash]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
    };

    const handleReset = () => {
        setSearch('');
        setFilterType('all');
        setFilterOwner('all');
    };

    const openAdd  = () => { setEditTarget(null); setIsFormOpen(true); };
    const openEdit = (cat: CategoryItem) => { setEditTarget(cat); setIsFormOpen(true); };
    const openDel  = (cat: CategoryItem) => setDeleteTarget(cat);

    const handleDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route('kategori.destroy', { id: deleteTarget.id }), {
            onFinish: () => { setIsDeleting(false); setDeleteTarget(null); },
        });
    };

    // Derived: stats
    const parentCats   = categories.filter(c => !c.parent_id);
    const childCats    = categories.filter(c => !!c.parent_id);
    const totalQuestions = categories.reduce((sum, c) => sum + (c.questions_count ?? 0), 0);

    // Filter + search
    const displayed = categories.filter(cat => {
        const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
        const matchType   =
            filterType === 'all'    ? true :
            filterType === 'parent' ? !cat.parent_id :
            !!cat.parent_id;
        const matchOwner  =
            filterOwner === 'all'   ? true :
            filterOwner === 'mine'  ? cat.user_id === user.id :
            cat.user_id === null;
        return matchSearch && matchType && matchOwner;
    });

    const totalFiltered = displayed.length;
    const totalPages = Math.ceil(totalFiltered / perPage) || 1;
    const startIndex = (currentPage - 1) * perPage;
    const paginatedCategories = displayed.slice(startIndex, startIndex + perPage);

    return (
        <AuthenticatedLayout>
            <Head title="Kategori Soal - CAT System" />

            <div className="main-inner">
                {/* Page Header Card */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap">
                            <i className="bi bi-tags-fill" />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Manajemen <span>Kategori Soal</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '3px 0 0' }}>
                                Organisasi dan kelola hierarki kategori bank soal.
                            </p>
                        </div>
                    </div>
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('dashboard'))}>
                            <i className="bi bi-house-door-fill bc-home-icon" />
                            <span>Dashboard</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <span className="bc-item bc-active">Kategori Soal</span>
                    </nav>
                </div>

                {/* Stats Strip */}
                <div className="kat-stats-strip">
                    <div className="kat-stat-card" style={{ '--clr': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as any}>
                        <div className="kat-stat-icon"><i className="bi bi-tags-fill" /></div>
                        <div className="kat-stat-body">
                            <div className="kat-stat-label">Total Kategori</div>
                            <div className="kat-stat-num">{categories.length}</div>
                        </div>
                    </div>
                    <div className="kat-stat-card" style={{ '--clr': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as any}>
                        <div className="kat-stat-icon"><i className="bi bi-folder2-open" /></div>
                        <div className="kat-stat-body">
                            <div className="kat-stat-label">Kategori Utama</div>
                            <div className="kat-stat-num">{parentCats.length}</div>
                        </div>
                    </div>
                    <div className="kat-stat-card" style={{ '--clr': 'var(--violet)', '--clr-s': 'var(--violet-s)' } as any}>
                        <div className="kat-stat-icon"><i className="bi bi-diagram-3-fill" /></div>
                        <div className="kat-stat-body">
                            <div className="kat-stat-label">Sub-Kategori</div>
                            <div className="kat-stat-num">{childCats.length}</div>
                        </div>
                    </div>
                    <div className="kat-stat-card" style={{ '--clr': 'var(--sky)', '--clr-s': 'var(--sky-s)' } as any}>
                        <div className="kat-stat-icon"><i className="bi bi-file-earmark-text-fill" /></div>
                        <div className="kat-stat-body">
                            <div className="kat-stat-label">Total Soal</div>
                            <div className="kat-stat-num">{totalQuestions}</div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar Card */}
                <div className="filter-bar anim-in d1" style={{ marginBottom: '20px' }}>
                    <div className="tab-pills">
                        <button
                            type="button"
                            className={`tab-pill ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            Semua Tipe
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${filterType === 'parent' ? 'active' : ''}`}
                            onClick={() => setFilterType('parent')}
                        >
                            Kategori Utama
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${filterType === 'child' ? 'active' : ''}`}
                            onClick={() => setFilterType('child')}
                        >
                            Sub-Kategori
                        </button>
                    </div>

                    <div className="filter-divider"></div>

                    <select
                        className="filter-select"
                        value={filterOwner}
                        onChange={e => setFilterOwner(e.target.value as any)}
                        style={{ height: '32px', padding: '0 24px 0 10px', fontSize: '12.5px' }}
                    >
                        <option value="all">Semua Pemilik</option>
                        <option value="mine">Milik Saya</option>
                        <option value="global">Global (Sistem)</option>
                    </select>

                    {(search !== '' || filterType !== 'all' || filterOwner !== 'all') && (
                        <button
                            type="button"
                            className="btn-modal cancel"
                            onClick={handleReset}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '0 12px',
                                fontSize: '12.5px',
                                height: '32px',
                                borderRadius: 'var(--r-xs)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                cursor: 'pointer',
                                marginLeft: '6px',
                                color: 'var(--rose)',
                                borderColor: 'rgba(239, 68, 68, 0.2)',
                                flex: 'none'
                            }}
                        >
                            <i className="bi bi-x-circle-fill" /> Reset Filter
                        </button>
                    )}

                    <div className="filter-spacer"></div>

                    <div className="filter-search">
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '150px' }}
                        />
                        <i className="bi bi-search" style={{ fontSize: 13, color: 'var(--ink-4)', cursor: 'default' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginLeft: '4px', flexShrink: 0 }}>
                        <button
                            type="button"
                            className="btn-modal confirm"
                            onClick={openAdd}
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
                            <i className="bi bi-plus-lg" /> Tambah Kategori
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="kat-table-wrap">
                    <KategoriTable
                        categories={paginatedCategories}
                        onEdit={openEdit}
                        onDelete={openDel}
                        currentUserId={user.id}
                        userRole={user.role}
                        startIndex={startIndex}
                        allCategories={categories}
                    />

                    {/* Table footer info & pagination */}
                    {totalFiltered > 0 && (
                        <div className="kat-pagination">
                            <span>
                                Menampilkan {totalFiltered > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + perPage, totalFiltered)} dari {totalFiltered} kategori
                            </span>
                            {totalPages > 1 && (
                                <div className="kat-page-btns">
                                    <button 
                                        type="button" 
                                        className="kat-page-btn" 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(1)}
                                        title="Halaman Pertama"
                                    >
                                        «
                                    </button>
                                    <button 
                                        type="button" 
                                        className="kat-page-btn" 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        title="Halaman Sebelumnya"
                                    >
                                        ‹
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            type="button"
                                            className={`kat-page-btn ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button 
                                        type="button" 
                                        className="kat-page-btn" 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        title="Halaman Berikutnya"
                                    >
                                        ›
                                    </button>
                                    <button 
                                        type="button" 
                                        className="kat-page-btn" 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                        title="Halaman Terakhir"
                                    >
                                        »
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <KategoriFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                categories={categories}
                editCategory={editTarget}
                showToast={showToast}
            />

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title="Hapus Kategori?"
                message={`Kategori "${deleteTarget?.name}" akan dihapus permanen. Aksi ini tidak dapat diurungkan.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={isDeleting}
            />

            {/* Dynamic Island Toast */}
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
        </AuthenticatedLayout>
    );
}
