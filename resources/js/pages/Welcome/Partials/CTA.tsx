import { Link } from '@inertiajs/react';

interface CTAProps {
    auth: {
        user: any;
    };
}

export default function CTA({ auth }: CTAProps) {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-box reveal visible">
                    <div className="cta-title">
                        Siap modernisasi<br />sistem ujian Anda?
                    </div>
                    <p className="cta-desc">
                        Bergabung dengan 120+ institusi yang sudah mempercayai CAT System.<br />
                        Setup dalam 10 menit, tanpa perlu kartu kredit.
                    </p>
                    <div className="cta-actions">
                        <Link href={auth.user ? route('dashboard') : route('register')} className="btn-primary btn-lg">
                            {auth.user ? 'Ke Dashboard' : 'Mulai Gratis Sekarang'}
                        </Link>
                        <a href="#harga" className="btn-outline-lg">Jadwalkan Demo</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
