import React from 'react';
import { router } from '@inertiajs/react';
import { ExamItem } from './types';

// Helper for mapping mock stats matching the HTML mock
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

interface ExamTableProps {
    exams: {
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
    };
    onEdit: (exam: ExamItem) => void;
    onDelete: (exam: ExamItem) => void;
    onActionTriggered: (msg: string, type: 'success' | 'error' | '') => void;
    onPageChange: (url: string) => void;
}

export default function ExamTable({
    exams,
    onEdit,
    onDelete,
    onActionTriggered,
    onPageChange,
}: ExamTableProps) {
    const data = exams.data || [];

    return (
        <div className="table-card">
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                            <th>Nama Ujian</th>
                            <th>Tipe</th>
                            <th>Peserta</th>
                            <th>Progres</th>
                            <th>Durasi</th>
                            <th>Status</th>
                            <th>Jadwal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={9}>
                                    <div className="empty-state">
                                        <div className="empty-icon">📭</div>
                                        <div className="empty-title">Tidak ada ujian ditemukan</div>
                                        <div className="empty-sub">Coba ubah filter atau kata kunci pencarian</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((e, index) => {
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
                                    <tr key={e.id}>
                                        <td style={{ textAlign: 'center', color: 'var(--ink-4)', fontWeight: 600, fontSize: '12.5px' }}>
                                            {(exams.from || 1) + index}
                                        </td>
                                        <td>
                                            <div className="exam-name">{e.title}</div>
                                            <div className="exam-meta">
                                                {TYPE_ICON[e.type as keyof typeof TYPE_ICON] || '📋'} {e.type} · {e.duration} mnt
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`type-badge ${e.type.toLowerCase()}`}>
                                                {e.type}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{m.enrolled}</span>
                                            <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>/{m.total}</span>
                                        </td>
                                        <td>
                                            <div className="prog-wrap">
                                                <div className="prog-bar">
                                                    <div className="prog-fill" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="prog-num">{pct}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontFamily: 'var(--mono)', fontSize: '12.5px' }}>
                                                {e.duration} mnt
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${e.status}`}>
                                                {STATUS_LABELS[e.status as keyof typeof STATUS_LABELS] || e.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                                                {dateFormatted}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-row">
                                                <button
                                                    className="action-btn monitor"
                                                    title="Lihat Detail"
                                                    onClick={() => router.visit(route('ujian.show', e.id))}
                                                >
                                                    <i className="bi bi-eye" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                <button
                                                    className="action-btn edit"
                                                    title="Edit"
                                                    onClick={() => onEdit(e)}
                                                >
                                                    <i className="bi bi-pencil" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                <button
                                                    className="action-btn monitor"
                                                    title="Monitor"
                                                    onClick={() => router.visit(route('ujian.monitor', e.id))}
                                                >
                                                    <i className="bi bi-display" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                <button
                                                    className="action-btn report"
                                                    title="Laporan"
                                                    onClick={() => router.visit(route('ujian.report', e.id))}
                                                >
                                                    <i className="bi bi-bar-chart" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                <button
                                                    className="action-btn danger"
                                                    title="Hapus"
                                                    onClick={() => onDelete(e)}
                                                >
                                                    <i className="bi bi-trash" style={{ fontSize: '14px' }}></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {exams.links && exams.links.length > 0 && (
                <div className="pagination-row">
                    <div className="pagination-info">
                        Menampilkan <strong>{exams.from || 0}–{exams.to || 0}</strong> dari <strong>{exams.total}</strong> ujian
                    </div>
                    <div className="pagination-btns">
                        {exams.links.map((link, idx) => {
                            // Convert HTML entity arrows to clean labels
                            let label = link.label;
                            if (label.includes('Previous')) label = '←';
                            if (label.includes('Next')) label = '→';

                            return (
                                <button
                                    key={idx}
                                    className={`page-btn ${link.active ? 'active' : ''}`}
                                    disabled={!link.url}
                                    onClick={() => link.url && onPageChange(link.url)}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
