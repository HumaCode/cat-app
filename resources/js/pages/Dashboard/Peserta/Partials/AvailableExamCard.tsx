import { useEffect, useRef, useState } from 'react';

interface AvailableExam {
    id: string;
    title: string;
    type: string;
    difficulty: string;
    total_soal: number;
    duration: number;
    passing_grade: number;
    has_pembahasan: boolean;
    max_attempts: number | null;
    tags: string[];
    color: string;
    badge_bg: string;
    badge_color: string;
}

interface AvailableExamCardProps {
    exams: AvailableExam[];
}

export default function AvailableExamCard({ exams }: AvailableExamCardProps) {
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
        <div ref={elementRef} className={`exam-stack anim ${visible ? 'in' : ''}`}>
            {exams.map((exam) => (
                <div 
                    key={exam.id} 
                    className="exam-card" 
                    style={{ borderLeftColor: exam.color }}
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
                                <span className="exam-difficulty">{exam.difficulty} · {exam.total_soal} soal</span>
                            </div>
                            <div className="exam-title">{exam.title}</div>
                            <div className="exam-desc">Latihan soal kompetensi khusus. Tersedia pembahasan lengkap setelah selesai untuk evaluasi belajar.</div>
                        </div>
                    </div>
                    <div className="exam-info-row">
                        <div className="exam-info-item"><span className="exam-info-icon">⏱</span> {exam.duration} menit</div>
                        <div className="exam-info-item"><span className="exam-info-icon">🎯</span> Passing: {exam.passing_grade}</div>
                        {exam.has_pembahasan && (
                            <div className="exam-info-item"><span className="exam-info-icon">📖</span> Ada pembahasan</div>
                        )}
                        <div className="exam-info-item">
                            <span className="exam-info-icon">🔄</span> {exam.max_attempts ? `Maks ${exam.max_attempts}× coba` : 'Tidak terbatas'}
                        </div>
                    </div>
                    <div className="exam-card-footer">
                        <div className="exam-footer-left">
                            {exam.tags.map((tag, i) => (
                                <span key={i} className="exam-tag">{tag}</span>
                            ))}
                        </div>
                        <button 
                            className="btn-start" 
                            style={{ 
                                backgroundColor: exam.color, 
                                boxShadow: `0 4px 14px ${exam.badge_color}4d` 
                            }}
                        >
                            Mulai Ujian →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
