import { Link } from '@inertiajs/react';

interface NavbarProps {
    auth: {
        user: any;
    };
    menuOpen: boolean;
    setMenuOpen: (open: boolean) => void;
    activeSection: string;
}

export default function Navbar({ auth, menuOpen, setMenuOpen, activeSection }: NavbarProps) {
    return (
        <>
            <nav id="navbar" className="scrolled">
                <div className="nav-inner">
                    <a href="#home" className="logo">
                        <div className="logo-icon">C</div>
                        CAT<span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>System</span>
                    </a>
                    <ul className="nav-links">
                        <li>
                            <a
                                href="#fitur"
                                className={activeSection === 'fitur' ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Fitur
                            </a>
                        </li>
                        <li>
                            <a
                                href="#tipe-soal"
                                className={activeSection === 'tipe-soal' ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Tipe Soal
                            </a>
                        </li>
                        <li>
                            <a
                                href="#workflow"
                                className={activeSection === 'workflow' ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Cara Kerja
                            </a>
                        </li>
                        <li>
                            <a
                                href="#harga"
                                className={activeSection === 'harga' ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Harga
                            </a>
                        </li>
                        <li>
                            <a
                                href="#testimoni"
                                className={activeSection === 'testimoni' ? 'active' : ''}
                                onClick={() => setMenuOpen(false)}
                            >
                                Testimoni
                            </a>
                        </li>
                    </ul>
                    <div className="nav-cta">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="btn-primary">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-ghost">Masuk</Link>
                                <Link href={route('register')} className="btn-primary">Coba Gratis</Link>
                            </>
                        )}
                    </div>
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobileMenu">
                <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
                <a href="#tipe-soal" onClick={() => setMenuOpen(false)}>Tipe Soal</a>
                <a href="#workflow" onClick={() => setMenuOpen(false)}>Cara Kerja</a>
                <a href="#harga" onClick={() => setMenuOpen(false)}>Harga</a>
                <a href="#testimoni" onClick={() => setMenuOpen(false)}>Testimoni</a>
                <div className="mobile-menu-cta">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="btn-primary btn-lg" style={{ textAlign: 'center', display: 'block' }}>Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="btn-ghost" style={{ textAlign: 'center', display: 'block' }}>Masuk</Link>
                            <Link href={route('register')} className="btn-primary btn-lg" style={{ textAlign: 'center', display: 'block' }}>Coba Gratis</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
