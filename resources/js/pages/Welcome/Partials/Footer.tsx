export default function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <a href="#" className="logo" style={{ marginBottom: 16, display: 'inline-flex' }}>
                            <div className="logo-icon">C</div>
                            CAT<span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>System</span>
                        </a>
                        <p className="footer-tagline">
                            Platform Computer Assisted Test modern untuk institusi pemerintah dan pendidikan Indonesia.
                        </p>
                        <div className="footer-social">
                            <button className="social-btn">𝕏</button>
                            <button className="social-btn">in</button>
                            <button className="social-btn">🐙</button>
                            <button className="social-btn">📘</button>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Produk</h4>
                        <ul>
                            <li><a href="#fitur">Fitur</a></li>
                            <li><a href="#harga">Harga</a></li>
                            <li><a href="#">Changelog</a></li>
                            <li><a href="#">Roadmap</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Sumber Daya</h4>
                        <ul>
                            <li><a href="#">Dokumentasi</a></li>
                            <li><a href="#">API Reference</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Tutorial Video</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Perusahaan</h4>
                        <ul>
                            <li><a href="#">Tentang Kami</a></li>
                            <li><a href="#">Kontak</a></li>
                            <li><a href="#">Karir</a></li>
                            <li><a href="#">Kebijakan Privasi</a></li>
                            <li><a href="#">Syarat & Ketentuan</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2025 CAT System. Hak cipta dilindungi.</span>
                    <span>Dibuat dengan ❤ untuk Indonesia 🇮🇩</span>
                </div>
            </div>
        </footer>
    );
}
