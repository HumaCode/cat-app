import { useEffect, useRef, useState } from 'react';

interface MotivationBannerProps {
    ranking?: string;
    ujianTersisa?: number;
}

export default function MotivationBanner({
    ranking = '#1',
    ujianTersisa = 3,
}: MotivationBannerProps) {
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
        <div 
            ref={elementRef}
            className={`moti-banner anim ${visible ? 'in' : ''}`}
        >
            <div className="moti-text">
                <div className="moti-title">
                    Kamu berada di peringkat <em>{ranking}</em> minggu ini — pertahankan! 🔥
                </div>
                <div className="moti-sub">
                    Masih ada {ujianTersisa} ujian simulasi yang bisa meningkatkan skormu sebelum seleksi resmi.
                </div>
            </div>
            <button className="moti-cta">Latihan Sekarang →</button>
        </div>
    );
}
