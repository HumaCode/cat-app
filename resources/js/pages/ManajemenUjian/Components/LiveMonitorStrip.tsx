import { useState, useEffect } from 'react';

interface LiveStats {
    active_exams: number;
    active_participants: number;
    total_participants: number;
    active_exam_title: string | null;
    progress_percent: number;
}

interface LiveMonitorStripProps {
    live: LiveStats;
    onOpenMonitor: () => void;
}

export default function LiveMonitorStrip({ live, onOpenMonitor }: LiveMonitorStripProps) {
    // Animate participants with a gentle tick if there are active exams
    const [displayedParticipants, setDisplayedParticipants] = useState(live.active_participants);

    useEffect(() => {
        setDisplayedParticipants(live.active_participants);
    }, [live.active_participants]);

    const hasActive    = live.active_exams > 0;
    const progressPct  = live.progress_percent;

    // Label for the progress bar
    const progressLabel = live.active_exam_title
        ? `${live.active_exam_title} — sesi berjalan`
        : 'Tidak ada ujian aktif saat ini';

    return (
        <div className="live-strip anim-in d3">
            {/* Live indicator */}
            <div className="live-dot-wrap">
                <div className="live-dot" style={!hasActive ? { background: 'var(--ink-5)', boxShadow: 'none', animation: 'none' } : {}} />
                <span className="live-label" style={!hasActive ? { color: 'var(--ink-4)' } : {}}>
                    {hasActive ? 'Live' : 'Idle'}
                </span>
            </div>

            {/* Stats */}
            <div className="live-stats">
                {/* Participants in active exams */}
                <div className="live-stat">
                    <div className="live-stat-num">{displayedParticipants}</div>
                    <div className="live-stat-lbl">Peserta terdaftar aktif</div>
                </div>
                <div className="live-divider" />

                {/* Active exam count */}
                <div className="live-stat">
                    <div className="live-stat-num">{live.active_exams}</div>
                    <div className="live-stat-lbl">Ujian berjalan</div>
                </div>
                <div className="live-divider" />

                {/* Total participants across all exams */}
                <div className="live-stat">
                    <div className="live-stat-num">{live.total_participants}</div>
                    <div className="live-stat-lbl">Total peserta terdaftar</div>
                </div>
                <div className="live-divider" />

                {/* Progress bar */}
                <div className="live-bar-wrap">
                    <div className="live-bar-label">
                        <span style={{ maxWidth: '260px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {progressLabel}
                        </span>
                        <span>{hasActive ? `${progressPct}%` : '—'}</span>
                    </div>
                    <div className="live-progress">
                        <div
                            className="live-fill"
                            style={{
                                width: hasActive ? `${progressPct}%` : '0%',
                                background: hasActive
                                    ? 'linear-gradient(90deg, var(--indigo), var(--teal))'
                                    : 'var(--border)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Monitor button */}
            <div className="live-action">
                <button
                    className="btn-secondary"
                    onClick={onOpenMonitor}
                    disabled={!hasActive}
                    style={!hasActive ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    🖥 Monitor
                </button>
            </div>
        </div>
    );
}
