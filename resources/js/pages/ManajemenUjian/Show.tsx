import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExamItem } from './Components/types';
import '../../../css/bank-soal.css';
import '../../../css/manajemen-ujian.css';

interface ShowProps {
    exam: ExamItem & {
        category?: { name: string; icon: string } | null;
        user?: { name: string } | null;
        settings: {
            show_results?: boolean;
            show_answers?: boolean;
            shuffle_questions?: boolean;
            shuffle_options?: boolean;
            lockdown_mode?: boolean;
            activity_logging?: boolean;
            attempts_limit?: number;
            access_type?: string;
            passing_grade_type?: string;
            participant_method?: string;
            filter_institution?: string;
            quota?: number;
            seksi?: Array<{
                title: string;
                category_id?: string;
                icon: string;
                soal_count: number;
                duration: number;
                correct_points: number;
                incorrect_points: number;
                passing_grade?: number;
                status: string;
            }>;
        };
    };
    participants?: Array<{
        id: string;
        name: string;
        username: string;
        email: string;
        instansi?: string | null;
        nip_nik?: string | null;
        jabatan?: string | null;
        status?: string | null;
    }>;
    availableParticipants?: Array<{
        id: string;
        name: string;
        username: string;
        email: string;
        instansi?: string | null;
        nip_nik?: string | null;
    }>;
    institutions?: string[];
    categories?: Array<{
        id: string;
        name: string;
        icon: string;
        slug: string;
    }>;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

const STATUS_LABEL: Record<string, string> = {
    aktif: 'Aktif',
    terjadwal: 'Terjadwal',
    selesai: 'Selesai',
    draft: 'Draft',
};

const TYPE_ICON: Record<string, string> = {
    Simulasi: 'bi-crosshair',
    Latihan: 'bi-book',
    Resmi: 'bi-building',
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--border-2)' }}>
            <span style={{ minWidth: '180px', fontSize: '12px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.4px', paddingTop: '2px' }}>{label}</span>
            <span style={{ fontSize: '13.5px', color: 'var(--ink)', flex: 1 }}>{value}</span>
        </div>
    );
}

function BoolBadge({ value, labelTrue = 'Ya', labelFalse = 'Tidak' }: { value: boolean; labelTrue?: string; labelFalse?: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
            background: value ? 'var(--emerald-s)' : 'var(--rose-s)',
            color: value ? 'var(--emerald)' : 'var(--rose)',
        }}>
            <i className={value ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'} style={{ fontSize: '11px' }}></i>
            {value ? labelTrue : labelFalse}
        </span>
    );
}

function SectionCard({ s, idx, categories = [] }: { s: NonNullable<ShowProps['exam']['settings']['seksi']>[0]; idx: number; categories?: ShowProps['categories'] }) {
    const colors = ['var(--indigo)', 'var(--teal)', 'var(--emerald)', 'var(--amber)', 'var(--rose)'];
    const color = colors[idx % colors.length];
    const colorS = color.replace(')', '-s)').replace('var(--', 'var(--');

    return (
        <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
            overflow: 'hidden', boxShadow: 'var(--shadow-xs)', position: 'relative',
        }}>
            <div style={{ height: '3px', background: color }} />
            <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--r-sm)', background: colorS, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                            {s.icon?.startsWith('bi ') ? <i className={s.icon}></i> : (s.icon || '📝')}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{s.title}</div>
                                {s.category_id && (
                                    <span style={{ fontSize: '10.5px', background: 'var(--indigo-s)', color: 'var(--indigo)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                        {categories.find(c => c.id === s.category_id)?.name || 'Kategori'}
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--ink-4)', marginTop: '2px' }}>Seksi {idx + 1}</div>
                        </div>
                    </div>
                    <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                        background: s.status === 'aktif' ? 'var(--emerald-s)' : 'var(--amber-s)',
                        color: s.status === 'aktif' ? 'var(--emerald)' : 'var(--amber)',
                    }}>
                        {s.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                    {[
                        { label: 'Jumlah Soal', value: `${s.soal_count} soal`, icon: 'bi-list-ol' },
                        { label: 'Durasi', value: `${s.duration} menit`, icon: 'bi-clock' },
                        { label: 'Poin Benar', value: `+${s.correct_points}`, icon: 'bi-plus-circle' },
                        { label: 'Poin Salah', value: s.incorrect_points < 0 ? `${s.incorrect_points}` : (s.incorrect_points === 0 ? '0' : `-${s.incorrect_points}`), icon: 'bi-dash-circle' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '12px', textAlign: 'center',
                            borderRight: i < 3 ? '1px solid var(--border-2)' : 'none',
                        }}>
                            <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <i className={`bi ${stat.icon}`}></i> {stat.label}
                            </div>
                            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>{stat.value}</div>
                        </div>
                    ))}
                </div>
                {s.passing_grade !== undefined && s.passing_grade > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="bi bi-trophy" style={{ color: 'var(--amber)' }}></i>
                        Passing grade seksi: <strong style={{ color: 'var(--ink)' }}>{s.passing_grade}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    emptyMessage?: string;
}

