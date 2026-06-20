import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PesertaLayout from '@/Layouts/PesertaLayout';

interface HistoryItem {
    exam_id: string | null;
    title: string;
    date: string;
    score: number;
    score_class: 'high' | 'mid' | 'low';
    status: string;
    status_class: 'lulus' | 'gagal';
    has_pembahasan: boolean;
}

interface HasilNilaiProps {
    user: {
        id: number;
        name: string;
        email: string;
        instansi?: string;
        jabatan?: string;
    };
    stats: {
        total_selesai: number;
        total_lulus: number;
        skor_tertinggi: number;
        ranking: string;
        avg_score: number;
    };
    history: {
        data: HistoryItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        status?: string;
        sort?: string;
        per_page?: string | number;
    };
}

export default function HasilNilai({ user, stats, history, filters }: HasilNilaiProps) {
    const [searchVal, setSearchVal] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [sortFilter, setSortFilter] = useState(filters?.sort || 'latest');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchVal !== (filters?.search || '')) {
                applyFilters({ search: searchVal });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchVal]);

    const applyFilters = (newFilters: any) => {
        const query = {
            search: searchVal,
            status: statusFilter === 'all' ? undefined : statusFilter,
            sort: sortFilter,
            ...newFilters,
        };

        // Remove undefined keys
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined) delete query[key];
        });

        router.get(route('peserta.hasil-nilai'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        applyFilters({ status });
    };

    const handleSortChange = (sort: string) => {
        setSortFilter(sort);
        applyFilters({ sort });
    };

    const handleReset = () => {
        setSearchVal('');
        setStatusFilter('all');
        setSortFilter('latest');
        router.get(route('peserta.hasil-nilai'), {}, {
            preserveState: false,
        });
    };

    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
        : user.name.slice(0, 2).toUpperCase();

    const isFiltered = searchVal !== '' || statusFilter !== 'all' || sortFilter !== 'latest';

    return (
        <PesertaLayout 
            title="Hasil & Nilai Ujian"
            userName={user.name}
            userInitials={initials}
        >
            <Head title="Hasil & Nilai — CAT System" />

            <div className="main-inner" style={{ position: 'relative', zIndex: 1, padding: '24px 0' }}>
                
                {/* ═══ Page Header ═══ */}
                <div className="page-header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '32px', background: 'var(--teal-s)', width: '54px', height: '54px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📊</div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Hasil & Nilai Ujian</h2>
                            <p style={{ fontSize: '13px', color: 'var(--ink-4)', margin: '4px 0 0' }}>
                                Pantau pencapaian Anda, kelulusan passing grade, dan lihat pembahasan ujian.
                            </p>
                        </div>
                    </div>
                    
                    {/* Breadcrumb Right aligned */}
                    <nav className="breadcrumb-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
                        <Link href={route('dashboard.peserta')} style={{ color: 'var(--indigo)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>🏠</span> Beranda
                        </Link>
                        <span style={{ color: 'var(--ink-4)' }}>/</span>
                        <span style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Hasil & Nilai</span>
                    </nav>
                </div>

                {/* ═══ KPI Strips ═══ */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    
                    {/* Rata-rata Skor */}
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>📈</div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 600 }}>Rata-rata Skor</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{stats.avg_score.toFixed(1)}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>Akumulasi nilai Anda</div>
                        </div>
                    </div>

                    {/* Skor Tertinggi */}
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>🏆</div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 600 }}>Skor Tertinggi</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{stats.skor_tertinggi.toFixed(1)}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>Pencapaian terbaik</div>
                        </div>
                    </div>

                    {/* Total Lulus */}
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>🎓</div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 600 }}>Ujian Lulus</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{stats.total_lulus}</div>
                            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>Memenuhi passing grade</div>
                        </div>
                    </div>

                    {/* Total Selesai */}
                    <div style={{ background: 'var(--surface)', padding: '20px', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>✓</div>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 600 }}>Total Selesai</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>{stats.total_selesai}</div>
                            <div style={{ fontSize: '11px', color: 'var(--ink-3)', marginTop: '2px' }}>Total ujian dikerjakan</div>
                        </div>
                    </div>
                </div>

                {/* ═══ Filter Bar ═══ */}
                <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'var(--surface)', padding: '14px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                    
                    {/* Status Pills */}
                    <div className="tab-pills" style={{ display: 'flex', gap: '6px' }}>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('all')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: statusFilter === 'all' ? 'var(--indigo)' : 'var(--surface-2)', color: statusFilter === 'all' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Semua Status
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'lulus' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('lulus')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: statusFilter === 'lulus' ? 'var(--indigo)' : 'var(--surface-2)', color: statusFilter === 'lulus' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Lulus
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${statusFilter === 'gagal' ? 'active' : ''}`}
                            onClick={() => handleStatusChange('gagal')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: statusFilter === 'gagal' ? 'var(--indigo)' : 'var(--surface-2)', color: statusFilter === 'gagal' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Tidak Lulus
                        </button>
                    </div>

                    <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

                    {/* Sorting Filter */}
                    <select
                        className="fsel"
                        value={sortFilter}
                        onChange={(e) => handleSortChange(e.target.value)}
                        style={{ height: '32px', padding: '0 10px', fontSize: '12.5px', border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', background: 'var(--surface)', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="latest">Terbaru</option>
                        <option value="score_desc">Nilai Tertinggi</option>
                        <option value="score_asc">Nilai Terendah</option>
                    </select>

                    {/* Reset Button */}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={handleReset}
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

                    <div style={{ flex: 1 }}></div>

                    {/* Search Field */}
                    <div className="fsearch" style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', padding: '0 10px 0 32px', height: '32px' }}>
                        <span style={{ position: 'absolute', left: '10px', color: 'var(--ink-4)', fontSize: '12px' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Cari nama ujian..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            style={{ outline: 'none', boxShadow: 'none', border: 'none', background: 'transparent', fontSize: '12.5px', color: 'var(--ink)', width: '180px' }}
                        />
                    </div>
                </div>

                {/* ═══ Table Section ═══ */}
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)' }}>Ujian / Paket Soal</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)' }}>Tanggal Pengerjaan</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', textAlign: 'center' }}>Skor Akhir</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', textAlign: 'right' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
                                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📭</span>
                                        <div style={{ fontWeight: 600, color: 'var(--ink-2)', fontSize: '15px' }}>Tidak Ada Riwayat Nilai</div>
                                        <div style={{ fontSize: '13px', marginTop: '4px', maxWidth: '320px', margin: '4px auto 0', lineHeight: 1.4 }}>
                                            {isFiltered 
                                                ? 'Coba ubah kata kunci pencarian atau bersihkan filter yang aktif.'
                                                : 'Anda belum memiliki riwayat ujian atau pengerjaan soal saat ini.'
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                history.data.map((item, idx) => {
                                    const isLulus = item.status_class === 'lulus';
                                    
                                    return (
                                        <tr 
                                            key={idx} 
                                            style={{ 
                                                borderBottom: '1px solid var(--border-2)',
                                                transition: 'background-color 0.15s' 
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{item.title}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '13.5px', color: 'var(--ink-3)' }}>
                                                {item.date}
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <span 
                                                    style={{ 
                                                        fontSize: '15px', 
                                                        fontWeight: 800,
                                                        color: item.score_class === 'high' ? '#10b981' : (item.score_class === 'low' ? '#ef4444' : '#eab308')
                                                    }}
                                                >
                                                    {item.score}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                                <span 
                                                    style={{ 
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        fontSize: '11.5px',
                                                        fontWeight: 700,
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        backgroundColor: isLulus ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: isLulus ? '#10b981' : '#ef4444'
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                {item.exam_id && item.has_pembahasan ? (
                                                    <button 
                                                        onClick={() => router.visit(route('peserta.ujian.pembahasan', { examId: item.exam_id }))}
                                                        style={{ 
                                                            padding: '6px 14px', 
                                                            fontSize: '12.5px', 
                                                            fontWeight: 600,
                                                            color: 'var(--indigo)',
                                                            background: 'var(--indigo-s)',
                                                            border: 'none',
                                                            borderRadius: 'var(--r-2xs)',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.filter = 'brightness(0.95)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.filter = 'none';
                                                        }}
                                                    >
                                                        📖 Lihat Pembahasan
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontStyle: 'italic' }}>
                                                        Pembahasan ditutup
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    
                    {/* ═══ Pagination Controls ═══ */}
                    {history.last_page > 1 && (
                        <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
                            <div className="pg-info" style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                                Menampilkan <strong>{history.from}</strong> - <strong>{history.to}</strong> dari{' '}
                                <strong>{history.total}</strong> riwayat ujian
                            </div>
                            <div className="pg-controls" style={{ display: 'flex', gap: '4px' }}>
                                {(() => {
                                    const currentPage = history.current_page;
                                    const lastPage = history.last_page || 1;
                                    const links = history.links;
                                    
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

                                    return pages.map((link, idx) => {
                                        const btnStyle: React.CSSProperties = {
                                            height: '32px',
                                            minWidth: link.wide ? '70px' : '32px',
                                            padding: '0 8px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: '1px solid var(--border)',
                                            background: link.active ? 'var(--indigo)' : 'var(--surface)',
                                            color: link.active ? '#fff' : 'var(--ink)',
                                            cursor: link.url ? 'pointer' : 'default',
                                            opacity: link.url || link.active ? 1 : 0.4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.15s'
                                        };

                                        return (
                                            <button
                                                key={idx}
                                                disabled={!link.url}
                                                style={btnStyle}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.get(link.url, {}, { preserveState: true });
                                                    }
                                                }}
                                            >
                                                {link.label}
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PesertaLayout>
    );
}
