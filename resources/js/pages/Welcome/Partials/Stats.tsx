export default function Stats() {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid reveal visible">
                    <div className="stat-block">
                        <div className="stat-num">
                            <span>50</span>
                            <span className="stat-unit">rb+</span>
                        </div>
                        <div className="stat-label">Soal Tersedia</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-num">
                            <span>120</span>
                            <span className="stat-unit">+</span>
                        </div>
                        <div className="stat-label">Institusi Terdaftar</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-num">
                            <span>500</span>
                            <span className="stat-unit">rb+</span>
                        </div>
                        <div className="stat-label">Sesi Ujian Selesai</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-num">
                            <span>99</span>
                            <span className="stat-unit">.9%</span>
                        </div>
                        <div className="stat-label">Uptime SLA</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