function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Pilih Instansi...',
    emptyMessage = 'Tidak ditemukan'
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '240px' }}>
            <div
                onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
                style={{
                    height: '38px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xs)',
                    background: 'var(--surface)',
                    color: value ? 'var(--ink)' : 'var(--ink-4)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginRight: '8px' }}>
                    {value || placeholder}
                </span>
                <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '11px', color: 'var(--ink-4)' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xs)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 1000,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <div className="filter-search" style={{ height: '32px', width: '100%', padding: '0 8px' }}>
                        <input
                            type="text"
                            placeholder="Cari instansi..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                            style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', fontSize: '12.5px', width: '100%' }}
                        />
                        <i className="bi bi-search" style={{ fontSize: '12px', color: 'var(--ink-4)' }} />
                    </div>

                    <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'block' }}>
                        <div
                            onClick={() => { onChange(''); setIsOpen(false); }}
                            style={{
                                padding: '8px 10px',
                                fontSize: '12.5px',
                                color: !value ? 'var(--indigo)' : 'var(--ink-2)',
                                background: !value ? 'var(--indigo-s)' : 'transparent',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: !value ? 600 : 400
                            }}
                        >
                            Semua Instansi
                        </div>
                        {filteredOptions.length === 0 && search && (
                            <div style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ink-4)', textAlign: 'center' }}>
                                {emptyMessage}
                            </div>
                        )}
                        {filteredOptions.map((opt, i) => {
                            const isSelected = value === opt;
                            return (
                                <div
                                    key={i}
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    style={{
                                        padding: '8px 10px',
                                        fontSize: '12.5px',
                                        color: isSelected ? 'var(--indigo)' : 'var(--ink-2)',
                                        background: isSelected ? 'var(--indigo-s)' : 'transparent',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: isSelected ? 600 : 400,
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {opt}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ExamShow({ exam, categories = [], participants = [], availableParticipants = [], institutions = [], flash = {} }: ShowProps) {
    const s = exam.settings || {};
    const seksi = s.seksi || [];
    const totalDuration = seksi.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalSoal = seksi.reduce((sum, s) => sum + (s.soal_count || 0), 0);

    const [isMounted, setIsMounted] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchRegistered, setSearchRegistered] = useState('');
    const [searchAvailable, setSearchAvailable] = useState('');
    const [instansiFilter, setInstansiFilter] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchRegistered]);

    // List of institutions from database with local parsing fallback
    const uniqueInstansi = institutions.length > 0 ? institutions : Array.from(new Set(
        availableParticipants
            .map(p => p.instansi)
            .filter((instansi): instansi is string => !!instansi)
    )).sort();

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | '' }>({
        show: false,
        message: '',
        type: 'success',
    });

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

    const formatDate = (dt: string | null) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    // Filter registered participants locally
    const filteredParticipants = participants.filter(p => {
        const query = searchRegistered.toLowerCase();
        return (
            p.name.toLowerCase().includes(query) ||
            p.username.toLowerCase().includes(query) ||
            (p.email && p.email.toLowerCase().includes(query)) ||
            (p.nip_nik && p.nip_nik.toLowerCase().includes(query))
        );
    });

    const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);
    const paginatedParticipants = filteredParticipants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPaginationRange = (current: number, total: number) => {
        const range: (number | string)[] = [];
        const delta = 1;

        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                (i >= current - delta && i <= current + delta)
            ) {
                range.push(i);
            } else if (
                i === current - delta - 1 ||
                i === current + delta + 1
            ) {
                range.push('...');
            }
        }

        return range.reduce<(number | string)[]>((acc, val) => {
            if (val === '...' && acc[acc.length - 1] === '...') {
                return acc;
            }
            acc.push(val);
            return acc;
        }, []);
    };

    // Filter available participants locally
    const filteredAvailable = availableParticipants.filter(p => {
        const query = searchAvailable.toLowerCase();
        const matchesSearch = (
            p.name.toLowerCase().includes(query) ||
            p.username.toLowerCase().includes(query) ||
            (p.email && p.email.toLowerCase().includes(query)) ||
            (p.nip_nik && p.nip_nik.toLowerCase().includes(query))
        );
        const matchesInstansi = !instansiFilter || p.instansi === instansiFilter;
        return matchesSearch && matchesInstansi;
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUserIds(filteredAvailable.map(p => p.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleToggleSelect = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleAddParticipants = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserIds.length === 0) return;

        setProcessing(true);
        router.post(route('ujian.peserta.add', exam.id), {
            user_ids: selectedUserIds
        }, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setSelectedUserIds([]);
                setSearchAvailable('');
                setInstansiFilter('');
                triggerToast('Peserta berhasil ditambahkan ke ujian.', 'success');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleRemoveParticipantConfirm = () => {
        if (!deleteConfirmTarget) return;

        setIsDeleting(true);
        router.delete(route('ujian.peserta.remove', { id: exam.id, userId: deleteConfirmTarget.id }), {
            onSuccess: () => {
                setDeleteConfirmTarget(null);
                triggerToast('Peserta berhasil dihapus dari ujian.', 'success');
            },
            onError: () => {
                triggerToast('Gagal menghapus peserta dari ujian.', 'error');
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Ujian — ${exam.title}`} />

            <div className="main-inner">
                {/* ── Page Header Card ── */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap">
                            <i className={`bi ${TYPE_ICON[exam.type] || 'bi-journal-text'}`} />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                {exam.title}
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                                <span className={`status-badge ${exam.status}`}>{STATUS_LABEL[exam.status] || exam.status}</span>
                                <span className={`type-badge ${exam.type.toLowerCase()}`}>{exam.type}</span>
                                <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
                                    <i className="bi bi-clock" style={{ marginRight: '4px' }}></i>
                                    {totalDuration > 0 ? `${totalDuration} menit total` : `${exam.duration} menit`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('dashboard'))}>
                            <i className="bi bi-house-door-fill bc-home-icon" />
                            <span>Dashboard</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('ujian.index'))}>
                            <span>Manajemen Ujian</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <span className="bc-item bc-active">Detail Ujian</span>
                    </nav>
                </div>

                <div style={{ padding: '0 0 32px' }}>
                    {/* ── KPI Strip ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                        {[
                            { label: 'Total Seksi', value: seksi.length, icon: 'bi-layers', color: 'var(--indigo)' },
                            { label: 'Total Soal', value: totalSoal, icon: 'bi-list-ol', color: 'var(--teal)' },
                            { label: 'Total Durasi', value: `${totalDuration || exam.duration} mnt`, icon: 'bi-clock', color: 'var(--emerald)' },
                            { label: 'Passing Grade', value: `${exam.passing_grade || 0}%`, icon: 'bi-trophy', color: 'var(--amber)' },
                        ].map((kpi, i) => (
                            <div key={i} className="kpi-card" style={{ '--clr-a': kpi.color, '--clr-s': kpi.color.replace(')', '-s)').replace('var(--', 'var(--') } as React.CSSProperties}>
                                <div className="kpi-top">
                                    <span className="kpi-label">{kpi.label}</span>
                                    <div className="kpi-icon-box"><i className={`bi ${kpi.icon}`} style={{ color: kpi.color }}></i></div>
                                </div>
                                <div className="kpi-num">{kpi.value}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

                        {/* ── LEFT COLUMN ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Informasi Ujian */}
                            <div className="table-card" style={{ padding: '0' }}>
                                <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--r-sm)', background: 'var(--indigo-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="bi bi-info-circle" style={{ color: 'var(--indigo)', fontSize: '15px' }}></i>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Informasi Ujian</div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--ink-4)' }}>Data dasar dan jadwal ujian</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <button
                                            type="button"
                                            className="btn-modal confirm"
                                            style={{ background: 'var(--teal)', fontSize: '12.5px', padding: '6px 14px', borderRadius: 'var(--r-xs)', flex: 'none', width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            onClick={() => router.visit(route('ujian.monitor', exam.id))}
                                        >
                                            <i className="bi bi-display" style={{ fontSize: '13px' }}></i>
                                            <span>Monitor Live</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-modal confirm"
                                            style={{ background: 'var(--indigo)', fontSize: '12.5px', padding: '6px 14px', borderRadius: 'var(--r-xs)', flex: 'none', width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            onClick={() => router.visit(route('ujian.report', exam.id))}
                                        >
                                            <i className="bi bi-bar-chart" style={{ fontSize: '13px' }}></i>
                                            <span>Laporan Hasil</span>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ padding: '6px 24px 20px' }}>
                                    <InfoRow label="Judul Ujian" value={<strong>{exam.title}</strong>} />
                                    <InfoRow label="Tipe Ujian" value={<span className={`type-badge ${exam.type.toLowerCase()}`}>{exam.type}</span>} />
                                    <InfoRow label="Status" value={<span className={`status-badge ${exam.status}`}>{STATUS_LABEL[exam.status]}</span>} />
                                    <InfoRow label="Tanggal Mulai" value={<span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{formatDate(exam.start_time)}</span>} />
                                    <InfoRow label="Tanggal Selesai" value={<span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{formatDate(exam.end_time)}</span>} />
                                    <InfoRow label="Durasi Total" value={`${totalDuration || exam.duration} menit`} />
                                    {exam.instructions && (
                                        <div style={{ padding: '12px 0' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Instruksi Ujian</div>
                                            <div style={{
                                                padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)',
                                                border: '1px solid var(--border-2)', fontSize: '13.5px', color: 'var(--ink-2)', lineHeight: 1.7,
                                                whiteSpace: 'pre-wrap',
                                            }}>
                                                {exam.instructions}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Soal & Seksi */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="bi bi-layers" style={{ color: 'var(--indigo)', fontSize: '17px' }}></i>
                                        <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>Soal & Seksi</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{seksi.length} seksi · {totalSoal} soal</span>
                                </div>
                                {seksi.length === 0 ? (
                                    <div className="table-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-4)' }}>
                                        <i className="bi bi-inbox" style={{ fontSize: '32px', opacity: 0.4, display: 'block', marginBottom: '8px' }}></i>
                                        Belum ada seksi dikonfigurasi
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                        {seksi.map((sec, idx) => (
                                            <SectionCard key={idx} s={sec} idx={idx} categories={categories} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* ── SEKSI DAFTAR PESERTA ── */}
                            <div className="table-card" style={{ padding: '0', marginTop: '10px' }}>
                                <div style={{
                                    padding: '18px 24px',
                                    borderBottom: '1px solid var(--border-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--r-sm)', background: 'var(--emerald-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="bi bi-people" style={{ color: 'var(--emerald)', fontSize: '15px' }}></i>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Daftar Peserta Terdaftar</div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--ink-4)' }}>Peserta yang berhak mengikuti ujian ini</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="filter-search" style={{ height: '32px' }}>
                                            <input
                                                type="text"
                                                placeholder="Cari nama / email..."
                                                value={searchRegistered}
                                                onChange={e => setSearchRegistered(e.target.value)}
                                                style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', fontSize: '12.5px', width: '160px' }}
                                            />
                                            <i className="bi bi-search" style={{ fontSize: '13px', color: 'var(--ink-4)', cursor: 'default' }} />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-modal confirm"
                                            onClick={() => setIsAddModalOpen(true)}
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
                                            <i className="bi bi-plus-lg" />
                                            <span>Tambah Peserta</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="table-scroll">
                                    <table className="main-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '60px', textAlign: 'center' }}>No</th>
                                                <th>Nama Lengkap</th>
                                                <th>NIP / NIK</th>
                                                <th>Instansi / Sekolah</th>
                                                <th style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredParticipants.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-4)' }}>
                                                        <i className="bi bi-people" style={{ fontSize: '32px', opacity: 0.3, display: 'block', marginBottom: '8px' }}></i>
                                                        {searchRegistered ? 'Tidak ditemukan peserta yang cocok' : 'Belum ada peserta terdaftar'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedParticipants.map((p, idx) => (
                                                    <tr key={p.id}>
                                                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--ink-3)' }}>
                                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '13.5px' }}>{p.name}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>@{p.username} · {p.email}</div>
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>{p.nip_nik || '—'}</td>
                                                        <td style={{ fontSize: '13px' }}>{p.instansi || '—'}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button
                                                                type="button"
                                                                className="action-btn danger"
                                                                title="Hapus dari Ujian"
                                                                onClick={() => setDeleteConfirmTarget({ id: p.id, name: p.name })}
                                                            >
                                                                <i className="bi bi-trash" style={{ fontSize: '13px' }}></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Row */}
                                <div className="pagination-row">
                                    <div className="pagination-info">
                                        Menampilkan <strong>{filteredParticipants.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> hingga <strong>{Math.min(currentPage * itemsPerPage, filteredParticipants.length)}</strong> dari <strong>{filteredParticipants.length}</strong> peserta
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="pagination-btns">
                                            <button
                                                type="button"
                                                className="page-btn"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            >
                                                <i className="bi bi-chevron-left" />
                                            </button>
                                            {getPaginationRange(currentPage, totalPages).map((p, index) => {
                                                if (p === '...') {
                                                    return (
                                                        <span key={`ell-${index}`} style={{ padding: '0 6px', fontSize: '13px', color: 'var(--ink-4)' }}>...</span>
                                                    );
                                                }
                                                const isActive = p === currentPage;
                                                return (
                                                    <button
                                                        key={`page-${p}`}
                                                        type="button"
                                                        className={`page-btn ${isActive ? 'active' : ''}`}
                                                        onClick={() => setCurrentPage(p as number)}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                className="page-btn"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            >
                                                <i className="bi bi-chevron-right" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Pengaturan */}
                            <div className="table-card" style={{ padding: '0' }}>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: 'var(--r-sm)', background: 'var(--teal-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-gear" style={{ color: 'var(--teal)', fontSize: '14px' }}></i>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>Pengaturan</span>
                                </div>
                                <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[
                                        { label: 'Tampilkan Hasil', value: s.show_results ?? true },
                                        { label: 'Tampilkan Kunci Jawaban', value: s.show_answers ?? false },
                                        { label: 'Acak Soal', value: s.shuffle_questions ?? true },
                                        { label: 'Acak Pilihan', value: s.shuffle_options ?? true },
                                        { label: 'Lockdown Mode', value: s.lockdown_mode ?? true },
                                        { label: 'Activity Logging', value: s.activity_logging ?? true },
                                    ].map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{opt.label}</span>
                                            <BoolBadge value={opt.value} />
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '6px', borderTop: '1px solid var(--border-2)' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Batas Percobaan</span>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>
                                            {s.attempts_limit ?? 1}×
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Tipe Akses</span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--indigo-s)', color: 'var(--indigo)' }}>
                                            {s.access_type || 'Terdaftar'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Peserta */}
                            <div className="table-card" style={{ padding: '0' }}>
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: 'var(--r-sm)', background: 'var(--emerald-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-people" style={{ color: 'var(--emerald)', fontSize: '14px' }}></i>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>Peserta</span>
                                </div>
                                <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Metode</span>
                                        <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{s.participant_method || 'Pilih dari daftar'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Filter Institusi</span>
                                        <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{s.filter_institution || 'Semua institusi'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid var(--border-2)' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Kuota</span>
                                        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--mono)' }}>
                                            {s.quota === 0 || !s.quota ? '∞' : s.quota}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="table-card" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Metadata</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                                        <span style={{ color: 'var(--ink-4)' }}>ID Ujian</span>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-3)' }}>{exam.id.substring(0, 8)}…</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                                        <span style={{ color: 'var(--ink-4)' }}>Dibuat</span>
                                        <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                                            {new Date(exam.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                                        <span style={{ color: 'var(--ink-4)' }}>Diperbarui</span>
                                        <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                                            {new Date(exam.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MODAL TAMBAH PESERTA ── */}
            {isAddModalOpen && isMounted && createPortal(
                <div className="modal-backdrop" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.45)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div className="modal-container" style={{
                        background: 'var(--surface)',
                        width: '100%',
                        maxWidth: '960px',
                        borderRadius: 'var(--r)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <form onSubmit={handleAddParticipants}>
                            {/* Modal Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Tambah Peserta ke Ujian</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '4px 0 0' }}>Pilih peserta aktif di instansi Anda</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setSelectedUserIds([]); setInstansiFilter(''); }}
                                    style={{ background: 'none', border: 'none', color: 'var(--ink-4)', cursor: 'pointer', fontSize: '18px' }}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div style={{ padding: '20px 24px' }}>
                                {/* Search & Instansi Filter */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '12px', marginBottom: '16px' }}>
                                    <div className="filter-search" style={{ height: '38px' }}>
                                        <input
                                            type="text"
                                            placeholder="Cari berdasarkan nama / email / NIP..."
                                            value={searchAvailable}
                                            onChange={e => setSearchAvailable(e.target.value)}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', fontSize: '13px', width: '100%' }}
                                        />
                                        <i className="bi bi-search" style={{ fontSize: '13px', color: 'var(--ink-4)', cursor: 'default' }} />
                                    </div>
                                    <SearchableSelect
                                        options={uniqueInstansi}
                                        value={instansiFilter}
                                        onChange={setInstansiFilter}
                                        placeholder="Semua Instansi"
                                    />
                                </div>

                                {/* Select All Checkbox */}
                                {filteredAvailable.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px 12px',
                                        background: 'var(--surface-2)',
                                        border: '1px solid var(--border-2)',
                                        borderRadius: 'var(--r-xs)',
                                        marginBottom: '10px'
                                    }}>
                                        <input
                                            type="checkbox"
                                            id="select-all"
                                            checked={filteredAvailable.length > 0 && selectedUserIds.length === filteredAvailable.length}
                                            onChange={e => handleSelectAll(e.target.checked)}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                        />
                                        <label htmlFor="select-all" style={{ marginLeft: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', width: '100%' }}>
                                            Pilih Semua ({filteredAvailable.length} orang)
                                        </label>
                                    </div>
                                )}

                                {/* Available List */}
                                <div style={{
                                    maxHeight: '280px',
                                    overflowY: 'auto',
                                    border: '1px solid var(--border-2)',
                                    borderRadius: 'var(--r-sm)',
                                    background: 'var(--surface-2)'
                                }}>
                                    {filteredAvailable.length === 0 ? (
                                        <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--ink-4)' }}>
                                            <i className="bi bi-person-x" style={{ fontSize: '24px', opacity: 0.4, display: 'block', marginBottom: '8px' }}></i>
                                            Tidak ada peserta tersedia untuk ditambahkan
                                        </div>
                                    ) : (
                                        filteredAvailable.map(p => {
                                            const isSelected = selectedUserIds.includes(p.id);
                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => handleToggleSelect(p.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '10px 14px',
                                                        borderBottom: '1px solid var(--border-2)',
                                                        cursor: 'pointer',
                                                        background: isSelected ? 'var(--indigo-s)' : 'var(--surface)',
                                                        transition: 'background 0.15s'
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {}} // handled by parent div onClick
                                                        style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                                    />
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginLeft: '12px' }}>
                                                        <div>
                                                            <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--indigo)' : 'var(--ink)' }}>{p.name}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>
                                                                {p.email} · NIP/NIK: {p.nip_nik || '—'}
                                                            </div>
                                                        </div>
                                                        {p.instansi && (
                                                            <span style={{
                                                                fontSize: '11px',
                                                                fontWeight: 600,
                                                                padding: '3px 10px',
                                                                borderRadius: '100px',
                                                                background: isSelected ? 'rgba(79, 70, 229, 0.15)' : 'var(--surface-3)',
                                                                color: isSelected ? 'var(--indigo)' : 'var(--ink-3)'
                                                            }}>
                                                                {p.instansi}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-2)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    className="btn-modal cancel"
                                    onClick={() => { setIsAddModalOpen(false); setSelectedUserIds([]); setInstansiFilter(''); }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--ink-2)',
                                        padding: '0 16px',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        height: '36px',
                                        borderRadius: 'var(--r-xs)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="btn-modal confirm"
                                    disabled={selectedUserIds.length === 0 || processing}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        background: 'var(--indigo)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '0 18px',
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        height: '36px',
                                        borderRadius: 'var(--r-xs)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {processing ? 'Menambahkan...' : `Tambah Terpilih (${selectedUserIds.length})`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Confirm Delete Participant Modal */}
            {deleteConfirmTarget && isMounted && createPortal(
                <div className="modal-overlay open" onClick={() => setDeleteConfirmTarget(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                        <div className="modal-icon-wrap" style={{ background: 'var(--rose-s)', color: 'var(--rose)' }}>🗑️</div>
                        <h3 className="modal-title">Hapus Peserta?</h3>
                        <p className="modal-desc" style={{ textAlign: 'center' }}>
                            Apakah Anda yakin ingin menghapus peserta <strong>{deleteConfirmTarget.name}</strong> dari ujian ini? Progres pengerjaan peserta ini akan terhapus secara permanen.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-modal cancel" type="button" disabled={isDeleting} onClick={() => setDeleteConfirmTarget(null)}>Batal</button>
                            <button className="btn-modal confirm" type="button" disabled={isDeleting} onClick={handleRemoveParticipantConfirm}>
                                {isDeleting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Sedang proses...
                                    </>
                                ) : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Toast Notification */}
            {isMounted && createPortal(
                <div className={`dynamic-island-toast-container ${toast.show ? 'show' : ''}`}>
                    <style>{`
                        .dynamic-island-toast-container {
                            position: fixed;
                            bottom: 30px;
                            left: 50%;
                            transform: translateX(-50%) translateY(100px);
                            z-index: 99999;
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
                </div>,
                document.body
            )}
        </AuthenticatedLayout>
    );
}
