import { Link, usePage } from '@inertiajs/react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const institution = user?.institution;

    // Get initials
    const initials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'US';

    const currentRoute = route().current() || '';

    const handleItemClick = () => {
        if (window.innerWidth <= 900) {
            onClose();
        }
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-head">
                    <Link href={route('dashboard')} className="brand">
                        <div className="brand-icon">C</div>
                        <div className="brand-name">
                            CAT<span>System</span>
                        </div>
                    </Link>
                </div>

                <div className="sidebar-body">
                    <div className="nav-section">
                        <div className="nav-section-title">Utama</div>
                        <Link
                            href={route('dashboard')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute === 'dashboard' ? 'active' : ''}`}
                        >
                            <div className="nav-icon">🏠</div>
                            Dashboard
                        </Link>
                        <Link
                            href={route('ujian.index')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute.startsWith('ujian') ? 'active' : ''}`}
                        >
                            <div className="nav-icon">📋</div>
                            Manajemen Ujian
                            <span className="nav-badge teal">3</span>
                        </Link>
                        <Link
                            href={route('kategori.index')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute.startsWith('kategori') ? 'active' : ''}`}
                        >
                            <div className="nav-icon"><i className="bi bi-tags-fill"></i></div>
                            Kategori Soal
                        </Link>
                        <Link
                            href={route('bank-soal.index')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute.startsWith('bank-soal') ? 'active' : ''}`}
                        >
                            <div className="nav-icon">🏦</div>
                            Bank Soal
                        </Link>
                        <Link
                            href={route('peserta.index')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute.startsWith('peserta') ? 'active' : ''}`}
                        >
                            <div className="nav-icon">👥</div>
                            Peserta
                        </Link>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Analitik</div>
                        <button className="nav-item" onClick={handleItemClick}>
                            <div className="nav-icon">📊</div>
                            Laporan & Hasil
                        </button>
                        <button className="nav-item" onClick={handleItemClick}>
                            <div className="nav-icon">🏆</div>
                            Ranking & Nilai
                        </button>
                        <button className="nav-item" onClick={handleItemClick}>
                            <div className="nav-icon">🎯</div>
                            Analitik Soal
                        </button>
                    </div>

                    <div className="nav-section">
                        <div className="nav-section-title">Sistem</div>
                        <button className="nav-item" onClick={handleItemClick}>
                            <div className="nav-icon">🏢</div>
                            Institusi
                        </button>
                        <button className="nav-item" onClick={handleItemClick}>
                            <div className="nav-icon">🛡️</div>
                            Akses & Role
                        </button>
                        <Link
                            href={route('profile.edit')}
                            onClick={handleItemClick}
                            className={`nav-item ${currentRoute === 'profile.edit' ? 'active' : ''}`}
                        >
                            <div className="nav-icon">⚙️</div>
                            Pengaturan
                        </Link>
                    </div>
                </div>

                <div className="sidebar-foot">
                    <Link
                        href={route('profile.edit')}
                        className="user-card"
                        style={{ display: 'flex' }}
                    >
                        <div className="user-ava">{initials}</div>
                        <div className="user-info">
                            <div className="user-name">{user?.name || 'User'}</div>
                            <div className="user-role">
                                {institution?.name || (user?.role === 'admin' ? 'Super Admin' : 'Peserta')}
                            </div>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
}
