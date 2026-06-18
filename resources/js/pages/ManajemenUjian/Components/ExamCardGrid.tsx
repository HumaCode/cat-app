import React from 'react';
import { router } from '@inertiajs/react';
import { ExamItem } from './types';

const getMockStats = (title: string) => {
    if (title.includes('Paket A')) return { enrolled: 346, total: 400, done: 301, date: 'Hari ini, 08.00–10.00', score: 74.2 };
    if (title.includes('TIU Verbal')) return { enrolled: 128, total: 200, done: 128, date: 'Hari ini, 09.00–10.00', score: 71.5 };
    if (title.includes('TKD PPPK Guru')) return { enrolled: 210, total: 250, done: 185, date: 'Hari ini, 10.00–12.00', score: 68.8 };
    if (title.includes('Paket B')) return { enrolled: 0, total: 380, done: 0, date: 'Besok, 08.00–10.00', score: null };
    if (title.includes('Sesi Sore')) return { enrolled: 0, total: 150, done: 0, date: 'Besok, 14.00–14.45', score: null };
    if (title.includes('Kepemimpinan Tk. III')) return { enrolled: 40, total: 40, done: 0, date: '18 Jun 2025, 08.00', score: null };
    if (title.includes('IT')) return { enrolled: 0, total: 100, done: 0, date: '20 Jun 2025, 09.00', score: null };
    if (title.includes('Keuangan')) return { enrolled: 0, total: 60, done: 0, date: '22 Jun 2025, 08.00', score: null };
    if (title.includes('Percobaan 1')) return { enrolled: 5, total: 999, done: 2, date: 'Belum dijadwalkan', score: null };
    return { enrolled: 0, total: 100, done: 0, date: 'Belum dijadwalkan', score: null };
};

const STATUS_LABELS = { aktif: 'Aktif', terjadwal: 'Terjadwal', selesai: 'Selesai', draft: 'Draft' };
const TYPE_ICON = { Simulasi: '🎯', Latihan: '📚', Resmi: '🏛️' };
const CLR_MAP = { aktif: 'var(--teal)', terjadwal: 'var(--indigo)', draft: 'var(--amber)', selesai: 'var(--ink-3)' };

interface ExamCardGridProps {
    exams: ExamItem[];
    onEdit: (exam: ExamItem) => void;
    onDelete: (exam: ExamItem) => void;
    onActionTriggered: (msg: string, type: 'success' | 'error' | '') => void;
}

export default function ExamCardGrid({
    exams,
    onEdit,
    onDelete,
    onActionTriggered,
}: ExamCardGridProps) {
    return (
        <div className="exam-card-grid">
            {exams.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Tidak ada ujian ditemukan</div>
                    <div className="empty-sub">Coba ubah filter atau kata kunci pencarian</div>
                </div>
            ) : (
                exams.map((e) => {
                    const m = getMockStats(e.title);
                    const pct = m.total ? Math.round((m.done / m.total) * 100) : 0;
                    const dateFormatted = e.start_time
                        ? new Date(e.start_time).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : m.date;

                    return (
                        <div
                            key={e.id}
                            className="exam-card"
                            style={{ '--card-clr': CLR_MAP[e.status as keyof typeof CLR_MAP] || 'var(--indigo)' } as React.CSSProperties}
                        >
                            <div className="ec-head">
                                <div
                                    className="ec-icon"
                                    style={{
                                        background: `var(--${e.status === 'aktif' ? 'teal' : 'indigo'}-s)`,
                                    }}
                                >
                                    {TYPE_ICON[e.type as keyof typeof TYPE_ICON] || '📋'}
                                </div>
                                <div className="ec-badges">
                                    <span className={`status-badge ${e.status}`}>
                                        {STATUS_LABELS[e.status as keyof typeof STATUS_LABELS] || e.status}
                                    </span>
                                    <span className={`type-badge ${e.type.toLowerCase()}`}>
                                        {e.type}
                                    </span>
                                </div>
                            </div>
                            <div className="ec-title">{e.title}</div>
                            <div className="ec-sub">{e.duration} menit · Passing grade {e.passing_grade}%</div>

                            <div className="ec-stats">
                                <div className="ec-stat">
                                    <div className="ec-stat-num">{m.enrolled}</div>
                                    <div className="ec-stat-lbl">Peserta</div>
                                </div>
                                <div className="ec-stat">
                                    <div className="ec-stat-num">{m.done}</div>
                                    <div className="ec-stat-lbl">Selesai</div>
                                </div>
                                <div className="ec-stat">
                                    <div className="ec-stat-num">{m.score ? m.score : '—'}</div>
                                    <div className="ec-stat-lbl">Rata Skor</div>
                                </div>
                            </div>

                            <div className="ec-progress">
                                <div className="ec-prog-label">
                                    <span>Progres pengerjaan</span>
                                    <span>{pct}%</span>
                                </div>
                                <div className="ec-prog-bar">
                                    <div className="ec-prog-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>

                            <div className="ec-footer">
                                <div className="ec-time">{dateFormatted}</div>
                                <div className="ec-actions">
                                    <button
                                        className="action-btn monitor"
                                        title="Lihat Detail"
                                        onClick={() => router.visit(route('ujian.show', e.id))}
                                    >
                                        <i className="bi bi-eye" style={{ fontSize: '13px' }}></i>
                                    </button>
                                    <button
                                        className="action-btn edit"
                                        title="Edit"
                                        onClick={() => onEdit(e)}
                                    >
                                        <i className="bi bi-pencil" style={{ fontSize: '13px' }}></i>
                                    </button>
                                    <button
                                        className="action-btn monitor"
                                        title="Monitor"
                                        onClick={() => router.visit(route('ujian.monitor', e.id))}
                                    >
                                        <i className="bi bi-display" style={{ fontSize: '13px' }}></i>
                                    </button>
                                    <button
                                        className="action-btn report"
                                        title="Laporan"
                                        onClick={() => onActionTriggered('Laporan nilai...', 'success')}
                                    >
                                        <i className="bi bi-bar-chart" style={{ fontSize: '13px' }}></i>
                                    </button>
                                    <button
                                        className="action-btn danger"
                                        title="Hapus"
                                        onClick={() => onDelete(e)}
                                    >
                                        <i className="bi bi-trash" style={{ fontSize: '13px' }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
