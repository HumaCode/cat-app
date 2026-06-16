export default function Testimonials() {
    const testimonialList = [
        {
            name: 'Budi Kurniawan',
            role: 'Kepala BKPSDM Kota Pekalongan',
            avatar: 'BK',
            quote: 'CAT System benar-benar mengubah cara kami menyelenggarakan seleksi CPNS. Proses yang dulunya 3 hari bisa selesai dalam 1 hari dengan hasil lebih akurat.',
            bg: 'rgba(79,70,229,0.2)',
            color: 'var(--primary-light)',
            stars: 5,
        },
        {
            name: 'Dr. Siti Rahayu',
            role: 'Dekan Fakultas Hukum, Undip',
            avatar: 'SR',
            quote: 'Fitur anti-cheat yang sangat komprehensif. Kami bisa menyelenggarakan UAS online untuk 2000 mahasiswa secara bersamaan tanpa masalah.',
            bg: 'rgba(6,182,212,0.2)',
            color: 'var(--accent)',
            stars: 5,
        },
        {
            name: 'Ahmad Wijaya',
            role: 'Kabid Diklat, BKD Jawa Tengah',
            avatar: 'AW',
            quote: 'Bank soal dengan 9 tipe berbeda sangat membantu evaluasi kompetensi peserta diklat secara lebih holistik dan komprehensif.',
            bg: 'rgba(16,185,129,0.2)',
            color: '#34D399',
            stars: 5,
        },
        {
            name: 'Dewi Pratiwi',
            role: 'Direktur IT, Universitas Negeri Semarang',
            avatar: 'DP',
            quote: 'Setup cepat, antarmuka intuitif, dan laporan sangat detail. Tim support responsif dan membantu selama onboarding institusi kami.',
            bg: 'rgba(245,158,11,0.2)',
            color: 'var(--accent3)',
            stars: 5,
        },
        {
            name: 'Rina Susanti',
            role: 'Koordinator Seleksi, BKN Regional IV',
            avatar: 'RS',
            quote: 'Simulasi PPPK kami jauh lebih terstruktur. Peserta bisa latihan mandiri kapan saja, dan kami dapat memantau progres mereka secara real-time.',
            bg: 'rgba(236,72,153,0.2)',
            color: '#F472B6',
            stars: 4,
        },
    ];

    // Double the list for infinite marquee scrolling effect
    const items = [...testimonialList, ...testimonialList];

    return (
        <section className="testi-section" id="testimoni">
            <div className="container">
                <div className="reveal visible" style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ justifyContent: 'center' }}>
                        <span style={{ width: 20, height: 2, background: 'linear-gradient(90deg,var(--primary),var(--accent))', borderRadius: 2, display: 'inline-block' }}></span>
                        Testimoni
                    </div>
                    <h2 className="section-title">Dipercaya institusi terbaik</h2>
                </div>
            </div>
            <div style={{ overflow: 'hidden', marginTop: 50 }}>
                <div className="testi-scroll">
                    {items.map((testi, i) => (
                        <div key={i} className="testi-card">
                            <div className="stars">
                                {'★'.repeat(testi.stars)}
                                {'☆'.repeat(5 - testi.stars)}
                            </div>
                            <div className="testi-quote">"</div>
                            <div className="testi-text">{testi.quote}</div>
                            <div className="testi-author">
                                <div className="testi-avatar" style={{ backgroundColor: testi.bg, color: testi.color }}>
                                    {testi.avatar}
                                </div>
                                <div>
                                    <div className="testi-name">{testi.name}</div>
                                    <div className="testi-role">{testi.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
