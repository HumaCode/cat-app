import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface TopbarProps {
    onToggleSidebar: () => void;
    title?: string;
}

export default function Topbar({ onToggleSidebar, title = 'Dashboard' }: TopbarProps) {
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const now = new Date();
        setDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    }, []);

    // Get greeting based on hour
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'selamat pagi 👋';
        if (hour < 15) return 'selamat siang ☀️';
        if (hour < 19) return 'selamat sore 🌅';
        return 'selamat malam 🌙';
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
            <div className="topbar-actions">
                <button className="icon-btn" title="Notifikasi">
                    🔔
                    <span className="notif-dot"></span>
                </button>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="icon-btn"
                    title="Keluar"
                >
                    🚪
                </Link>
            </div>
            <span className="topbar-date">{dateStr}</span>
        </header>
    );
}
