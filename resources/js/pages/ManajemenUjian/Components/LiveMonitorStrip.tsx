import { useState, useEffect } from 'react';

interface LiveMonitorStripProps {
    onOpenMonitor: () => void;
}

export default function LiveMonitorStrip({ onOpenMonitor }: LiveMonitorStripProps) {
    const [liveCount, setLiveCount] = useState(346);
    const [liveDone, setLiveDone] = useState(284);
    const [livePercent, setLivePercent] = useState(87);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(prev => prev + Math.floor(Math.random() * 9 - 4));
            setLiveDone(prev => prev + Math.floor(Math.random() * 2));
            setLivePercent(prev => {
                const next = prev + Math.floor(Math.random() * 5 - 2);
                return Math.max(80, Math.min(98, next));
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="live-strip anim-in d3">
            <div className="live-dot-wrap">
                <div className="live-dot"></div>
                <span className="live-label">Live</span>
            </div>
            <div className="live-stats">
                <div className="live-stat">
                    <div className="live-stat-num">{liveCount}</div>
                    <div className="live-stat-lbl">Peserta aktif</div>
                </div>
                <div className="live-divider"></div>
                <div className="live-stat">
                    <div className="live-stat-num">3</div>
                    <div className="live-stat-lbl">Ujian berjalan</div>
                </div>
                <div className="live-divider"></div>
                <div className="live-stat">
                    <div className="live-stat-num">{liveDone}</div>
                    <div className="live-stat-lbl">Selesai hari ini</div>
                </div>
                <div className="live-divider"></div>
                <div className="live-bar-wrap">
                    <div className="live-bar-label">
                        <span>SKD CPNS Paket A — sesi berjalan</span>
                        <span>{livePercent}%</span>
                    </div>
                    <div className="live-progress">
                        <div className="live-fill" style={{ width: `${livePercent}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="live-action">
                <button className="btn-secondary" onClick={onOpenMonitor}>🖥 Monitor</button>
            </div>
        </div>
    );
}
