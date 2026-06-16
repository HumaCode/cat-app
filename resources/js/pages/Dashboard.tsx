import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import '../../css/dashboard.css';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const mainChartRef = useRef<HTMLCanvasElement>(null);
    const donutChartRef = useRef<HTMLCanvasElement>(null);

    const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '90d'>('7d');

    const [activities, setActivities] = useState([
        { icon: '✅', bg: 'rgba(5,150,105,0.1)',  text: '<strong>Ahmad Rasyid</strong> menyelesaikan SKD CPNS — skor <strong>97.5</strong>',          time: 'Baru saja' },
        { icon: '🚨', bg: 'rgba(225,29,72,0.1)',  text: '<strong>Dea Anggraini</strong> terdeteksi tab blur 3× — <strong>peringatan dikirim</strong>',   time: '2 menit lalu' },
        { icon: '👤', bg: 'rgba(79,70,229,0.1)',  text: '<strong>15 peserta baru</strong> bergabung ke TKD PPPK Guru Batch 2',                           time: '5 menit lalu' },
        { icon: '📋', bg: 'rgba(13,148,136,0.1)', text: 'Ujian <strong>"TIU Verbal 2025"</strong> berhasil dipublikasikan',                              time: '12 menit lalu' },
        { icon: '📝', bg: 'rgba(124,58,237,0.1)', text: '<strong>Siti Dewi</strong> mengirimkan essay — menunggu penilaian manual',                       time: '18 menit lalu' },
        { icon: '⏰', bg: 'rgba(217,119,6,0.1)',  text: 'Ujian <strong>"SKD Paket B"</strong> dimulai dalam <strong>30 menit</strong>',                   time: '20 menit lalu' },
        { icon: '🏆', bg: 'rgba(217,119,6,0.1)',  text: '<strong>Bima Wicaksono</strong> meraih skor sempurna di Diklat IT',                             time: '32 menit lalu' },
    ]);

    // Live Activity Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const newActs = [
                { icon: '✅', bg: 'rgba(5,150,105,0.1)', text: '<strong>Peserta baru</strong> menyelesaikan sesi ujian', time: 'Baru saja' },
                { icon: '👤', bg: 'rgba(79,70,229,0.1)', text: '<strong>5 peserta baru</strong> bergabung ke ujian aktif', time: 'Baru saja' },
                { icon: '🚨', bg: 'rgba(225,29,72,0.1)', text: 'Terdeteksi aktivitas mencurigakan pada sesi #' + Math.floor(Math.random() * 9000 + 1000), time: 'Baru saja' },
            ];
            const rand = newActs[Math.floor(Math.random() * newActs.length)];
            setActivities(prev => {
                const updated = [rand, ...prev];
                if (updated.length > 10) updated.pop();
                return updated;
            });
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    // Draw Main Chart (Bezier Curve)
    useEffect(() => {
        const canvas = mainChartRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const parent = canvas.parentElement;
        const W = parent ? parent.offsetWidth : 600;
        const H = 220;
        canvas.width = W;
        canvas.height = H;
        canvas.style.width = '100%';
        canvas.style.height = H + 'px';

        const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        const sessions = [120, 185, 160, 230, 210, 280, 346];
        const scores = [68, 72, 70, 74, 75, 77, 79];
        const passed = [62, 68, 65, 72, 71, 76, 74];

        const padL = 42, padR = 20, padT = 16, padB = 40;
        const cW = W - padL - padR;
        const cH = H - padT - padB;

        const xPos = (i: number) => padL + (i / (labels.length - 1)) * cW;

        // Draw Grid lines
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(24,24,31,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padT + (i / 4) * cH;
            ctx.beginPath();
            ctx.moveTo(padL, y);
            ctx.lineTo(W - padR, y);
            ctx.stroke();
        }

        const drawArea = (data: number[], min: number, max: number, color: string, alpha: number) => {
            const pts = data.map((v, i) => [xPos(i), padT + (1 - (v - min) / (max - min)) * cH]);
            
            // Fill Area
            const grad = ctx.createLinearGradient(0, padT, 0, padT + cH);
            grad.addColorStop(0, color.replace('1)', `${alpha})`));
            grad.addColorStop(1, color.replace('1)', '0)'));
            
            ctx.beginPath();
            ctx.moveTo(pts[0][0], padT + cH);
            pts.forEach(([x, y]) => ctx.lineTo(x, y));
            ctx.lineTo(pts[pts.length - 1][0], padT + cH);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Draw Bezier Line
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) {
                const mx = (pts[i][0] + pts[i - 1][0]) / 2;
                ctx.bezierCurveTo(mx, pts[i - 1][1], mx, pts[i][1], pts[i][0], pts[i][1]);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Last dot highlight
            const lastPt = pts[pts.length - 1];
            ctx.beginPath();
            ctx.arc(lastPt[0], lastPt[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(lastPt[0], lastPt[1], 7, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        drawArea(sessions, 0, 400, 'rgba(79,70,229,1)', 0.12);
        drawArea(scores, 50, 100, 'rgba(13,148,136,1)', 0.10);
        drawArea(passed, 50, 100, 'rgba(217,119,6,1)', 0.08);

        // Labels
        ctx.fillStyle = '#B0B0CC';
        ctx.font = '11px "Bricolage Grotesque", system-ui';
        ctx.textAlign = 'center';
        labels.forEach((l, i) => ctx.fillText(l, xPos(i), H - 12));

        // Y-Axis values
        ctx.textAlign = 'right';
        ctx.fillStyle = '#B0B0CC';
        for (let i = 0; i <= 4; i++) {
            const y = padT + (i / 4) * cH;
            ctx.fillText(Math.round(400 - (i / 4) * 400).toString(), padL - 8, y + 4);
        }
    }, [chartPeriod]);

    // Handle Resize for Main Chart
    useEffect(() => {
        const handleResize = () => {
            const canvas = mainChartRef.current;
            if (!canvas) return;
            // Trigger redraw by setting the chartPeriod state or force redraw
            setChartPeriod(prev => prev);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Draw Donut Chart
    useEffect(() => {
        const canvas = donutChartRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cx = 70, cy = 70, r = 52, ir = 36;
        const segments = [
            { pct: 0.23, color: '#4F46E5' },
            { pct: 0.51, color: '#0D9488' },
            { pct: 0.18, color: '#D97706' },
            { pct: 0.08, color: '#E11D48' },
        ];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let start = -Math.PI / 2;
        segments.forEach(seg => {
            const angle = seg.pct * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, start, start + angle);
            ctx.closePath();
            ctx.fillStyle = seg.color;
            ctx.fill();
            start += angle;
        });

        // Inner hole
        ctx.beginPath();
        ctx.arc(cx, cy, ir, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Gap lines
        start = -Math.PI / 2;
        segments.forEach(seg => {
            const angle = seg.pct * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx + ir * Math.cos(start), cy + ir * Math.sin(start));
            ctx.lineTo(cx + r * Math.cos(start), cy + r * Math.sin(start));
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            start += angle;
        });
    }, []);

    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Greeting Header */}
            <div className="greeting-row anim-in d1">
                <div className="greeting-text">
                    <h1>Halo, <em>{user?.name || 'Administrator'}</em> 👋</h1>
                    <p>Ini ringkasan aktivitas ujian hari ini — semua terlihat berjalan lancar.</p>
                </div>
                <button className="btn-new-exam">
                    <span>＋</span>
                    <span className="btn-text">Buat Ujian Baru</span>
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="kpi-grid">
                <div className="kpi-card anim-in d2" style={{ '--clr-a': 'var(--indigo)', '--clr-s': 'var(--indigo-s)' } as any}>
                    <div className="kpi-top">
                        <div className="kpi-label">Ujian Aktif</div>
                        <div className="kpi-icon-box">📋</div>
                    </div>
                    <div className="kpi-num">8</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="kpi-trend up">↑ 2 minggu ini</span>
                    </div>
                    <div className="kpi-spark">
                        <svg width="100%" height="36" viewBox="0 0 120 36" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M0,28 L15,24 L30,20 L45,22 L60,16 L75,12 L90,10 L105,8 L120,6 L120,36 L0,36 Z" fill="url(#g1)"/>
                            <polyline points="0,28 15,24 30,20 45,22 60,16 75,12 90,10 105,8 120,6" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="120" cy="6" r="3" fill="#4F46E5"/>
                        </svg>
                    </div>
                    <div className="kpi-footer">3 ujian berakhir hari ini</div>
                </div>

                <div className="kpi-card anim-in d3" style={{ '--clr-a': 'var(--teal)', '--clr-s': 'var(--teal-s)' } as any}>
                    <div className="kpi-top">
                        <div className="kpi-label">Peserta Hari Ini</div>
                        <div className="kpi-icon-box">👥</div>
                    </div>
                    <div className="kpi-num">1<sup>,</sup>247</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="kpi-trend up">↑ 18% vs kemarin</span>
                    </div>
                    <div className="kpi-spark">
                        <svg width="100%" height="36" viewBox="0 0 120 36" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M0,30 L15,26 L30,28 L45,18 L60,20 L75,10 L90,14 L105,8 L120,6 L120,36 L0,36 Z" fill="url(#g2)"/>
                            <polyline points="0,30 15,26 30,28 45,18 60,20 75,10 90,14 105,8 120,6" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="120" cy="6" r="3" fill="#0D9488"/>
                        </svg>
                    </div>
                    <div className="kpi-footer">346 sedang mengerjakan sekarang</div>
                </div>

                <div className="kpi-card anim-in d4" style={{ '--clr-a': 'var(--emerald)', '--clr-s': 'var(--emerald-s)' } as any}>
                    <div className="kpi-top">
                        <div className="kpi-label">Rata-rata Skor</div>
                        <div className="kpi-icon-box">🎯</div>
                    </div>
                    <div className="kpi-num">74<sup>.2</sup></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="kpi-trend up">↑ 5.4 poin</span>
                    </div>
                    <div className="kpi-spark">
                        <svg width="100%" height="36" viewBox="0 0 120 36" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#059669" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#059669" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M0,24 L15,22 L30,26 L45,20 L60,18 L75,16 L90,12 L105,10 L120,8 L120,36 L0,36 Z" fill="url(#g3)"/>
                            <polyline points="0,24 15,22 30,26 45,20 60,18 75,16 90,12 105,10 120,8" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="120" cy="8" r="3" fill="#059669"/>
                        </svg>
                    </div>
                    <div className="kpi-footer">Passing grade rata-rata: 65</div>
                </div>

                <div className="kpi-card anim-in d5" style={{ '--clr-a': 'var(--violet)', '--clr-s': 'var(--violet-s)' } as any}>
                    <div className="kpi-top">
                        <div className="kpi-label">Total Soal</div>
                        <div className="kpi-icon-box">🏦</div>
                    </div>
                    <div className="kpi-num">12<sup>,</sup>480</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
                        <span className="kpi-trend up">↑ 240 soal baru</span>
                    </div>
                    <div className="kpi-spark">
                        <svg width="100%" height="36" viewBox="0 0 120 36" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="g4" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M0,32 L15,30 L30,28 L45,26 L60,22 L75,18 L90,14 L105,10 L120,8 L120,36 L0,36 Z" fill="url(#g4)"/>
                            <polyline points="0,32 15,30 30,28 45,26 60,22 75,18 90,14 105,10 120,8" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="120" cy="8" r="3" fill="#7C3AED"/>
                        </svg>
                    </div>
                    <div className="kpi-footer">9 kategori · 9 tipe soal</div>
                </div>
            </div>

            {/* Mid Grid: Chart + Live Activity */}
            <div className="mid-grid">
                <div className="main-chart-card anim-in d5">
                    <div className="card-head">
                        <div>
                            <div className="card-title">Tren Sesi Ujian</div>
                            <div className="card-sub">Jumlah sesi dan rata-rata skor per hari</div>
                        </div>
                        <div className="card-actions">
                            <button
                                className={`chip ${chartPeriod === '7d' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('7d')}
                            >
                                7H
                            </button>
                            <button
                                className={`chip ${chartPeriod === '30d' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('30d')}
                            >
                                30H
                            </button>
                            <button
                                className={`chip ${chartPeriod === '90d' ? 'active' : ''}`}
                                onClick={() => setChartPeriod('90d')}
                            >
                                3B
                            </button>
                        </div>
                    </div>
                    <div className="chart-wrap">
                        <canvas ref={mainChartRef} className="chart-canvas"></canvas>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item"><div className="legend-dot" style={{ background: '#4F46E5' }}></div> Sesi Ujian</div>
                        <div className="legend-item"><div className="legend-dot" style={{ background: '#0D9488' }}></div> Rata-rata Skor</div>
                        <div className="legend-item"><div className="legend-dot" style={{ background: '#D97706' }}></div> Kelulusan (%)</div>
                    </div>
                </div>

                <div className="activity-card anim-in d6">
                    <div className="card-head">
                        <div>
                            <div className="card-title">Aktivitas Terkini</div>
                            <div className="card-sub">Live update</div>
                        </div>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--emerald)',
                            boxShadow: '0 0 6px rgba(5,150,105,0.6)',
                            animation: 'pulse 2s infinite'
                        }}></div>
                    </div>
                    <div className="activity-list">
                        {activities.map((a, i) => (
                            <div className="activity-item" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="act-icon" style={{ background: a.bg }}>{a.icon}</div>
                                <div className="act-body">
                                    <div className="act-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                                    <div className="act-time">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Exam Table + Donut Chart & Leaderboard */}
            <div className="bot-grid">
                <div className="table-card anim-in d7">
                    <div className="table-head card-head" style={{ padding: '20px 24px 16px' }}>
                        <div>
                            <div className="card-title">Daftar Ujian Aktif & Mendatang</div>
                            <div className="card-sub">8 ujian aktif saat ini</div>
                        </div>
                        <button className="chip active">Lihat Semua →</button>
                    </div>
                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama Ujian</th>
                                    <th>Tipe</th>
                                    <th>Peserta</th>
                                    <th>Progres</th>
                                    <th>Status</th>
                                    <th>Selesai</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong style={{ color: 'var(--ink)' }}>SKD CPNS 2025 — Paket A</strong></td>
                                    <td><span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Simulasi</span></td>
                                    <td>346 / 400</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="prog-bar"><div className="prog-fill" style={{ width: '87%' }}></div></div>
                                            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>87%</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge active">Berlangsung</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>13:00</td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: 'var(--ink)' }}>TKD PPPK Guru Batch 2</strong></td>
                                    <td><span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Official</span></td>
                                    <td>198 / 250</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="prog-bar"><div className="prog-fill" style={{ width: '79%' }}></div></div>
                                            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>79%</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge active">Berlangsung</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>14:30</td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: 'var(--ink)' }}>Ujian Kompetensi Teknis IT</strong></td>
                                    <td><span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Diklat</span></td>
                                    <td>89 / 100</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="prog-bar"><div className="prog-fill" style={{ width: '89%' }}></div></div>
                                            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>89%</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge active">Berlangsung</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>15:00</td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: 'var(--ink)' }}>Simulasi TWK — Kebangsaan</strong></td>
                                    <td><span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Latihan</span></td>
                                    <td>0 / 500</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="prog-bar"><div className="prog-fill" style={{ width: '0%' }}></div></div>
                                            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>0%</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge scheduled">Terjadwal</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>Besok 08:00</td>
                                </tr>
                                <tr>
                                    <td><strong style={{ color: 'var(--ink)' }}>TIU — Kemampuan Verbal</strong></td>
                                    <td><span style={{ fontSize: '11px', color: 'var(--ink-3)' }}>Latihan</span></td>
                                    <td>—</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className="prog-bar"><div className="prog-fill" style={{ width: '0%' }}></div></div>
                                            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-3)' }}>Draft</span>
                                        </div>
                                    </td>
                                    <td><span className="status-badge draft">Draft</span></td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' }}>—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="side-cards">
                    {/* Score Distribution */}
                    <div className="score-card anim-in d7">
                        <div className="card-title">Distribusi Nilai</div>
                        <div className="card-sub" style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '3px' }}>SKD CPNS 2025</div>
                        <div className="donut-wrap">
                            <canvas ref={donutChartRef} width="140" height="140"></canvas>
                            <div className="donut-center">
                                <div className="donut-center-num">74%</div>
                                <div className="donut-center-lbl">lulus</div>
                            </div>
                        </div>
                        <div className="donut-legend">
                            <div className="donut-leg-item">
                                <div className="donut-leg-left"><div className="donut-leg-dot" style={{ background: '#4F46E5' }}></div>Sangat Baik (≥85)</div>
                                <div className="donut-leg-val">23%</div>
                            </div>
                            <div className="donut-leg-item">
                                <div className="donut-leg-left"><div className="donut-leg-dot" style={{ background: '#0D9488' }}></div>Baik (70–84)</div>
                                <div className="donut-leg-val">51%</div>
                            </div>
                            <div className="donut-leg-item">
                                <div className="donut-leg-left"><div className="donut-leg-dot" style={{ background: '#D97706' }}></div>Cukup (55–69)</div>
                                <div className="donut-leg-val">18%</div>
                            </div>
                            <div className="donut-leg-item">
                                <div className="donut-leg-left"><div className="donut-leg-dot" style={{ background: '#E11D48' }}></div>Kurang (&lt;55)</div>
                                <div className="donut-leg-val">8%</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Participants Leaderboard */}
                    <div className="leader-card anim-in d8">
                        <div className="card-title">🏆 Top Peserta</div>
                        <div className="card-sub" style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '3px' }}>Skor tertinggi minggu ini</div>
                        <div className="leader-list">
                            <div className="leader-item">
                                <div className="leader-rank gold">1</div>
                                <div className="leader-ava" style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)' }}>AR</div>
                                <div className="leader-info"><div className="leader-name">Ahmad Rasyid</div><div className="leader-inst">CPNS Batch 2025</div></div>
                                <div className="leader-score">97.5</div>
                            </div>
                            <div className="leader-item">
                                <div className="leader-rank silver">2</div>
                                <div className="leader-ava" style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED)' }}>SD</div>
                                <div className="leader-info"><div className="leader-name">Siti Dewi</div><div className="leader-inst">PPPK Guru</div></div>
                                <div className="leader-score">96.0</div>
                            </div>
                            <div className="leader-item">
                                <div className="leader-rank bronze">3</div>
                                <div className="leader-ava" style={{ background: 'linear-gradient(135deg,#0D9488,#059669)' }}>BW</div>
                                <div className="leader-info"><div className="leader-name">Bima Wicaksono</div><div className="leader-inst">Diklat IT</div></div>
                                <div className="leader-score">95.5</div>
                            </div>
                            <div className="leader-item">
                                <div className="leader-rank" style={{ color: 'var(--ink-4)' }}>4</div>
                                <div className="leader-ava" style={{ background: 'linear-gradient(135deg,#E11D48,#F43F5E)' }}>RP</div>
                                <div className="leader-info"><div className="leader-name">Rina Pratiwi</div><div className="leader-inst">CPNS Batch 2025</div></div>
                                <div className="leader-score">94.0</div>
                            </div>
                            <div className="leader-item">
                                <div className="leader-rank" style={{ color: 'var(--ink-4)' }}>5</div>
                                <div className="leader-ava" style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>HA</div>
                                <div className="leader-info"><div className="leader-name">Hendra Agus</div><div className="leader-inst">PPPK Tenaga</div></div>
                                <div className="leader-score">93.5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
