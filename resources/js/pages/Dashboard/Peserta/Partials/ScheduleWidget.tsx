import { useEffect, useRef, useState } from 'react';

interface ScheduleItem {
    day: string;
    month: string;
    title: string;
    time: string;
    badge: string;
    badge_type: 'soon' | 'upcoming' | string;
}

interface ScheduleWidgetProps {
    schedule: ScheduleItem[];
}

export default function ScheduleWidget({ schedule }: ScheduleWidgetProps) {
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
            <div className="widget-title">📅 Jadwal Mendatang</div>
            <div className="schedule-list">
                {schedule.map((item, idx) => (
                    <div key={idx} className="schedule-item">
                        <div 
                            className="schedule-date-box" 
                            style={item.badge_type === 'soon' ? { background: 'rgba(180,83,9,0.08)' } : undefined}
                        >
                            <div 
                                className="schedule-day" 
                                style={item.badge_type === 'soon' ? { color: 'var(--amber)' } : undefined}
                            >
                                {item.day}
                            </div>
                            <div 
                                className="schedule-mon"
                                style={item.badge_type === 'soon' ? { color: 'var(--amber)' } : undefined}
                            >
                                {item.month}
                            </div>
                        </div>
                        <div className="schedule-info">
                            <div className="schedule-name">{item.title}</div>
                            <div className="schedule-time">{item.time}</div>
                        </div>
                        <span className={`schedule-badge ${item.badge_type}`}>
                            {item.badge}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
