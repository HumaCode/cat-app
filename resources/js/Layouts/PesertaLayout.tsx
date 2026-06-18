import { useState, PropsWithChildren } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ParticleCanvas from '@/Components/ParticleCanvas';
import '../../css/peserta-dashboard.css';

interface PesertaLayoutProps {
    title?: string;
    userName?: string;
    userInitials?: string;
}

export default function PesertaLayout({
    children,
    title = 'Dashboard Peserta',
    userName = 'Ahmad Rasyid',
    userInitials = 'AR',
}: PropsWithChildren<PesertaLayoutProps>) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="peserta-body">
            <Head title={`${title} — CAT System`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            {/* Interactive Particle Canvas */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <ParticleCanvas />
            </div>

            {/* ═══ TOPBAR ═══ */}
            <header className="topbar">
                <Link href="#" className="topbar-brand">
                    <div className="brand-icon">C</div>
                    <span class="brand-name">CAT System</span>
                </Link>

                <nav className="topbar-nav">
                    <Link href="#" className="nav-link active">
                        <span className="nav-icon">🏠</span> Beranda
                    </Link>
                    <Link href="#" className="nav-link">
                        <span className="nav-icon">📋</span> Ujian Saya
                        <span className="nav-pill rose">1</span>
                    </Link>
                    <Link href="#" className="nav-link">
                        <span className="nav-icon">📊</span> Hasil & Nilai
                    </Link>
                    <Link href="#" className="nav-link">
                        <span className="nav-icon">📅</span> Jadwal
                        <span className="nav-pill">3</span>
                    </Link>
                    <Link href="#" className="nav-link">
                        <span className="nav-icon">🏆</span> Ranking
                    </Link>
                </nav>

                <div className="topbar-right">
                    <button className="topbar-notif">
                        🔔
                        <span className="notif-dot"></span>
                    </button>
                    <div 
                        className="topbar-ava" 
                        title={userName}
                        onClick={() => setShowLogoutModal(true)}
                    >
                        {userInitials}
                    </div>
                    <button className="hamburger" onClick={toggleMobileNav}>☰</button>
                </div>
            </header>

            {/* Mobile nav */}
            <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} id="mobileNav">
                <Link href="#" className="nav-link active" onClick={toggleMobileNav}>
                    <span className="nav-icon">🏠</span> Beranda
                </Link>
                <Link href="#" className="nav-link" onClick={toggleMobileNav}>
                    <span className="nav-icon">📋</span> Ujian Saya
                </Link>
                <Link href="#" className="nav-link" onClick={toggleMobileNav}>
                    <span className="nav-icon">📊</span> Hasil & Nilai
                </Link>
                <Link href="#" className="nav-link" onClick={toggleMobileNav}>
                    <span className="nav-icon">📅</span> Jadwal
                </Link>
                <Link href="#" className="nav-link" onClick={toggleMobileNav}>
                    <span className="nav-icon">🏆</span> Ranking
                </Link>
                <button 
                    onClick={handleLogout} 
                    className="nav-link" 
                    style={{ textAlign: 'left', width: '100%', color: 'var(--rose)' }}
                >
                    <span className="nav-icon">🚪</span> Keluar
                </button>
            </div>

            {/* Content Wrap */}
            <div className="page">
                {children}
            </div>

            {/* Clean Logout Modal */}
            {showLogoutModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(20,20,33,0.4)',
                    backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r)',
                        width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: 'var(--ink)' }}>
                            Konfirmasi Keluar
                        </h3>
                        <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginBottom: '20px', lineHeight: 1.5 }}>
                            Apakah Anda yakin ingin keluar dari aplikasi? Sesi Anda akan berakhir.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                style={{
                                    padding: '10px 18px', borderRadius: 'var(--r-sm)',
                                    background: 'var(--bg-2)', color: 'var(--ink-2)',
                                    fontSize: '13px', fontWeight: 700
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    padding: '10px 18px', borderRadius: 'var(--r-sm)',
                                    background: 'var(--rose)', color: '#fff',
                                    fontSize: '13px', fontWeight: 700
                                }}
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
