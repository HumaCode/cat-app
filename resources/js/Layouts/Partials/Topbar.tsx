import { Link, usePage } from '@inertiajs/react';
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
                                👤 Profil
                            </Link>
                            <Link 
                                href={route('profile.edit')} 
                                className="dropdown-item" 
                                onClick={() => setDropdownOpen(false)}
                            >
                                ⚙️ Pengaturan
                            </Link>
                            <hr className="dropdown-divider" />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="dropdown-item logout-btn"
                                onClick={() => setDropdownOpen(false)}
                            >
                                🚪 Keluar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
