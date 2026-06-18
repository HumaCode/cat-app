import React from 'react';

interface KpiCardsProps {
    stats: {
        total: number;
        aktif: number;
        terjadwal: number;
        draft: number;
        selesai: number;
    };
}

export default function KpiCards({ stats }: KpiCardsProps) {
    return (
        <div className="kpi-grid">
            {/* Active Exams */}
            <div className="kpi-card anim-in d2" style={{ '--clr-a': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Sedang Berjalan</div>
                    <div className="kpi-icon-box">▶️</div>
                </div>
                <div className="kpi-num">{stats.aktif}</div>
                <span className="kpi-trend up">↑ Sesi sedang aktif</span>
                <div className="kpi-footer">Ujian sedang dikerjakan peserta</div>
            </div>

            {/* Scheduled Exams */}
            <div className="kpi-card anim-in d3" style={{ '--clr-a': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Terjadwal</div>
                    <div className="kpi-icon-box">🗓️</div>
                </div>
                <div className="kpi-num">{stats.terjadwal}</div>
                <span className="kpi-trend amber">→ Mulai waktu dekat</span>
                <div className="kpi-footer">Telah diatur tanggal mulainya</div>
            </div>

            {/* Draft Exams */}
            <div className="kpi-card anim-in d4" style={{ '--clr-a': 'var(--amber)', '--clr-s': 'var(--amber-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Draft</div>
                    <div className="kpi-icon-box">✏️</div>
                </div>
                <div className="kpi-num">{stats.draft}</div>
                <span className="kpi-trend amber">⚠ Belum dipublikasikan</span>
                <div className="kpi-footer">Menunggu kelengkapan soal</div>
            </div>

            {/* Completed Exams */}
            <div className="kpi-card anim-in d5" style={{ '--clr-a': 'var(--ink-3)', '--clr-s': 'var(--bg-2)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Selesai</div>
                    <div className="kpi-icon-box">✅</div>
                </div>
                <div className="kpi-num">{stats.selesai}</div>
                <span className="kpi-trend up">↑ Hasil tersimpan aman</span>
                <div className="kpi-footer">Riwayat ujian telah ditutup</div>
            </div>
        </div>
    );
}
