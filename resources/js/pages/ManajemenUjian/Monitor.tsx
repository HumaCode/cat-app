import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExamItem } from './Components/types';

interface ParticipantActivity {
    id: string;
    name: string;
    username: string;
    email: string;
    instansi?: string | null;
    nip_nik?: string | null;
    status: string;
    is_online: boolean;
    answered_count: number;
    sisa_waktu: number;
    violations_count: number;
    violations: Array<{ time: string; type: string }>;
}

interface MonitorProps {
    exam: ExamItem & {
        settings: {
            seksi?: Array<{
                title: string;
                soal_count: number;
            }>;
        };
    };
    participants: ParticipantActivity[];
}

export default function Monitor({ exam, participants: initialParticipants = [] }: MonitorProps) {
    const [participants, setParticipants] = useState<ParticipantActivity[]>(initialParticipants);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'warning'>('all');
    const [logs, setLogs] = useState<Array<{ time: string; name: string; action: string; type: 'info' | 'warning' | 'error' | 'success' }>>([
        { time: new Date().toTimeString().split(' ')[0], name: 'Sistem', action: 'Monitoring sesi dimulai.', type: 'info' },
    ]);

    const seksi = exam.settings?.seksi || [];
    const totalSoal = seksi.reduce((sum, s) => sum + (s.soal_count || 0), 0) || 100;

    // Simulated Real-Time Activity Updates
    useEffect(() => {
        const interval = setInterval(() => {
            setParticipants(prev => {
                const updated = prev.map(p => {
                    // Randomly update answered count (simulate progress)
                    let newAnswered = p.answered_count;
                    let hasProgress = false;
                    if (p.is_online && newAnswered < totalSoal && Math.random() > 0.6) {
                        newAnswered = Math.min(totalSoal, newAnswered + Math.floor(Math.random() * 3) + 1);
                        hasProgress = true;
                    }

                    // Randomly toggle connection status (simulate disconnects)
                    let newOnline = p.is_online;
                    let connectionChanged = false;
                    if (Math.random() > 0.95) {
                        newOnline = !p.is_online;
                        connectionChanged = true;
                    }

                    // Randomly simulate anti-cheat violation
                    let newViolationsCount = p.violations_count;
                    let newViolations = [...p.violations];
                    let violationAdded = false;
                    if (newOnline && Math.random() > 0.97) {
                        newViolationsCount += 1;
                        const violationTypes = [
                            'Keluar Fullscreen / Tab Blur',
                            'Terdeteksi membuka aplikasi lain',
                            'Copy-paste konten soal dicoba'
                        ];
                        const type = violationTypes[Math.floor(Math.random() * violationTypes.length)];
                        const time = new Date().toTimeString().split(' ')[0];
                        newViolations.unshift({ time, type });
                        violationAdded = true;

                        // Add to main proctoring log
                        setLogs(logList => [
                            { time, name: p.name, action: `Mencoba melakukan tindakan mencurigakan: ${type}`, type: 'error' },
                            ...logList
                        ]);
                    }

                    if (connectionChanged) {
                        const time = new Date().toTimeString().split(' ')[0];
                        setLogs(logList => [
                            {
                                time,
                                name: p.name,
                                action: newOnline ? 'Terhubung kembali ke ujian.' : 'Koneksi terputus dari server.',
                                type: newOnline ? 'success' : 'warning'
                            },
                            ...logList
                        ]);
                    }

                    if (hasProgress && newAnswered === totalSoal) {
                        const time = new Date().toTimeString().split(' ')[0];
                        setLogs(logList => [
                            { time, name: p.name, action: 'Selesai mengerjakan ujian dan mengirim lembar jawaban.', type: 'info' },
                            ...logList
                        ]);
                    }

                    return {
                        ...p,
                        answered_count: newAnswered,
                        is_online: newOnline,
                        violations_count: newViolationsCount,
                        violations: newViolations
                    };
                });
                return updated;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSoal]);

    // Admin Control Actions
    const handleResetSession = (name: string, id: string) => {
        const time = new Date().toTimeString().split(' ')[0];
        setLogs(prev => [
            { time, name: `Pengawas`, action: `Mereset sesi login peserta ${name}`, type: 'info' },
            ...prev
        ]);
        alert(`Sesi login untuk ${name} berhasil di-reset. Peserta sekarang dapat login kembali.`);
    };

    const handleSendWarning = (name: string) => {
        const time = new Date().toTimeString().split(' ')[0];
        setLogs(prev => [
            { time, name: `Pengawas`, action: `Mengirim peringatan teguran ke peserta ${name}`, type: 'warning' },
            ...prev
        ]);
        alert(`Teguran berhasil dikirimkan ke layar peserta ${name}.`);
    };

    const handleForceStop = (name: string, id: string) => {
        if (confirm(`Apakah Anda yakin ingin menghentikan paksa ujian untuk ${name}? Tindakan ini akan mengunci ujian peserta.`)) {
            const time = new Date().toTimeString().split(' ')[0];
            setLogs(prev => [
                { time, name: `Pengawas`, action: `Menghentikan ujian secara paksa untuk peserta ${name}`, type: 'error' },
                ...prev
            ]);
            setParticipants(prev =>
                prev.map(p => (p.id === id ? { ...p, is_online: false, answered_count: totalSoal } : p))
            );
        }
    };

    // Filters & Metrics calculation
    const totalCount = participants.length;
    const onlineCount = participants.filter(p => p.is_online).length;
    const completedCount = participants.filter(p => p.answered_count === totalSoal).length;
    const warningCount = participants.filter(p => p.violations_count > 0).length;

    const filteredParticipants = participants.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              p.email.toLowerCase().includes(search.toLowerCase()) ||
                              (p.nip_nik && p.nip_nik.includes(search));
        
        if (!matchesSearch) return false;
        
        if (statusFilter === 'online') return p.is_online;
        if (statusFilter === 'offline') return !p.is_online;
        if (statusFilter === 'warning') return p.violations_count > 0;
        return true;
    });

    return (
        <AuthenticatedLayout>
            <Head title={`Live Monitor - ${exam.title}`} />

            <div className="main-inner">
                {/* ── BREADCRUMB & HEADER ── */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap" style={{ background: 'var(--teal-s)' }}>
                            <i className="bi bi-display" style={{ color: 'var(--teal)' }} />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Live Monitor: <span style={{ color: 'var(--teal)' }}>{exam.title}</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '3px 0 0' }}>
                                Tipe: <strong>{exam.type}</strong> · Durasi total: <strong>{exam.duration} menit</strong> · Jumlah Seksi: <strong>{seksi.length} seksi</strong>
                            </p>
                        </div>
                    </div>
                    <nav className="breadcrumb-nav" aria-label="breadcrumb">
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('ujian.index'))}>
                            <span>Ujian</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <button type="button" className="bc-item bc-link" onClick={() => router.get(route('ujian.show', exam.id))}>
                            <span>Detail</span>
                        </button>
                        <i className="bi bi-chevron-right bc-sep" />
                        <span className="bc-item bc-active">Monitor Sesi</span>
                    </nav>
                </div>

                {/* ── KPI LIVE STATS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--clr-a': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Terdaftar</span>
                            <div className="kpi-icon-box"><i className="bi bi-people" style={{ color: 'var(--indigo)' }}></i></div>
                        </div>
                        <div className="kpi-num">{totalCount} <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400 }}>Peserta</span></div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Aktif / Online</span>
                            <div className="kpi-icon-box" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className="live-dot" style={{ position: 'static', display: 'inline-block' }}></span>
                                <i className="bi bi-wifi" style={{ color: 'var(--teal)' }}></i>
                            </div>
                        </div>
                        <div className="kpi-num">{onlineCount} <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400 }}>Online</span></div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--emerald)', '--clr-s': 'var(--emerald-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Selesai Kirim</span>
                            <div className="kpi-icon-box"><i className="bi bi-check2-circle" style={{ color: 'var(--emerald)' }}></i></div>
                        </div>
                        <div className="kpi-num">{completedCount} <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400 }}>Selesai</span></div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--rose)', '--clr-s': 'var(--rose-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Terindikasi Pelanggaran</span>
                            <div className="kpi-icon-box"><i className="bi bi-exclamation-triangle" style={{ color: 'var(--rose)' }}></i></div>
                        </div>
                        <div className="kpi-num" style={{ color: warningCount > 0 ? 'var(--rose)' : 'inherit' }}>
                            {warningCount} <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400 }}>Peringatan</span>
                        </div>
                    </div>
                </div>

                {/* ── MAIN LAYOUT (LEFT LIST, RIGHT LIVE ACTIVITY LOG) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
                    
                    {/* LEFT CONTAINER: Filter Bar & Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Inline Controls */}
                        <div className="filter-bar" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                            <div className="tab-pills" style={{ margin: 0 }}>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    Semua ({totalCount})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'online' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('online')}
                                >
                                    Online ({onlineCount})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'offline' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('offline')}
                                >
                                    Offline ({totalCount - onlineCount})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'warning' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('warning')}
                                >
                                    Kecurangan ({warningCount})
                                </button>
                            </div>

                            <div className="filter-search" style={{ height: '32px' }}>
                                <input
                                    type="text"
                                    placeholder="Cari nama / NIP / email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', width: '200px' }}
                                />
                                <i className="bi bi-search" style={{ fontSize: '13px', color: 'var(--ink-4)' }} />
                            </div>
                        </div>

                        {/* Participant Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                            {filteredParticipants.length === 0 ? (
                                <div className="table-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--ink-4)' }}>
                                    <i className="bi bi-people" style={{ fontSize: '36px', opacity: 0.4, display: 'block', marginBottom: '12px' }}></i>
                                    Tidak ada peserta aktif yang sesuai dengan kriteria filter.
                                </div>
                            ) : (
                                filteredParticipants.map(p => {
                                    const progressPercent = Math.round((p.answered_count / totalSoal) * 100);
                                    
                                    return (
                                        <div
                                            key={p.id}
                                            className="table-card"
                                            style={{
                                                padding: '16px 20px',
                                                borderLeft: p.violations_count > 0 
                                                    ? '4px solid var(--rose)' 
                                                    : p.is_online 
                                                        ? '4px solid var(--teal)' 
                                                        : '4px solid var(--ink-4)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '16px',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {/* Profile and connection indicator */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '50%',
                                                        background: 'var(--indigo-s)',
                                                        color: 'var(--indigo)',
                                                        fontWeight: 700,
                                                        fontSize: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {p.name.slice(0, 2)}
                                                    </div>
                                                    <span style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        width: '12px',
                                                        height: '12px',
                                                        borderRadius: '50%',
                                                        background: p.is_online ? 'var(--teal)' : 'var(--ink-4)',
                                                        border: '2px solid var(--surface)',
                                                        boxShadow: p.is_online ? '0 0 8px var(--teal)' : 'none'
                                                    }} />
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.name}</span>
                                                        <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>#{p.username}</span>
                                                    </div>
                                                    <div style={{ fontSize: '11.5px', color: 'var(--ink-4)', marginTop: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                        {p.nip_nik || 'NIP/NIK -'} · {p.instansi || 'Instansi Umum'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress column */}
                                            <div style={{ flex: 1.2, minWidth: '150px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '6px' }}>
                                                    <span>Jawaban Terisi</span>
                                                    <span>{p.answered_count} / {totalSoal} Soal ({progressPercent}%)</span>
                                                </div>
                                                <div className="prog-bar" style={{ height: '6px', background: 'var(--border-2)', borderRadius: '3px' }}>
                                                    <div
                                                        className="prog-fill"
                                                        style={{
                                                            width: `${progressPercent}%`,
                                                            background: progressPercent === 100 ? 'var(--emerald)' : 'var(--indigo)',
                                                            height: '100%',
                                                            borderRadius: '3px'
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Right indicators & actions */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                {/* Sisa waktu */}
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Sisa Waktu</div>
                                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 600, color: p.sisa_waktu < 15 ? 'var(--rose)' : 'var(--ink)' }}>
                                                        ⏱️ {p.sisa_waktu} mnt
                                                    </div>
                                                </div>

                                                {/* Pelanggaran badge */}
                                                {p.violations_count > 0 && (
                                                    <div style={{
                                                        background: 'var(--rose-s)',
                                                        border: '1px solid var(--rose)',
                                                        color: 'var(--rose)',
                                                        borderRadius: 'var(--r-xs)',
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        ⚠️ {p.violations_count} Pelanggaran
                                                    </div>
                                                )}

                                                {/* Action Buttons row */}
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        type="button"
                                                        className="action-btn edit"
                                                        title="Kirim Teguran/Warning ke layar peserta"
                                                        onClick={() => handleSendWarning(p.name)}
                                                    >
                                                        <i className="bi bi-chat-dots" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="action-btn report"
                                                        style={{ color: 'var(--amber)', background: 'var(--amber-s)' }}
                                                        title="Reset Login Device (Jika pindah perangkat/kendala teknis)"
                                                        onClick={() => handleResetSession(p.name, p.id)}
                                                    >
                                                        <i className="bi bi-arrow-repeat" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="action-btn danger"
                                                        title="Hentikan paksa & kunci lembar jawaban"
                                                        onClick={() => handleForceStop(p.name, p.id)}
                                                    >
                                                        <i className="bi bi-x-circle" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT CONTAINER: Real-time Live Activities Feed */}
                    <div className="table-card" style={{ padding: '0', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="live-dot" style={{ position: 'static' }}></div>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Aktivitas Proctoring Live</span>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {logs.map((log, index) => {
                                const logClr = log.type === 'error' 
                                    ? 'var(--rose)' 
                                    : log.type === 'warning' 
                                        ? 'var(--amber)' 
                                        : log.type === 'success' 
                                            ? 'var(--emerald)' 
                                            : 'var(--indigo)';
                                            
                                return (
                                    <div key={index} style={{ fontSize: '12px', borderBottom: '1px dashed var(--border-2)', paddingBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-4)', marginBottom: '4px', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                                            <span>{log.name}</span>
                                            <span>{log.time}</span>
                                        </div>
                                        <div style={{ color: 'var(--ink-2)', lineHeight: 1.4, display: 'flex', gap: '6px', alignItems: 'start' }}>
                                            <span style={{ color: logClr, flexShrink: 0 }}>●</span>
                                            <span>{log.action}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: '11px', color: 'var(--ink-4)', textAlign: 'center' }}>
                            Menyambungkan melalui Secure WebSocket (WSS) · Auto-refresh
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
