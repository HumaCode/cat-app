import { Link } from '@inertiajs/react';

interface PricingProps {
    auth: {
        user: any;
    };
}

export default function Pricing({ auth }: PricingProps) {
    const getCtaLink = (plan: string) => {
        return auth.user ? route('dashboard') : route('register') + '?plan=' + plan;
    };

    return (
        <section className="pricing-section" id="harga">
            <div className="container">
                <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 0 }}>
                    <div className="section-label" style={{ justifyContent: 'center' }}>
                        <span style={{ width: 20, height: 2, background: 'linear-gradient(90deg,var(--primary),var(--accent))', borderRadius: 2, display: 'inline-block' }}></span>
                        Harga
                    </div>
                    <h2 className="section-title">Transparan, tanpa biaya tersembunyi</h2>
                    <p className="section-desc" style={{ margin: '0 auto' }}>Mulai gratis, upgrade kapan saja sesuai skala kebutuhan institusi Anda.</p>
                </div>
                <div className="pricing-grid reveal visible">
                    <div className="pricing-card">
                        <div className="pricing-plan">Starter</div>
                        <div className="pricing-price">Gratis</div>
                        <div className="pricing-period">Selamanya — tidak perlu kartu kredit</div>
                        <div className="pricing-divider"></div>
                        <ul className="pricing-features">
                            <li><span className="check">✓</span> 500 soal di bank</li>
                            <li><span className="check">✓</span> 5 ujian aktif</li>
                            <li><span className="check">✓</span> 100 peserta/ujian</li>
                            <li><span className="check">✓</span> 4 tipe soal dasar</li>
                            <li><span className="check">✓</span> Laporan dasar</li>
                            <li><span className="cross" style={{ color: 'var(--text-dim)' }}>✗</span> Anti-cheat lanjutan</li>
                            <li><span className="cross" style={{ color: 'var(--text-dim)' }}>✗</span> Proctoring webcam</li>
                        </ul>
                        <Link href={getCtaLink('starter')} className="btn-ghost" style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 10, fontSize: 14 }}>
                            {auth.user ? 'Ke Dashboard' : 'Mulai Gratis'}
                        </Link>
                    </div>

                    <div className="pricing-card popular">
                        <div className="popular-badge">Terpopuler</div>
                        <div className="pricing-plan">Profesional</div>
                        <div className="pricing-price"><sup>Rp</sup>299<span style={{ fontSize: 18, fontWeight: 400, color: 'var(--text-dim)' }}>rb</span></div>
                        <div className="pricing-period">per bulan per institusi</div>
                        <div className="pricing-divider"></div>
                        <ul className="pricing-features">
                            <li><span className="check">✓</span> Soal tak terbatas</li>
                            <li><span className="check">✓</span> Ujian tak terbatas</li>
                            <li><span className="check">✓</span> 1.000 peserta/ujian</li>
                            <li><span className="check">✓</span> Semua 9 tipe soal</li>
                            <li><span className="check">✓</span> Anti-cheat lengkap</li>
                            <li><span className="check">✓</span> Laporan & ekspor PDF</li>
                            <li><span className="cross" style={{ color: 'var(--text-dim)' }}>✗</span> Proctoring webcam</li>
                        </ul>
                        <Link href={getCtaLink('professional')} className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: 13, borderRadius: 10, fontSize: 14 }}>
                            {auth.user ? 'Ke Dashboard' : 'Mulai 14 Hari Gratis'}
                        </Link>
                    </div>

                    <div className="pricing-card">
                        <div className="pricing-plan">Enterprise</div>
                        <div className="pricing-price" style={{ fontSize: 32, paddingTop: 6 }}>Custom</div>
                        <div className="pricing-period">hubungi tim kami</div>
                        <div className="pricing-divider"></div>
                        <ul className="pricing-features">
                            <li><span className="check">✓</span> Semua fitur Pro</li>
                            <li><span className="check">✓</span> Proctoring webcam AI</li>
                            <li><span className="check">✓</span> Peserta tak terbatas</li>
                            <li><span className="check">✓</span> Subdomain custom</li>
                            <li><span className="check">✓</span> Integrasi SSO/LDAP</li>
                            <li><span className="check">✓</span> Dedicated support</li>
                            <li><span className="check">✓</span> On-premise tersedia</li>
                        </ul>
                        <a href="mailto:sales@cat-system.id" className="btn-ghost" style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 10, fontSize: 14 }}>
                            Hubungi Sales
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
