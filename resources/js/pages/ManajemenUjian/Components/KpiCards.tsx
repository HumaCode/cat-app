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
    const total = stats.total || 0;

    // Derived context labels
    const aktifFooter  = stats.aktif === 0
        ? 'Tidak ada ujian yang sedang berjalan'
        : stats.aktif === 1
            ? '1 ujian sedang dikerjakan peserta'
            : `${stats.aktif} ujian sedang dikerjakan peserta`;

    const terjadwalFooter = stats.terjadwal === 0
        ? 'Tidak ada ujian yang dijadwalkan'
        : stats.terjadwal === 1
            ? '1 ujian menunggu waktu mulai'
            : `${stats.terjadwal} ujian menunggu waktu mulai`;

    const draftFooter = stats.draft === 0
        ? 'Semua ujian telah dipublikasikan'
        : stats.draft === 1
            ? '1 ujian menunggu kelengkapan soal'
            : `${stats.draft} ujian menunggu kelengkapan soal`;

    const selesaiFooter = stats.selesai === 0
        ? 'Belum ada ujian yang selesai'
        : stats.selesai === 1
            ? '1 ujian telah ditutup'
            : `${stats.selesai} ujian telah ditutup`;

    // Percentage of each type from total
    const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

    return (
        <div className="kpi-grid">
            {/* Active Exams */}
            <div className="kpi-card anim-in d2" style={{ '--clr-a': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Sedang Berjalan</div>
                    <div className="kpi-icon-box">▶️</div>
                </div>
                <div className="kpi-num">{stats.aktif}</div>
                {stats.aktif > 0 ? (
                    <span className="kpi-trend up">↑ {pct(stats.aktif)}% dari total ujian</span>
                ) : (
                    <span className="kpi-trend neutral">— Tidak ada sesi aktif</span>
                )}
                <div className="kpi-footer">{aktifFooter}</div>
            </div>

            {/* Scheduled Exams */}
            <div className="kpi-card anim-in d3" style={{ '--clr-a': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Terjadwal</div>
                    <div className="kpi-icon-box">🗓️</div>
                </div>
                <div className="kpi-num">{stats.terjadwal}</div>
                {stats.terjadwal > 0 ? (
                    <span className="kpi-trend amber">→ {pct(stats.terjadwal)}% dari total ujian</span>
                ) : (
                    <span className="kpi-trend neutral">— Belum ada jadwal</span>
                )}
                <div className="kpi-footer">{terjadwalFooter}</div>
            </div>

            {/* Draft Exams */}
            <div className="kpi-card anim-in d4" style={{ '--clr-a': 'var(--amber)', '--clr-s': 'var(--amber-s)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Draft</div>
                    <div className="kpi-icon-box">✏️</div>
                </div>
                <div className="kpi-num">{stats.draft}</div>
                {stats.draft > 0 ? (
                    <span className="kpi-trend amber">⚠ {pct(stats.draft)}% belum dipublikasikan</span>
                ) : (
                    <span className="kpi-trend up">✓ Semua ujian siap</span>
                )}
                <div className="kpi-footer">{draftFooter}</div>
            </div>

            {/* Completed Exams */}
            <div className="kpi-card anim-in d5" style={{ '--clr-a': 'var(--ink-3)', '--clr-s': 'var(--bg-2)' } as React.CSSProperties}>
                <div className="kpi-top">
                    <div className="kpi-label">Selesai</div>
                    <div className="kpi-icon-box">✅</div>
                </div>
                <div className="kpi-num">{stats.selesai}</div>
                {stats.selesai > 0 ? (
                    <span className="kpi-trend up">↑ {pct(stats.selesai)}% dari total ujian</span>
                ) : (
                    <span className="kpi-trend neutral">— Belum ada yang selesai</span>
                )}
                <div className="kpi-footer">{selesaiFooter}</div>
            </div>
        </div>
    );
}
