export default function Features() {
    return (
        <section className="features-section" id="fitur">
            <div className="container">
                <div className="features-header reveal visible">
                    <div className="section-label">Fitur Lengkap</div>
                    <h2 className="section-title">
                        Semua yang kamu butuhkan<br />
                        ada di satu platform
                    </h2>
                    <p className="section-desc">
                        Dari pembuatan soal hingga analitik hasil, CAT System menyediakan ekosistem ujian online yang komprehensif.
                    </p>
                </div>
                <div className="features-grid reveal visible">
                    <div className="feature-card">
                        <div className="feature-icon purple">🏦</div>
                        <div className="feature-name">Bank Soal Terpusat</div>
                        <div className="feature-desc">
                            Kelola ribuan soal dengan kategori hierarki, tag Bloom's Taxonomy, dan tingkat kesulitan. Import dari Excel/Word.
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon cyan">⚡</div>
                        <div className="feature-name">Ujian Real-time</div>
                        <div className="feature-desc">
                            Timer presisi, auto-submit saat waktu habis, navigasi soal cepat, dan sinkronisasi jawaban otomatis tanpa kehilangan data.
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon green">🎯</div>
                        <div className="feature-name">9 Tipe Soal</div>
                        <div className="feature-desc">
                            Pilihan ganda, essay, menjodohkan, benar/salah, isian singkat, urutan/puzzle, audio, video, dan multiple response.
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon red">🛡️</div>
                        <div className="feature-name">Anti-cheat Canggih</div>
                        <div className="feature-desc">
                            Deteksi tab blur, fullscreen lock, disable copy-paste, webcam proctoring, dan laporan pelanggaran otomatis.
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon amber">📊</div>
                        <div className="feature-name">Analitik & Laporan</div>
                        <div className="feature-desc">
                            Statistik skor, distribusi nilai, passing grade otomatis, ranking peserta, dan ekspor PDF/Excel sekali klik.
                        </div>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon pink">🏢</div>
                        <div className="feature-name">Multi-Institusi</div>
                        <div className="feature-desc">
                            Arsitektur multi-tenant, role-based access (Super Admin, Admin, Pembuat Soal, Peserta), dan isolasi data antar lembaga.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
