import { useEffect, useRef, useState } from 'react';

interface CategoryScore {
    label: string;
    value: number;
    max: number;
    gradient: string;
}

interface ScoreWidgetProps {
    scores: CategoryScore[];
}

export default function ScoreWidget({ scores }: ScoreWidgetProps) {
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
        <div ref={elementRef} className={`widget-card anim ${visible ? 'in' : ''}`}>
            <div className="widget-title">📊 Nilai per Kategori</div>
            <div className="score-history">
                {scores.map((score, idx) => {
                    const widthPct = (score.value / score.max) * 100;
                    return (
                        <div key={idx} className="score-hist-item">
                            <div className="score-hist-bar-wrap">
                                <div className="score-hist-label">
                                    {score.label} <span>{score.value} / {score.max}</span>
                                </div>
                                <div className="score-hist-track">
                                    <div 
                                        className="score-hist-fill" 
                                        style={{ 
                                            width: visible ? `${widthPct}%` : '0%', 
                                            background: score.gradient,
                                            transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
