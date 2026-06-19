import { useEffect, useState } from 'react';

interface HeroBannerProps {
    name: string;
    instansi?: string;
    batch?: string;
    sisaUjian?: number;
    avgScore?: number;
}

export default function HeroBanner({
    name,
    instansi = 'BKPSDM Kota Pekalongan',
    batch = 'CPNS Batch 2025',
    sisaUjian = 3,
    avgScore = 74.2,
}: HeroBannerProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let current = 0;
        const target = avgScore;
        const duration = 1000; // 1s
        const steps = 60;
        const stepAmount = target / steps;
        const intervalTime = duration / steps;

        const interval = setInterval(() => {
            current = Math.min(current + stepAmount, target);
            setAnimatedScore(current);
            if (current >= target) {
                clearInterval(interval);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [avgScore]);

    // Circle dasharray calculation: 2 * PI * r = 2 * 3.14159 * 46 = 289
    // Dashoffset: 289 - (289 * (score / 100))
    const strokeDasharray = 289;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * (animatedScore / 100));

    return (
        <div className="hero-banner">
            <div className="hero-blob hb1"></div>
            <div className="hero-blob hb2"></div>
            <div className="hero-blob hb3"></div>
            <div className="hero-inner">
                <div className="hero-text">
                    <div className="hero-greeting">Dashboard Peserta</div>
                    <div className="hero-name">
                        Selamat datang,<br />
                        <em>{name}</em> 👋
                    </div>
                    <div className="hero-meta">
                        <div className="hero-meta-item">🏢 {instansi}</div>
                        <div className="hero-meta-dot"></div>
                        <div className="hero-meta-item">📋 {batch}</div>
                        {sisaUjian > 0 && (
                            <>
                                <div className="hero-meta-dot"></div>
                                <div className="hero-meta-item">🎯 {sisaUjian} ujian tersisa</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Score ring */}
                <div className="hero-score">
                    <div className="score-ring-wrap">
                        <svg width="110" height="110" viewBox="0 0 110 110">
                            <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8" />
                            <circle 
                                cx="55" 
                                cy="55" 
                                r="46" 
                                fill="none"
                                stroke="url(#ringGrad)" 
                                stroke-width="8"
                                stroke-linecap="round"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                                id="ringArc" 
                            />
                            <defs>
                                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#A78BFA" />
                                    <stop offset="100%" stopColor="#67E8F9" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="score-ring-center">
                            <div className="score-num" id="heroScore">
                                {animatedScore.toFixed(1)}
                            </div>
                            <div className="score-lbl">terakhir</div>
                        </div>
                    </div>
                    <div className="score-title">Nilai ujian<br />terakhir</div>
                </div>
            </div>
        </div>
    );
}
