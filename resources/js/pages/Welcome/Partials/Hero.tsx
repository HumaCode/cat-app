import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

interface HeroProps {
    auth: {
        user: any;
    };
}

export default function Hero({ auth }: HeroProps) {
    const [secondsLeft, setSecondsLeft] = useState(5025);
    const [selectedOption, setSelectedOption] = useState('B');

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimer = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return (
            String(h).padStart(2, '0') +
            ':' +
            String(m).padStart(2, '0') +
            ':' +
            String(s).padStart(2, '0')
        );
    };

    return (
        <section className="hero" id="home">
            <div className="container">
                <div className="hero-inner">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="hero-badge-dot"></span>
                            Platform CAT Generasi Baru
                        </div>
                        <h1 className="hero-title">
                            Ujian Online<br />
                            <span className="highlight">Cerdas & Modern</span><br />
                            untuk Era Digital
                        </h1>
                        <p className="hero-desc">
                            Platform Computer Assisted Test lengkap dengan bank soal multi-tipe,
                            simulasi CPNS/PPPK, anti-cheat canggih, dan analitik hasil real-time.
                            Dirancang untuk institusi pemerintah & pendidikan Indonesia.
                        </p>
                        <div className="hero-actions">
                            <Link href={auth.user ? route('dashboard') : route('register')} className="btn-primary btn-lg">
                                {auth.user ? 'Masuk ke Dashboard' : 'Mulai Sekarang — Gratis'}
                            </Link>
                            <a href="#tipe-soal" className="btn-outline-lg">
                                <span className="btn-play-icon">▶</span>
                                Lihat Demo
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div>
                                <div className="hero-stat-num">50.000</div>
                                <div className="hero-stat-label">Soal di Bank</div>
                            </div>
                            <div style={{ width: 1, backgroundColor: 'var(--card-border)' }}></div>
                            <div>
                                <div className="hero-stat-num">120</div>
                                <div className="hero-stat-label">Institusi Aktif</div>
                            </div>
                            <div style={{ width: 1, backgroundColor: 'var(--card-border)' }}></div>
                            <div>
                                <div className="hero-stat-num">9</div>
                                <div className="hero-stat-label">Tipe Soal</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-mockup">
                            <div className="mockup-topbar">
                                <div className="mockup-dots">
                                    <div className="mockup-dot"></div>
                                    <div className="mockup-dot"></div>
                                    <div className="mockup-dot"></div>
                                </div>
                                <div className="mockup-title-bar">cat-system.id/ujian/SKD-CPNS-2025</div>
                            </div>
                            <div className="mockup-body">
                                <div className="exam-header">
                                    <div className="exam-label">Simulasi Seleksi</div>
                                    <div className="exam-title">SKD CPNS 2025 — Paket A</div>
                                </div>
                                <div className="timer-bar">
                                    <div className="timer-left">⏱ Sisa Waktu</div>
                                    <div className="timer-time" id="mockTimer">
                                        {formatTimer(secondsLeft)}
                                    </div>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill"></div>
                                </div>
                                <div className="soal-num">Soal 21 dari 110 • TWK</div>
                                <div className="soal-text">
                                    Pancasila sebagai dasar negara Indonesia pertama kali dikemukakan oleh Ir. Soekarno pada tanggal...
                                </div>
                                <div className="option-list">
                                    {[
                                        { key: 'A', text: '1 Juni 1945' },
                                        { key: 'B', text: '1 Juni 1945 dalam sidang BPUPKI' },
                                        { key: 'C', text: '18 Agustus 1945' },
                                        { key: 'D', text: '17 Agustus 1945' },
                                    ].map((opt) => (
                                        <div
                                            key={opt.key}
                                            className={`option-item ${selectedOption === opt.key ? 'active' : ''}`}
                                            onClick={() => setSelectedOption(opt.key)}
                                        >
                                            <div className="option-label">{opt.key}</div>
                                            <span>{opt.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="nav-dots">
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <div key={i + 1} className="nav-dot answered">
                                            {i + 1}
                                        </div>
                                    ))}
                                    <div className="nav-dot current">21</div>
                                    <div className="nav-dot empty">22</div>
                                    <div className="nav-dot empty">23</div>
                                    <div className="nav-dot empty">24</div>
                                </div>
                            </div>
                        </div>

                        <div className="float-card float-card-1">
                            <div className="float-card-label">Skor Real-time</div>
                            <div className="float-card-val green">87.5</div>
                            <div className="float-card-sub">Benar: 70 • Salah: 4</div>
                        </div>

                        <div className="float-card float-card-2">
                            <div className="float-card-label">Peserta Online</div>
                            <div className="float-card-val blue">1.247</div>
                            <div className="float-card-sub">sedang mengerjakan</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
