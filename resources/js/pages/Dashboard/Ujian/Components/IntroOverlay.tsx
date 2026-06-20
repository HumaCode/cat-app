import { useState } from 'react';

interface IntroOverlayProps {
    examTitle: string;
    totalQuestions: number;
    duration: number;
    passingGrade: number;
    sectionsCount: number;
    onStart: () => void;
}

const FLOATING_ITEMS = [
    { emoji: '✏️', top: '12%', left: '10%', size: '36px', opacity: 0.15, duration: '8s', delay: '0s' },
    { emoji: '📖', top: '22%', left: '85%', size: '42px', opacity: 0.12, duration: '10s', delay: '1s' },
    { emoji: '📐', top: '68%', left: '12%', size: '38px', opacity: 0.14, duration: '9s', delay: '0.5s' },
    { emoji: '🎓', top: '78%', left: '80%', size: '48px', opacity: 0.18, duration: '11s', delay: '2s' },
    { emoji: '📝', top: '42%', left: '8%', size: '34px', opacity: 0.13, duration: '7s', delay: '1.5s' },
    { emoji: '💡', top: '58%', left: '88%', size: '40px', opacity: 0.16, duration: '8.5s', delay: '0.2s' },
    { emoji: '⏱️', top: '8%', left: '75%', size: '36px', opacity: 0.15, duration: '9.5s', delay: '1.8s' },
    { emoji: '🎒', top: '82%', left: '22%', size: '44px', opacity: 0.12, duration: '12s', delay: '3s' },
    { emoji: '🧠', top: '4%', left: '28%', size: '38px', opacity: 0.14, duration: '10.5s', delay: '0.7s' },
    { emoji: '✍️', top: '48%', left: '92%', size: '32px', opacity: 0.15, duration: '7.8s', delay: '1.2s' },
    { emoji: '🏫', top: '88%', left: '52%', size: '40px', opacity: 0.10, duration: '13s', delay: '2.5s' },
    { emoji: '🎨', top: '32%', left: '20%', size: '36px', opacity: 0.12, duration: '8.8s', delay: '1.1s' }
];

export default function IntroOverlay({
    examTitle,
    totalQuestions,
    duration,
    passingGrade,
    sectionsCount,
    onStart,
}: IntroOverlayProps) {
    const [hasStarted, setHasStarted] = useState(false);

    const handleStartNow = () => {
        if (!hasStarted) {
            setHasStarted(true);
            onStart();
        }
    };

    return (
        <div className={`intro-overlay ${hasStarted ? 'hidden' : ''}`} style={{ overflow: 'hidden' }}>
            <style>{`
                @keyframes float-decor {
                    0% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-24px) rotate(8deg);
                    }
                    100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                }
                .floating-decor {
                    position: absolute;
                    pointer-events: none;
                    user-select: none;
                    animation: float-decor var(--duration) ease-in-out infinite;
                    animation-delay: var(--delay);
                    opacity: var(--opacity);
                    font-size: var(--size);
                    top: var(--top);
                    left: var(--left);
                    z-index: 1;
                    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
                }
            `}</style>

            {FLOATING_ITEMS.map((item, idx) => (
                <div
                    key={idx}
                    className="floating-decor"
                    style={{
                        '--top': item.top,
                        '--left': item.left,
                        '--size': item.size,
                        '--opacity': item.opacity,
                        '--duration': item.duration,
                        '--delay': item.delay,
                    } as React.CSSProperties}
                >
                    {item.emoji}
                </div>
            ))}

            <div className="intro-box" style={{ position: 'relative', zIndex: 10 }}>
                <div className="intro-icon">📋</div>
                <div className="intro-title">
                    Bersiaplah,<br /><em>kamu akan memulai</em>
                </div>
                <div className="intro-exam-name">{examTitle}</div>

                <div className="intro-meta">
                    <div className="intro-meta-item">
                        <div className="intro-meta-val">{totalQuestions}</div>
                        <div className="intro-meta-lbl">Soal</div>
                    </div>
                    <div className="intro-meta-item">
                        <div className="intro-meta-val">{duration}</div>
                        <div className="intro-meta-lbl">Menit</div>
                    </div>
                    <div className="intro-meta-item">
                        <div className="intro-meta-val">{passingGrade}</div>
                        <div className="intro-meta-lbl">Passing</div>
                    </div>
                    <div className="intro-meta-item">
                        <div className="intro-meta-val">{sectionsCount}</div>
                        <div className="intro-meta-lbl">Seksi</div>
                    </div>
                </div>

                <div className="intro-rules">
                    <div className="intro-rule">
                        <span className="intro-rule-icon">⏱</span> Waktu berjalan otomatis saat ujian dimulai. Tidak dapat dijeda.
                    </div>
                    <div className="intro-rule">
                        <span className="intro-rule-icon">🚫</span> Dilarang berpindah tab atau membuka aplikasi lain selama ujian.
                    </div>
                    <div className="intro-rule">
                        <span className="intro-rule-icon">🔒</span> Jawaban tersimpan otomatis setiap kamu pindah soal.
                    </div>
                    <div className="intro-rule">
                        <span className="intro-rule-icon">🚩</span> Kamu bisa menandai soal untuk ditinjau kembali.
                    </div>
                    <div className="intro-rule">
                        <span className="intro-rule-icon">📷</span> Aktivitas dan navigasi browser kamu dipantau selama ujian.
                    </div>
                </div>

                <button className="btn-start-exam" onClick={handleStartNow} style={{ marginTop: '24px' }}>
                    ▶ Mulai Ujian Sekarang
                </button>
            </div>
        </div>
    );
}
