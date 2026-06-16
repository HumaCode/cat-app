export default function Workflow() {
    return (
        <section className="workflow-section" id="workflow">
            <div className="container">
                <div className="reveal visible" style={{ maxWidth: 540 }}>
                    <div className="section-label">Cara Kerja</div>
                    <h2 className="section-title">Dari persiapan ke hasil dalam 4 langkah</h2>
                </div>
                <div className="workflow-steps reveal visible">
                    <div className="workflow-step">
                        <div className="step-num">01</div>
                        <div className="step-title">Buat Bank Soal</div>
                        <div className="step-desc">
                            Upload soal via Excel, buat manual, atau impor dari sistem lama. Atur kategori & tag otomatis.
                        </div>
                    </div>
                    <div className="workflow-step">
                        <div className="step-num">02</div>
                        <div className="step-title">Konfigurasi Ujian</div>
                        <div className="step-desc">
                            Tentukan durasi, seksi, passing grade, metode pengacakan, dan aturan anti-cheat sesuai kebutuhan.
                        </div>
                    </div>
                    <div className="workflow-step">
                        <div className="step-num">03</div>
                        <div className="step-title">Undang Peserta</div>
                        <div className="step-desc">
                            Daftarkan via akun, token privat, atau link publik. Peserta bisa ujian dari perangkat apa pun.
                        </div>
                    </div>
                    <div className="workflow-step">
                        <div className="step-num">04</div>
                        <div className="step-title">Analisis Hasil</div>
                        <div className="step-desc">
                            Skor otomatis, ranking, distribusi nilai, dan ekspor laporan PDF/Excel langsung setelah ujian selesai.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
