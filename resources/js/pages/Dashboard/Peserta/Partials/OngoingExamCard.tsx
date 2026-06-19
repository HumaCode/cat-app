import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface OngoingExam {
    id: string;
    title: string;
    type: string;
    duration: number;
    passing_grade: number;
    total_soal: number;
    answered: number;
    progress_pct: number;
    sisa_waktu_s: number;
    current_seksi: string;
    current_soal: number;
    tags: string[];
    color: string;
    badge_bg: string;
    badge_color: string;
}

interface OngoingExamCardProps {
    exam: OngoingExam | null;
}

export default function OngoingExamCard({ exam }: OngoingExamCardProps) {
    if (!exam) return null;

    const [timeLeft, setTimeLeft] = useState(exam.sisa_waktu_s);
    const [visible, setVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    // Format seconds to HH:MM:SS
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div ref={elementRef} className={`exam-stack anim ${visible ? 'in' : ''}`}>
            <div 
                className="exam-card" 
                style={{ 
                    borderLeftColor: exam.color, 
                    borderColor: 'rgba(190,18,60,0.15)', 
                    background: 'linear-gradient(135deg, #fff 0%, rgba(190,18,60,0.02) 100%)' 
                }}
            >
                <div className="exam-card-top">
                    <div>
                        <div className="exam-card-meta" style={{ marginBottom: '8px' }}>
                            <span 
                                className="exam-type-badge" 
                                style={{ backgroundColor: exam.badge_bg, color: exam.badge_color }}
                            >
                                {exam.type}
                            </span>
                            <span className="exam-difficulty">⚡ Sedang · {exam.total_soal} soal</span>
                        </div>
                        <div className="exam-title">{exam.title}</div>
                        <div className="exam-desc">Seleksi Kompetensi Dasar meliputi TWK, TIU, dan TKP. Pastikan kamu dalam kondisi prima!</div>
                    </div>
                    <div className="timer-chip">
                        <span className="timer-dot"></span>
                        <span id="liveTimer">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="exam-progress">
                    <div className="prog-label">
                        <span>Progress pengerjaan</span>
                        <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink-2)' }}>
                            {exam.answered} / {exam.total_soal}
                        </span>
                    </div>
                    <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${exam.progress_pct}%`, backgroundColor: exam.color }}></div>
                    </div>
                </div>

                <div className="exam-info-row">
                    <div className="exam-info-item"><span className="exam-info-icon">⏱</span> {exam.duration} menit</div>
                    <div className="exam-info-item"><span className="exam-info-icon">🎯</span> Passing: {exam.passing_grade}</div>
                    <div className="exam-info-item"><span className="exam-info-icon">📍</span> Soal ke-{exam.current_soal} ({exam.current_seksi})</div>
                </div>

                <div className="exam-card-footer">
                    <div className="exam-footer-left">
                        {(exam?.tags || []).map((tag, i) => (
                            <span key={i} className="exam-tag">{tag}</span>
                        ))}
                    </div>
                    <button 
                        className="btn-continue"
                        onClick={() => router.visit(route('peserta.ujian.show', { examId: exam.id }))}
                    >
                        ▶ Lanjutkan Ujian
                    </button>
                </div>
            </div>
        </div>
    );
}
