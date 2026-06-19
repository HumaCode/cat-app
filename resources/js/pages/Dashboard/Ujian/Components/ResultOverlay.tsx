import { useEffect, useState } from 'react';

interface ResultOverlayProps {
    isOpen: boolean;
    sections: Array<{
        questions: Array<{
            id: string;
            type?: string;
            correct_option_id?: string | null;
            correct_option_ids?: string[];
            correct_answers?: string[];
            options: Array<{
                id: string;
                text: string;
                pair_text?: string;
            }>;
        }>;
    }>;
    answersState: Record<string, string | null>;
    examTitle: string;
    passingGrade: number;
    onReturnToDashboard: () => void;
}

export default function ResultOverlay({
    isOpen,
    sections,
    answersState,
    examTitle,
    passingGrade,
    onReturnToDashboard,
}: ResultOverlayProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [particles, setParticles] = useState<Array<{
        id: number;
        left: number;
        delay: number;
        duration: number;
        width: number;
        height: number;
        opacity: number;
        color?: string;
    }>>([]);

    let totalQuestions = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    sections.forEach((sec) => {
        totalQuestions += sec.questions.length;
        sec.questions.forEach((q) => {
            const answer = answersState[q.id];
            if (answer === undefined || answer === null || answer === '') {
                emptyCount++;
            } else {
                const qType = q.type || 'pg';
                if (qType === 'isian') {
                    const userAnswerNormalized = answer.trim().toLowerCase();
                    const correctTexts = q.correct_answers || [];
                    const isCorrect = correctTexts.includes(userAnswerNormalized);
                    if (isCorrect) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                } else if (qType === 'jodoh') {
                    const matches = answer.split(',').reduce((acc, pairStr) => {
                        const [optId, val] = pairStr.split(':');
                        if (optId) acc[optId] = val;
                        return acc;
                    }, {} as Record<string, string>);

                    const isCorrect = q.options.every((opt) => {
                        const userPair = matches[opt.id];
                        return userPair && userPair.trim().toLowerCase() === (opt.pair_text || '').trim().toLowerCase();
                    });

                    if (isCorrect) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                } else if (qType === 'urutan') {
                    const selectedIds = answer.split(',').filter(Boolean);
                    const correctIds = q.correct_option_ids || [];
                    const isCorrect = selectedIds.length === correctIds.length && selectedIds.every((val, index) => val === correctIds[index]);
                    if (isCorrect) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                } else if (qType === 'essay') {
                    if (answer.trim().length > 0) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                } else if (qType === 'pgk' || q.correct_option_ids) {
                    const selectedIds = answer.split(',').filter(Boolean).sort();
                    const correctIds = q.correct_option_ids ? q.correct_option_ids.filter(Boolean).sort() : (q.correct_option_id ? [q.correct_option_id] : []);
                    const isCorrect = selectedIds.length === correctIds.length && selectedIds.every((val, index) => val === correctIds[index]);
                    if (isCorrect) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                } else {
                    if (q.correct_option_id && answer === q.correct_option_id) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                }
            }
        });
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100 * 10) / 10 : 0;
    const isPassed = score >= passingGrade;

    useEffect(() => {
        if (!isOpen) return;

        let startTimestamp: number | null = null;
        const duration = 1000; // 1s animation

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setAnimatedScore(progress * score);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [isOpen, score]);

    useEffect(() => {
        if (!isOpen) return;

        const count = isPassed ? 120 : 160;
        const newParticles = [];
        const colors = ['#4338CA', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F43F5E'];
        
        for (let i = 0; i < count; i++) {
            if (isPassed) {
                const size = Math.random() * 8 + 6;
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    delay: Math.random() * 5,
                    duration: Math.random() * 3 + 2,
                    width: size,
                    height: size,
                    opacity: Math.random() * 0.4 + 0.6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            } else {
                newParticles.push({
                    id: i,
                    left: Math.random() * 100,
                    delay: Math.random() * 2,
                    duration: Math.random() * 0.7 + 0.5,
                    width: Math.random() * 1.5 + 0.8,
                    height: Math.random() * 25 + 15,
                    opacity: Math.random() * 0.5 + 0.25,
                });
            }
        }
        setParticles(newParticles);
    }, [isOpen, isPassed]);

    if (!isOpen) return null;

    const arcOffset = 477 - (477 * animatedScore) / 100;

    return (
        <div className={`result-overlay ${isOpen ? 'show' : ''} ${isPassed ? 'passed-light' : 'failed-gloom'}`}>
            {isPassed ? (
                <div className="confetti-container">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="confetti-particle"
                            style={{
                                left: `${p.left}%`,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                                width: `${p.width}px`,
                                height: `${p.height}px`,
                                opacity: p.opacity,
                                backgroundColor: p.color,
                                borderRadius: p.id % 2 === 0 ? '50%' : '0%',
                            }}
                        />
                    ))}
                </div>
            ) : (
                <>
                    <div className="lightning-flash" />
                    <div className="gloom-container">
                        {particles.map((p) => (
                            <div
                                key={p.id}
                                className="gloom-particle"
                                style={{
                                    left: `${p.left}%`,
                                    animationDelay: `${p.delay}s`,
                                    animationDuration: `${p.duration}s`,
                                    width: `${p.width}px`,
                                    height: `${p.height}px`,
                                    opacity: p.opacity,
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="result-box" style={{ position: 'relative', zIndex: 10 }}>
                <div className="result-ring-wrap">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                        <circle cx="90" cy="90" r="76" fill="none" stroke="#EEEEFA" stroke-width="12" />
                        <circle
                            cx="90"
                            cy="90"
                            r="76"
                            fill="none"
                            stroke="url(#resultGrad)"
                            stroke-width="12"
                            stroke-linecap="round"
                            stroke-dasharray="477"
                            stroke-dashoffset={arcOffset}
                        />
                        <defs>
                            <linearGradient id="resultGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#4338CA" />
                                <stop offset="100%" stop-color="#67E8F9" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="result-ring-center">
                        <div className="result-score">{animatedScore.toFixed(1)}</div>
                        <div className="result-score-lbl">Total Skor</div>
                    </div>
                </div>

                <div className={`result-status ${isPassed ? 'lulus' : 'gagal'}`}>
                    {isPassed ? '🎉 LULUS' : '😔 BELUM LULUS'}
                </div>
                <div className="result-title">
                    {isPassed ? 'Selamat, kamu berhasil!' : 'Terus semangat berlatih!'}
                </div>
                <div className="result-desc">
                    {isPassed
                        ? `Skor kamu (${score.toFixed(1)}) melampaui passing grade (${passingGrade}). Hasil luar biasa!`
                        : `Skor kamu (${score.toFixed(1)}) belum mencapai passing grade (${passingGrade}). Jangan menyerah!`}
                </div>

                <div className="result-grid">
                    <div className="result-cell">
                        <div className="result-cell-num green">{correctCount}</div>
                        <div className="result-cell-lbl">Benar</div>
                    </div>
                    <div className="result-cell">
                        <div className="result-cell-num rose">{wrongCount}</div>
                        <div className="result-cell-lbl">Salah</div>
                    </div>
                    <div className="result-cell">
                        <div className="result-cell-num amber">{emptyCount}</div>
                        <div className="result-cell-lbl">Tidak Dijawab</div>
                    </div>
                </div>

                <div className="result-actions">
                    <button className="btn-result-primary" onClick={onReturnToDashboard}>
                        📊 Selesai & Lihat Pembahasan
                    </button>
                    <button className="btn-result-sec" onClick={onReturnToDashboard}>
                        ← Kembali ke Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
