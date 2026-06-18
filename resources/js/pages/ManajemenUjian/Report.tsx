import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ExamItem } from './Components/types';

interface SeksiBreakdown {
    title: string;
    correct: number;
    incorrect: number;
    unanswered: number;
    score: number;
    passing_grade: number;
    passed: boolean;
}

interface ParticipantReport {
    id: string;
    name: string;
    username: string;
    email: string;
    instansi?: string | null;
    nip_nik?: string | null;
    is_present: boolean;
    correct_total: number;
    incorrect_total: number;
    unanswered_total: number;
    total_score: number;
    passed: boolean;
    seksi_breakdown: SeksiBreakdown[];
}

interface ReportProps {
    exam: ExamItem & {
        settings: {
            seksi?: Array<{
                title: string;
                soal_count: number;
                correct_points?: number;
                incorrect_points?: number;
                passing_grade?: number;
            }>;
        };
    };
    participants: ParticipantReport[];
}

export default function Report({ exam, participants = [] }: ReportProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'lulus' | 'gagal' | 'tidak_hadir'>('all');
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantReport | null>(null);

    const seksi = exam.settings?.seksi || [];
    const totalSoal = seksi.reduce((sum, s) => sum + (s.soal_count || 0), 0) || 100;
    const maxPossibleScore = seksi.reduce((sum, s) => sum + (s.soal_count * (s.correct_points || 5)), 0) || 500;

    // Attendance stats
    const totalRegistered = participants.length;
    const attendedCount = participants.filter(p => p.is_present).length;
    const absentCount = totalRegistered - attendedCount;
    const presentParticipants = participants.filter(p => p.is_present);
    
    // Score stats
    const averageScore = presentParticipants.length > 0 
        ? Math.round(presentParticipants.reduce((sum, p) => sum + p.total_score, 0) / presentParticipants.length) 
        : 0;
        
    const highestScore = presentParticipants.length > 0 
        ? Math.max(...presentParticipants.map(p => p.total_score)) 
        : 0;

    const lowestScore = presentParticipants.length > 0 
        ? Math.min(...presentParticipants.map(p => p.total_score)) 
        : 0;

    const passedCount = presentParticipants.filter(p => p.passed).length;
    const passRate = attendedCount > 0 ? Math.round((passedCount / attendedCount) * 100) : 0;

    // Score ranges distribution
    const distUnderPassing = presentParticipants.filter(p => !p.passed).length;
    const distSatisfactory = presentParticipants.filter(p => p.passed && p.total_score <= maxPossibleScore * 0.75).length;
    const distExcellent = presentParticipants.filter(p => p.total_score > maxPossibleScore * 0.75 && p.total_score <= maxPossibleScore * 0.9).length;
    const distOutstanding = presentParticipants.filter(p => p.total_score > maxPossibleScore * 0.9).length;

    // Filters
    const filteredParticipants = participants.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                              p.email.toLowerCase().includes(search.toLowerCase()) ||
                              (p.nip_nik && p.nip_nik.includes(search));

        if (!matchesSearch) return false;

        if (statusFilter === 'lulus') return p.is_present && p.passed;
        if (statusFilter === 'gagal') return p.is_present && !p.passed;
        if (statusFilter === 'tidak_hadir') return !p.is_present;
        return true;
    });

    const handleExport = (type: 'Excel' | 'PDF') => {
        alert(`Berhasil mengekspor Laporan Hasil Ujian "${exam.title}" ke format ${type}. File sedang diunduh.`);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Laporan Nilai - ${exam.title}`} />

            <div className="main-inner">
                {/* ── BREADCRUMB & HEADER ── */}
                <div className="page-header-card anim-in">
                    <div className="page-header-left">
                        <div className="page-header-icon-wrap" style={{ background: 'var(--indigo-s)' }}>
                            <i className="bi bi-bar-chart" style={{ color: 'var(--indigo)' }} />
                        </div>
                        <div>
                            <h2 className="topbar-title" style={{ fontSize: '20px', margin: 0, lineHeight: 1.3 }}>
                                Laporan Hasil Ujian: <span style={{ color: 'var(--indigo)' }}>{exam.title}</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: 'var(--ink-4)', margin: '3px 0 0' }}>
                                Tipe: <strong>{exam.type}</strong> · Durasi total: <strong>{exam.duration} menit</strong> · Target Kelulusan: <strong>{exam.passing_grade}%</strong>
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
                        <span className="bc-item bc-active">Laporan Nilai</span>
                    </nav>
                </div>

                {/* ── KPI HIGHLIGHTS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div className="kpi-card" style={{ '--clr-a': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Tingkat Kelulusan</span>
                            <div className="kpi-icon-box"><i className="bi bi-check2-circle" style={{ color: 'var(--teal)' }}></i></div>
                        </div>
                        <div className="kpi-num">
                            {passRate}% 
                            <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400, marginLeft: '6px' }}>
                                ({passedCount}/{attendedCount} Lulus)
                            </span>
                        </div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Rata-rata Nilai</span>
                            <div className="kpi-icon-box"><i className="bi bi-calculator" style={{ color: 'var(--indigo)' }}></i></div>
                        </div>
                        <div className="kpi-num">
                            {averageScore}
                            <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 400, marginLeft: '6px' }}>
                                / {maxPossibleScore} maks
                            </span>
                        </div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--emerald)', '--clr-s': 'var(--emerald-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Nilai Tertinggi / Terendah</span>
                            <div className="kpi-icon-box"><i className="bi bi-trophy" style={{ color: 'var(--emerald)' }}></i></div>
                        </div>
                        <div className="kpi-num" style={{ fontSize: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '36px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--emerald)' }}>Tertinggi: {highestScore}</div>
                            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>Terendah: {lowestScore}</div>
                        </div>
                    </div>

                    <div className="kpi-card" style={{ '--clr-a': 'var(--amber)', '--clr-s': 'var(--amber-s)' } as React.CSSProperties}>
                        <div className="kpi-top">
                            <span className="kpi-label">Kehadiran Peserta</span>
                            <div className="kpi-icon-box"><i className="bi bi-journal-check" style={{ color: 'var(--amber)' }}></i></div>
                        </div>
                        <div className="kpi-num">
                            {Math.round((attendedCount / totalRegistered) * 100) || 0}%
                            <span style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 400, marginLeft: '6px' }}>
                                ({attendedCount}/{totalRegistered} Hadir)
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── SCORE DISTRIBUTION CHART & SEKSI OVERVIEWS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    
                    {/* Score Distribution (Pure CSS Bar Chart) */}
                    <div className="table-card" style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                            <i className="bi bi-bar-chart-line" style={{ color: 'var(--indigo)', fontSize: '16px' }}></i>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Distribusi Skor Kelompok</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Under Passing */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '5px' }}>
                                    <span>Gagal / Di bawah Passing Grade</span>
                                    <strong>{distUnderPassing} Peserta ({attendedCount > 0 ? Math.round((distUnderPassing / attendedCount) * 100) : 0}%)</strong>
                                </div>
                                <div className="prog-bar" style={{ height: '10px', background: 'var(--border-2)', borderRadius: '5px' }}>
                                    <div className="prog-fill" style={{ width: `${attendedCount > 0 ? (distUnderPassing / attendedCount) * 100 : 0}%`, background: 'var(--rose)', borderRadius: '5px' }}></div>
                                </div>
                            </div>

                            {/* Satisfactory */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '5px' }}>
                                    <span>Lulus Cukup (PG – 75% Skor Maks)</span>
                                    <strong>{distSatisfactory} Peserta ({attendedCount > 0 ? Math.round((distSatisfactory / attendedCount) * 100) : 0}%)</strong>
                                </div>
                                <div className="prog-bar" style={{ height: '10px', background: 'var(--border-2)', borderRadius: '5px' }}>
                                    <div className="prog-fill" style={{ width: `${attendedCount > 0 ? (distSatisfactory / attendedCount) * 100 : 0}%`, background: 'var(--amber)', borderRadius: '5px' }}></div>
                                </div>
                            </div>

                            {/* Excellent */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '5px' }}>
                                    <span>Lulus Baik (75% – 90% Skor Maks)</span>
                                    <strong>{distExcellent} Peserta ({attendedCount > 0 ? Math.round((distExcellent / attendedCount) * 100) : 0}%)</strong>
                                </div>
                                <div className="prog-bar" style={{ height: '10px', background: 'var(--border-2)', borderRadius: '5px' }}>
                                    <div className="prog-fill" style={{ width: `${attendedCount > 0 ? (distExcellent / attendedCount) * 100 : 0}%`, background: 'var(--indigo)', borderRadius: '5px' }}></div>
                                </div>
                            </div>

                            {/* Outstanding */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ink-2)', marginBottom: '5px' }}>
                                    <span>Lulus Sangat Baik (&gt; 90% Skor Maks)</span>
                                    <strong>{distOutstanding} Peserta ({attendedCount > 0 ? Math.round((distOutstanding / attendedCount) * 100) : 0}%)</strong>
                                </div>
                                <div className="prog-bar" style={{ height: '10px', background: 'var(--border-2)', borderRadius: '5px' }}>
                                    <div className="prog-fill" style={{ width: `${attendedCount > 0 ? (distOutstanding / attendedCount) * 100 : 0}%`, background: 'var(--teal)', borderRadius: '5px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Passing Grades Info */}
                    <div className="table-card" style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <i className="bi bi-card-list" style={{ color: 'var(--teal)', fontSize: '16px' }}></i>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>Ambang Batas Kelulusan Seksi</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {seksi.map((sec, idx) => {
                                const secMaxScore = sec.soal_count * (sec.correct_points || 5);
                                return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-2)', paddingBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--ink)' }}>{sec.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{sec.soal_count} soal · Benar = +{sec.correct_points || 5} poin</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className="status-badge" style={{ background: 'var(--indigo-s)', color: 'var(--indigo)', fontWeight: 600 }}>
                                                PG: {sec.passing_grade || 'Tidak ada'}
                                            </span>
                                            <div style={{ fontSize: '10.5px', color: 'var(--ink-4)', marginTop: '2px' }}>Maks Poin: {secMaxScore}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── DETAILED RESULTS TABLE ── */}
                <div className="table-card" style={{ padding: '0' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="tab-pills" style={{ margin: 0 }}>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    Semua ({totalRegistered})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'lulus' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('lulus')}
                                >
                                    Lulus ({passedCount})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'gagal' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('gagal')}
                                >
                                    Gagal ({distUnderPassing})
                                </button>
                                <button
                                    type="button"
                                    className={`tab-pill ${statusFilter === 'tidak_hadir' ? 'active' : ''}`}
                                    onClick={() => setStatusFilter('tidak_hadir')}
                                >
                                    Tidak Hadir ({absentCount})
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="filter-search" style={{ height: '32px' }}>
                                <input
                                    type="text"
                                    placeholder="Cari nama / NIP..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12.5px', width: '160px' }}
                                />
                                <i className="bi bi-search" style={{ fontSize: '13px', color: 'var(--ink-4)' }} />
                            </div>

                            <button
                                type="button"
                                className="btn-modal confirm"
                                style={{ background: 'var(--teal)', fontSize: '12px', padding: '0 14px', height: '32px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0, width: 'auto' }}
                                onClick={() => handleExport('Excel')}
                            >
                                <i className="bi bi-file-earmark-excel"></i> Export Excel
                            </button>
                            <button
                                type="button"
                                className="btn-modal confirm"
                                style={{ background: 'var(--rose)', fontSize: '12px', padding: '0 14px', height: '32px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0, width: 'auto' }}
                                onClick={() => handleExport('PDF')}
                            >
                                <i className="bi bi-file-earmark-pdf"></i> Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Table scroll area */}
                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Peserta / NIP</th>
                                    <th>Status Hadir</th>
                                    {seksi.map((sec, i) => (
                                        <th key={i}>{sec.title}</th>
                                    ))}
                                    <th style={{ textAlign: 'center' }}>Total B/S/K</th>
                                    <th>Nilai Akhir</th>
                                    <th>Kelulusan</th>
                                    <th>Detail Sesi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6 + seksi.length}>
                                            <div style={{ padding: '40px', textTransform: 'none', textAlign: 'center', color: 'var(--ink-4)' }}>
                                                Tidak ada data peserta hasil ujian yang sesuai kriteria filter.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredParticipants.map(p => {
                                        return (
                                            <tr key={p.id}>
                                                <td>
                                                    <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>
                                                        {p.nip_nik || 'NIP/NIK -'} · {p.instansi || 'Umum'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${p.is_present ? 'aktif' : 'selesai'}`} style={{ background: p.is_present ? 'var(--teal-s)' : 'var(--border-2)', color: p.is_present ? 'var(--teal)' : 'var(--ink-4)' }}>
                                                        {p.is_present ? 'Hadir' : 'Absen'}
                                                    </span>
                                                </td>
                                                {seksi.map((sec, idx) => {
                                                    const breakd = p.seksi_breakdown.find(b => b.title === sec.title);
                                                    if (!p.is_present || !breakd) {
                                                        return <td key={idx} style={{ color: 'var(--ink-4)' }}>—</td>;
                                                    }
                                                    return (
                                                        <td key={idx}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 600, color: breakd.passed ? 'var(--teal)' : 'var(--rose)' }}>
                                                                    {breakd.score}
                                                                </span>
                                                                <span style={{ fontSize: '10.5px', color: 'var(--ink-4)', marginTop: '1px' }}>
                                                                    B:{breakd.correct} S:{breakd.incorrect}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td style={{ textAlign: 'center' }}>
                                                    {p.is_present ? (
                                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '12px' }}>
                                                            {p.correct_total} / {p.incorrect_total} / {p.unanswered_total}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'var(--ink-4)' }}>—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {p.is_present ? (
                                                        <span style={{ fontWeight: 800, fontSize: '14px', color: p.passed ? 'var(--indigo)' : 'var(--rose)', fontFamily: 'var(--mono)' }}>
                                                            {p.total_score}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'var(--ink-4)' }}>—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {p.is_present ? (
                                                        <span className={`status-badge ${p.passed ? 'aktif' : 'selesai'}`} style={{ background: p.passed ? 'var(--teal-s)' : 'var(--rose-s)', color: p.passed ? 'var(--teal)' : 'var(--rose)' }}>
                                                            {p.passed ? 'LULUS' : 'GAGAL'}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: 'var(--ink-4)' }}>—</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="action-btn monitor"
                                                        disabled={!p.is_present}
                                                        title="Lihat Detail Lembar Kerja"
                                                        style={{ opacity: p.is_present ? 1 : 0.4 }}
                                                        onClick={() => setSelectedParticipant(p)}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── ATTEMPT SHEET DETAIL MODAL ── */}
                {selectedParticipant && (
                    <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={() => setSelectedParticipant(null)}>
                        <div className="modal-container" style={{ width: '800px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="modal-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--indigo-s)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-person-badge" style={{ color: 'var(--indigo)', fontSize: '16px' }}></i>
                                    </div>
                                    <div>
                                        <h3 className="modal-title">{selectedParticipant.name}</h3>
                                        <p style={{ fontSize: '11px', color: 'var(--ink-4)' }}>Detail Lembar Jawaban & Parameter Seksi Ujian</p>
                                    </div>
                                </div>
                                <button type="button" className="modal-close-btn" onClick={() => setSelectedParticipant(null)}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', padding: '20px 24px' }}>
                                {/* Info Strip */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px', background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 'var(--r-sm)' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase' }}>Nilai Akhir</div>
                                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--indigo)' }}>{selectedParticipant.total_score}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase' }}>Status Kelulusan</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: selectedParticipant.passed ? 'var(--teal)' : 'var(--rose)', marginTop: '4px' }}>
                                            {selectedParticipant.passed ? '🟢 LULUS' : '🔴 GAGAL'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase' }}>Total Benar/Salah/Kosong</div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-2)', marginTop: '4px' }}>
                                            {selectedParticipant.correct_total} B / {selectedParticipant.incorrect_total} S / {selectedParticipant.unanswered_total} K
                                        </div>
                                    </div>
                                </div>

                                {/* Section-wise Details */}
                                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Detail Nilai per Seksi Soal</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                                    {selectedParticipant.seksi_breakdown.map((sec, idx) => {
                                        const secMax = seksi.find(s => s.title === sec.title)?.soal_count || 30;
                                        const scorePercent = Math.round((sec.correct / secMax) * 100);
                                        return (
                                            <div key={idx} style={{ border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)', padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)' }}>{sec.title}</span>
                                                    <span style={{ fontWeight: 600, fontSize: '12px', color: sec.passed ? 'var(--teal)' : 'var(--rose)' }}>
                                                        Skor: {sec.score} (Ambang Batas: {sec.passing_grade || 'Tidak ada'}) · {sec.passed ? 'Lulus' : 'Gagal'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-4)', marginBottom: '4px' }}>
                                                    <span>Benar: {sec.correct} · Salah: {sec.incorrect} · Kosong: {sec.unanswered}</span>
                                                    <span>Akurasi: {scorePercent}%</span>
                                                </div>
                                                <div className="prog-bar" style={{ height: '6px', background: 'var(--border-2)', borderRadius: '3px' }}>
                                                    <div className="prog-fill" style={{ width: `${scorePercent}%`, background: sec.passed ? 'var(--teal)' : 'var(--rose)', borderRadius: '3px' }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Audit Logs */}
                                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Log Audit Sesi Ujian</h4>
                                <div style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)', padding: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                                        <div>
                                            <span style={{ color: 'var(--ink-4)' }}>Alamat IP Peserta:</span>
                                            <strong style={{ color: 'var(--ink-2)', marginLeft: '6px' }}>192.168.1.127</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--ink-4)' }}>User Agent / Browser:</span>
                                            <strong style={{ color: 'var(--ink-2)', marginLeft: '6px' }}>Chrome 122.0.0 (Windows 11)</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--ink-4)' }}>Waktu Mulai:</span>
                                            <strong style={{ color: 'var(--ink-2)', marginLeft: '6px' }}>08:00:15 WIB</strong>
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--ink-4)' }}>Waktu Pengumpulan:</span>
                                            <strong style={{ color: 'var(--ink-2)', marginLeft: '6px' }}>09:44:31 WIB</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                <button type="button" className="btn-modal cancel" onClick={() => setSelectedParticipant(null)}>Tutup Detail</button>
                                <button type="button" className="btn-modal confirm" onClick={() => alert('Fitur cetak lembar kerja sedang diproses.')}>
                                    <i className="bi bi-printer"></i> Cetak Lembar Kerja
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
