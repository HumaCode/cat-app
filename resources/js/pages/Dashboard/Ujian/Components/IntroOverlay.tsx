import { useEffect, useState } from 'react';

interface IntroOverlayProps {
    examTitle: string;
    totalQuestions: number;
    duration: number;
    passingGrade: number;
    sectionsCount: number;
    onStart: () => void;
}

export default function IntroOverlay({
    examTitle,
    totalQuestions,
    duration,
    passingGrade,
    sectionsCount,
    onStart,
}: IntroOverlayProps) {
    const [countdown, setCountdown] = useState(5);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (hasStarted) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setHasStarted(true);
                    onStart();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, onStart]);

    const handleStartNow = () => {
        if (!hasStarted) {
            setHasStarted(true);
            onStart();
        }
    };

    return (
        <div className={`intro-overlay ${hasStarted ? 'hidden' : ''}`}>
            <div className="intro-box">
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

                {countdown > 0 ? (
                    <div className="intro-countdown">
                        Ujian dimulai dalam <span>{countdown}</span> detik
                    </div>
                ) : null}

                <button className="btn-start-exam" onClick={handleStartNow}>
                    ▶ Mulai Ujian Sekarang
                </button>
            </div>
        </div>
    );
}
