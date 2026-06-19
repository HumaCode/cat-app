import { useEffect, useState } from 'react';

interface ExamTopBarProps {
    examTitle: string;
    institutionName: string;
    userName: string;
    timeLeftSeconds: number;
    isCurrentFlagged: boolean;
    onToggleFlag: () => void;
    onSubmitClick: () => void;
}

export default function ExamTopBar({
    examTitle,
    institutionName,
    userName,
    timeLeftSeconds,
    isCurrentFlagged,
    onToggleFlag,
    onSubmitClick,
}: ExamTopBarProps) {
    const formatTime = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        return {
            h: String(h).padStart(2, '0'),
            m: String(m).padStart(2, '0'),
            s: String(s).padStart(2, '0'),
        };
    };

    const { h, m, s } = formatTime(timeLeftSeconds);

    let timerClass = 'timer-display';
    if (timeLeftSeconds <= 300) {
        timerClass += ' danger';
    } else if (timeLeftSeconds <= 600) {
        timerClass += ' warning';
    }

    return (
        <header className="exam-topbar">
            <div className="topbar-brand">
                <div className="brand-dot">C</div>
                <span className="brand-name">CAT System</span>
            </div>

            <div className="topbar-divider"></div>

            <div className="exam-info">
                <div className="exam-info-name">{examTitle}</div>
                <div className="exam-info-meta">
                    {institutionName} · {userName}
                </div>
            </div>

            <div className="timer-block">
                <div className="timer-label">Sisa Waktu</div>
                <div className={timerClass}>
                    <span className="timer-digit">{h}</span>
                    <span className="timer-sep">:</span>
                    <span className="timer-digit">{m}</span>
                    <span className="timer-sep">:</span>
                    <span className="timer-digit">{s}</span>
                </div>
            </div>

            <div className="topbar-divider"></div>

            <div className="topbar-right">
                <div className="topbar-pill">
                    <span className="live-dot"></span>
                    Sedang Berlangsung
                </div>
                <button
                    className={`btn-flag ${isCurrentFlagged ? 'active' : ''}`}
                    onClick={onToggleFlag}
                >
                    🚩 {isCurrentFlagged ? 'Ditandai' : 'Tandai'}
                </button>
                <button className="btn-submit-exam" onClick={onSubmitClick}>
                    Kumpulkan ✓
                </button>
            </div>
        </header>
    );
}
