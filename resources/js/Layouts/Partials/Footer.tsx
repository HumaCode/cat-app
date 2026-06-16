export default function Footer() {
    return (
        <footer className="footer">
            <div>
                &copy; {new Date().getFullYear()} <strong>CAT System</strong>. Hak Cipta Dilindungi.
            </div>
            <div className="footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>Kebijakan Privasi</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Syarat & Ketentuan</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Bantuan</a>
            </div>
        </footer>
    );
}
