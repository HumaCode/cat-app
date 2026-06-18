import { useEffect, useRef, useState } from 'react';

interface StatsStripProps {
    stats: {
        total_selesai: number;
        total_lulus: number;
        skor_tertinggi: number;
        ranking: string;
    };
}

export default function StatsStrip({ stats }: StatsStripProps) {
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
        <div style={{ padding: '0 28px', maxWidth: '1256px', margin: '0 auto' }}>
            <div 
                ref={elementRef}
                className={`stats-strip anim ${visible ? 'in' : ''}`}
            >
                <div className="stat-cell">
                    <div className="stat-cell-icon" style={{ background: 'rgba(67,56,202,0.1)' }}>📋</div>
                    <div>
                        <div className="stat-cell-num">{stats.total_selesai}</div>
                        <div className="stat-cell-lbl">Ujian Selesai</div>
                    </div>
                </div>
                <div className="stat-cell">
                    <div className="stat-cell-icon" style={{ background: 'rgba(4,120,87,0.1)' }}>✅</div>
                    <div>
                        <div className="stat-cell-num">{stats.total_lulus}</div>
                        <div className="stat-cell-lbl">Lulus</div>
                    </div>
                </div>
                <div className="stat-cell">
                    <div className="stat-cell-icon" style={{ background: 'rgba(180,83,9,0.1)' }}>⭐</div>
                    <div>
                        <div className="stat-cell-num">{stats.skor_tertinggi.toFixed(1)}</div>
                        <div className="stat-cell-lbl">Skor Tertinggi</div>
                    </div>
                </div>
                <div className="stat-cell">
                    <div className="stat-cell-icon" style={{ background: 'rgba(124,58,237,0.1)' }}>🏆</div>
                    <div>
                        <div className="stat-cell-num">{stats.ranking}</div>
                        <div className="stat-cell-lbl">Ranking Saat Ini</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
