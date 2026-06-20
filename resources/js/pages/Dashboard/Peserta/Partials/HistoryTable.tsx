import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';

interface HistoryItem {
    exam_id: string | null;
    title: string;
    date: string;
    score: number | null;
    score_class: string;
    rank: string;
    rank_class: string;
    duration: string;
    status: string;
    status_class: string;
}

interface HistoryTableProps {
    history: HistoryItem[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
    const [visible, setVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={elementRef} className={`history-card anim ${visible ? 'in' : ''}`}>
            <div className="history-head sec-head">
                <div className="sec-title">
                    <span className="sec-title-dot" style={{ background: 'var(--violet)' }}></span>
                    Riwayat Ujian
                </div>
                <a className="sec-link">Lihat semua →</a>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Nama Ujian</th>
                            <th>Tanggal</th>
                            <th>Skor</th>
                            <th>Ranking</th>
                            <th>Durasi</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history && history.length > 0 ? (
                            history.map((item, idx) => (
                                <tr key={idx}>
                                    <td><strong style={{ color: 'var(--ink)' }}>{item.title}</strong></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                                        {item.date}
                                    </td>
                                    <td>
                                        <span className={`score-pill ${item.score_class}`}>
                                            {item.score !== null ? item.score.toFixed(1) : '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`rank-num ${item.rank_class}`}>
                                            {item.rank}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>
                                        {item.duration}
                                    </td>
                                    <td>
                                        <span className={`result-badge ${item.status_class}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {item.exam_id ? (
                                            <Link
                                                href={route('peserta.ujian.pembahasan', { examId: item.exam_id })}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    background: 'var(--indigo-s)',
                                                    color: 'var(--indigo)',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid rgba(67, 56, 202, 0.15)',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--indigo)';
                                                    e.currentTarget.style.color = '#ffffff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'var(--indigo-s)';
                                                    e.currentTarget.style.color = 'var(--indigo)';
                                                }}
                                            >
                                                📖 Pembahasan
                                            </Link>
                                        ) : (
                                            <span style={{ color: 'var(--ink-4)', fontSize: '11px' }}>—</span>
                                        )}
                                    </td>
                                </tr>
                             ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-4)', fontSize: '13px' }}>
                                    Belum ada riwayat ujian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
