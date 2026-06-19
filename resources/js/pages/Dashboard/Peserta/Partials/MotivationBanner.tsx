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

    const hasRank = ranking && ranking !== '—' && ranking !== '';
    const title = hasRank 
        ? <>Kamu berada di peringkat <em>{ranking}</em> minggu ini — pertahankan! 🔥</>
        : <>Ayo mulai ujian pertamamu dan tunjukkan kemampuan terbaikmu! 🚀</>;

    const sub = hasRank
        ? (ujianTersisa > 0 
            ? `Masih ada ${ujianTersisa} ujian simulasi yang bisa meningkatkan skormu sebelum seleksi resmi.` 
            : `Semua ujian simulasi telah selesai dikerjakan! Tetap pantau pengumuman selanjutnya.`)
        : (ujianTersisa > 0 
            ? `Ada ${ujianTersisa} ujian simulasi yang siap kamu kerjakan untuk melatih kesiapanmu.` 
            : `Belum ada ujian simulasi yang tersedia saat ini.`);

    return (
        <div 
            ref={elementRef}
            className={`moti-banner anim ${visible ? 'in' : ''}`}
        >
            <div className="moti-text">
                <div className="moti-title">
                    {title}
                </div>
                <div className="moti-sub">
                    {sub}
                </div>
            </div>
            {ujianTersisa > 0 && <button className="moti-cta">Latihan Sekarang →</button>}
        </div>
    );
}
