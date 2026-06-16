import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';

interface TopbarProps {
    onToggleSidebar: () => void;
    title?: string;
}

export default function Topbar({ onToggleSidebar, title = 'Dashboard' }: TopbarProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [dateStr, setDateStr] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const now = new Date();
        setDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get greeting based on hour
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'selamat pagi 👋';
        if (hour < 15) return 'selamat siang ☀️';
        if (hour < 19) return 'selamat sore 🌅';
        return 'selamat malam 🌙';
    };

    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'US';

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        router.post(route('logout'));
    };

    return (
        <header className="topbar">
            <button className="hamburger" onClick={onToggleSidebar}>
                ☰
            </button>
            <div className="topbar-title">
                {title} <span>— {getGreeting()}</span>
            </div>
            <div className="topbar-search">
                <span className="topbar-search-icon">🔍</span>
                <input type="text" placeholder="Cari ujian, peserta..." />
            </div>
            <span className="topbar-date">{dateStr}</span>
            <div className="topbar-actions">
                <button className="icon-btn" title="Notifikasi">
                    🔔
                    <span className="notif-dot"></span>
                </button>

                {/* User Dropdown Menu */}
                <div className="topbar-user-menu" ref={dropdownRef}>
                    <button 
                        className="topbar-profile-trigger"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="topbar-user-info">
                            <span className="topbar-user-name">{user?.name || 'User'}</span>
                            <span className="topbar-user-email">{user?.email || 'user@example.com'}</span>
                        </div>
                        <div className="topbar-avatar">{initials}</div>
                    </button>

                    {dropdownOpen && (
                        <div className="topbar-dropdown">
                            <div className="dropdown-header-mobile">
                                <strong>{user?.name}</strong>
                                <span>{user?.email}</span>
                            </div>
                            <Link 
                                href={route('profile.edit')} 
                                className="dropdown-item" 
                                onClick={() => setDropdownOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Profil
                            </Link>
                            <Link 
                                href={route('profile.edit')} 
                                className="dropdown-item" 
                                onClick={() => setDropdownOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                Pengaturan
                            </Link>
                            <hr className="dropdown-divider" />
                            <button
                                className="dropdown-item logout-btn"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    setShowLogoutModal(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                Keluar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Interactive Logout Modal */}
            {showLogoutModal && (
                <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon-wrap">⚠️</div>
                        <h3 className="modal-title">Konfirmasi Keluar</h3>
                        <p className="modal-desc">
                            Apakah Anda yakin ingin keluar dari <strong>CAT System</strong>? Sesi Anda akan berakhir dan Anda perlu login kembali.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-modal cancel" onClick={() => setShowLogoutModal(false)}>
                                Batal
                            </button>
                            <button className="btn-modal confirm" onClick={handleLogoutConfirm}>
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
