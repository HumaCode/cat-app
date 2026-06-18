import { useEffect, useRef, useState } from 'react';

interface Achievement {
    emoji: string;
    label: string;
    locked: boolean;
}

interface AchievementWidgetProps {
    achievements: Achievement[];
}

export default function AchievementWidget({ achievements }: AchievementWidgetProps) {
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
            <div className="widget-title">🎖️ Pencapaian</div>
            <div className="badge-grid">
                {achievements.map((badge, idx) => (
                    <div 
                        key={idx} 
                        className={`badge-item ${badge.locked ? 'locked' : ''}`}
                        title={badge.locked ? 'Terkunci' : badge.label}
                    >
                        <div className="badge-emoji">{badge.emoji}</div>
                        <div className="badge-name">{badge.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
