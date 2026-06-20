import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PesertaLayout from '@/Layouts/PesertaLayout';

interface ExamItem {
    id: string;
    title: string;
    type: string;
    difficulty: string;
    total_soal: number;
    duration: number;
    passing_grade: number;
    has_pembahasan: boolean;
    max_attempts: number | null;
    attempts_count: number;
    tags: string[];
    color: string;
    badge_bg: string;
    badge_color: string;
    status_label: string;
    status_class: string;
    can_start: boolean;
    has_active_progress: boolean;
}

interface UjianSayaProps {
    user: {
        id: number;
        name: string;
        email: string;
        instansi?: string;
        jabatan?: string;
    };
    exams: {
        data: ExamItem[];
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
        type?: string;
        sort?: string;
        per_page?: string | number;
    };
}

export default function UjianSaya({ user, exams, filters }: UjianSayaProps) {
    const [searchVal, setSearchVal] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || 'all');
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
            type: typeFilter === 'all' ? undefined : typeFilter,
            sort: sortFilter,
            ...newFilters,
        };

        // Remove undefined keys
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined) delete query[key];
        });

        router.get(route('peserta.ujian-saya'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleTypeChange = (type: string) => {
        setTypeFilter(type);
        applyFilters({ type });
    };

    const handleSortChange = (sort: string) => {
        setSortFilter(sort);
        applyFilters({ sort });
    };

    const handleReset = () => {
        setSearchVal('');
        setTypeFilter('all');
        setSortFilter('latest');
        router.get(route('peserta.ujian-saya'), {}, {
            preserveState: false,
        });
    };

    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
        : user.name.slice(0, 2).toUpperCase();

    const isFiltered = searchVal !== '' || typeFilter !== 'all' || sortFilter !== 'latest';

    return (
        <PesertaLayout 
            title="Ujian Saya"
            userName={user.name}
            userInitials={initials}
        >
            <Head title="Ujian Saya — CAT System" />

            <div className="main-inner" style={{ position: 'relative', zIndex: 1, padding: '24px 0' }}>
                
                {/* ═══ Page Header ═══ */}
                <div className="page-header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '32px', background: 'var(--indigo-s)', width: '54px', height: '54px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📋</div>
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Daftar Ujian Saya</h2>
                            <p style={{ fontSize: '13px', color: 'var(--ink-4)', margin: '4px 0 0' }}>
                                Ikuti ujian resmi, simulasi mandiri, dan latihan kompetensi khusus.
                            </p>
                        </div>
                    </div>
                    
                    {/* Breadcrumb Right aligned */}
                    <nav className="breadcrumb-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
                        <Link href={route('dashboard.peserta')} style={{ color: 'var(--indigo)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>🏠</span> Beranda
                        </Link>
                        <span style={{ color: 'var(--ink-4)' }}>/</span>
                        <span style={{ color: 'var(--ink-3)', fontWeight: 600 }}>Ujian Saya</span>
                    </nav>
                </div>

                {/* ═══ Filter Bar ═══ */}
                <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', background: 'var(--surface)', padding: '14px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
                    
                    {/* Type Pills */}
                    <div className="tab-pills" style={{ display: 'flex', gap: '6px' }}>
                        <button
                            type="button"
                            className={`tab-pill ${typeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleTypeChange('all')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: typeFilter === 'all' ? 'var(--indigo)' : 'var(--surface-2)', color: typeFilter === 'all' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${typeFilter === 'Resmi' ? 'active' : ''}`}
                            onClick={() => handleTypeChange('Resmi')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: typeFilter === 'Resmi' ? 'var(--indigo)' : 'var(--surface-2)', color: typeFilter === 'Resmi' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Resmi
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${typeFilter === 'Simulasi' ? 'active' : ''}`}
                            onClick={() => handleTypeChange('Simulasi')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: typeFilter === 'Simulasi' ? 'var(--indigo)' : 'var(--surface-2)', color: typeFilter === 'Simulasi' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Simulasi
                        </button>
                        <button
                            type="button"
                            className={`tab-pill ${typeFilter === 'Latihan' ? 'active' : ''}`}
                            onClick={() => handleTypeChange('Latihan')}
                            style={{ padding: '6px 14px', fontSize: '12.5px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', background: typeFilter === 'Latihan' ? 'var(--indigo)' : 'var(--surface-2)', color: typeFilter === 'Latihan' ? '#fff' : 'var(--ink-3)' }}
                        >
                            Latihan
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
                        <option value="title_asc">Judul (A-Z)</option>
                        <option value="title_desc">Judul (Z-A)</option>
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
                            placeholder="Cari judul ujian..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            style={{ outline: 'none', boxShadow: 'none', border: 'none', background: 'transparent', fontSize: '12.5px', color: 'var(--ink)', width: '180px' }}
                        />
                    </div>
                </div>

                {/* ═══ Cards Grid ═══ */}
                {exams.data.length === 0 ? (
                    <div style={{ background: 'var(--surface)', padding: '64px 24px', textAlign: 'center', color: 'var(--ink-3)', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '48px', marginBottom: '16px' }}>📭</span>
                        <div style={{ fontWeight: 600, color: 'var(--ink-2)', fontSize: '16px' }}>Tidak Ada Ujian Ditemukan</div>
                        <div style={{ fontSize: '13.5px', marginTop: '6px', maxWidth: '360px', lineHeight: 1.5 }}>
                            {isFiltered 
                                ? 'Coba ubah kata kunci pencarian atau bersihkan filter yang aktif.'
                                : 'Anda belum terdaftar atau diundang ke ujian aktif mana pun saat ini.'
                            }
                        </div>
                        {isFiltered && (
                            <button
                                type="button"
                                onClick={handleReset}
                                style={{ marginTop: '16px', background: 'var(--indigo)', color: '#fff', border: 'none', borderRadius: 'var(--r-xs)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                            >
                                Bersihkan Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="exam-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                            {exams.data.map((exam) => {
                                const isCompleted = exam.status_class === 'completed';
                                const isResume = exam.status_class === 'resume';
                                const isInactive = exam.status_class === 'inactive';
                                
                                return (
                                    <div 
                                        key={exam.id} 
                                        className="exam-card" 
                                        style={{ 
                                            background: 'var(--surface)',
                                            borderRadius: 'var(--r)',
                                            border: '1px solid var(--border)',
                                            borderLeft: `4px solid ${exam.color}`,
                                            padding: '24px',
                                            boxShadow: 'var(--shadow-sm)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            minHeight: '260px',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'default'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <span 
                                                    style={{ 
                                                        backgroundColor: exam.badge_bg, 
                                                        color: exam.badge_color,
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}
                                                >
                                                    {exam.type}
                                                </span>
                                                <span style={{ fontSize: '12.5px', color: 'var(--ink-4)', fontWeight: 500 }}>
                                                    {exam.difficulty} &middot; {exam.total_soal} soal
                                                </span>
                                            </div>
                                            
                                            <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                                                {exam.title}
                                            </h3>
                                            
                                            <p style={{ fontSize: '12.5px', color: 'var(--ink-3)', margin: '0 0 16px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                Ujian ini merupakan bagian dari evaluasi berkala untuk mengukur kompetensi di bidang terkait.
                                            </p>
                                        </div>

                                        <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', borderTop: '1px solid var(--border-2)', paddingTop: '14px', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '14px' }}>⏱</span> {exam.duration} menit
                                                </div>
                                                <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '14px' }}>🎯</span> PG: {exam.passing_grade}
                                                </div>
                                                <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '14px' }}>🔄</span> {exam.attempts_count}/{exam.max_attempts ? `${exam.max_attempts}×` : '∞'} Percobaan
                                                </div>
                                                <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '14px' }}>📖</span> {exam.has_pembahasan ? 'Ada pembahasan' : 'Tanpa pembahasan'}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {exam.tags.map((tag, idx) => (
                                                        <span key={idx} style={{ fontSize: '10.5px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', color: 'var(--ink-3)' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                
                                                {isCompleted ? (
                                                    <button 
                                                        disabled
                                                        style={{ 
                                                            backgroundColor: 'var(--surface-3)', 
                                                            color: 'var(--ink-4)',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: 'var(--r-xs)',
                                                            padding: '7px 14px',
                                                            fontSize: '12.5px',
                                                            fontWeight: 600,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        ✅ Selesai
                                                    </button>
                                                ) : isInactive ? (
                                                    <button 
                                                        disabled
                                                        style={{ 
                                                            backgroundColor: 'var(--surface-3)', 
                                                            color: 'var(--ink-4)',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: 'var(--r-xs)',
                                                            padding: '7px 14px',
                                                            fontSize: '12.5px',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        🔒 Tidak Aktif
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => router.visit(route('peserta.ujian.show', { examId: exam.id }))}
                                                        style={{ 
                                                            backgroundColor: isResume ? '#ca8a04' : exam.color, 
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: 'var(--r-xs)',
                                                            padding: '8px 16px',
                                                            fontSize: '12.5px',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            boxShadow: `0 4px 12px ${isResume ? '#ca8a0433' : exam.badge_color + '33'}`,
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        {isResume ? '🔄 Lanjutkan →' : 'Mulai Ujian →'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ═══ Pagination Controls ═══ */}
                        {exams.last_page > 1 && (
                            <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '12px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', marginTop: '24px' }}>
                                <div className="pg-info" style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                                    Menampilkan <strong>{exams.from}</strong> - <strong>{exams.to}</strong> dari{' '}
                                    <strong>{exams.total}</strong> ujian
                                </div>
                                <div className="pg-controls" style={{ display: 'flex', gap: '4px' }}>
                                    {(() => {
                                        const currentPage = exams.current_page;
                                        const lastPage = exams.last_page || 1;
                                        const links = exams.links;
                                        
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
                    </>
                )}
            </div>
        </PesertaLayout>
    );
}
