import { useState, PropsWithChildren } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ParticleCanvas from '@/Components/ParticleCanvas';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';
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
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { auth } = usePage().props as any;
    const activeExamsCount = auth?.user?.active_exams_count || 0;

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    const handleLogout = () => {
        setIsLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setShowLogoutModal(false);
            }
        });
    };

    const isCurrent = (routeName: string) => {
        try {
            return route().current(routeName);
        } catch (e) {
            return false;
        }
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
            <header className="peserta-topbar">
                <Link href={route('dashboard.peserta')} className="peserta-brand">
                    <div className="brand-icon">C</div>
                    <span className="brand-name">CAT System</span>
                </Link>

                <nav className="peserta-nav">
                    <Link href={route('dashboard.peserta')} className={`nav-link ${isCurrent('dashboard.peserta') ? 'active' : ''}`}>
                        <span className="nav-icon">🏠</span> Beranda
                    </Link>
                    <Link href={route('peserta.ujian-saya')} className={`nav-link ${isCurrent('peserta.ujian-saya') ? 'active' : ''}`}>
                        <span className="nav-icon">📋</span> Ujian Saya
                        {activeExamsCount > 0 && (
                            <span className="nav-pill rose">{activeExamsCount}</span>
                        )}
                    </Link>
                    <Link href={route('peserta.hasil-nilai')} className={`nav-link ${isCurrent('peserta.hasil-nilai') ? 'active' : ''}`}>
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

                <div className="peserta-right">
                    <button className="peserta-notif">
                        🔔
                        <span className="notif-dot"></span>
                    </button>
                    <div 
                        className="peserta-ava" 
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
                <Link href={route('dashboard.peserta')} className={`nav-link ${isCurrent('dashboard.peserta') ? 'active' : ''}`} onClick={toggleMobileNav}>
                    <span className="nav-icon">🏠</span> Beranda
                </Link>
                <Link href={route('peserta.ujian-saya')} className={`nav-link ${isCurrent('peserta.ujian-saya') ? 'active' : ''}`} onClick={toggleMobileNav}>
                    <span className="nav-icon">📋</span> Ujian Saya
                    {activeExamsCount > 0 && (
                        <span className="nav-pill rose" style={{ marginLeft: '6px', position: 'static' }}>{activeExamsCount}</span>
                    )}
                </Link>
                <Link href={route('peserta.hasil-nilai')} className={`nav-link ${isCurrent('peserta.hasil-nilai') ? 'active' : ''}`} onClick={toggleMobileNav}>
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

            {/* Custom Reusable Logout Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />
        </div>
    );
}
