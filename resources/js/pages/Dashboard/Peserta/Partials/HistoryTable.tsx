import { useEffect, useRef, useState } from 'react';

interface HistoryItem {
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
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, idx) => (
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
