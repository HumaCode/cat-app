import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import '../../../css/login.css';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verifikasi Email — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel verify-theme">
                        <div className="shape-ring ring-1"></div>
                        <div className="shape-ring ring-2"></div>
                        <div className="shape-ring ring-3"></div>
                        <div className="shape-blob blob-1"></div>
                        <div className="shape-blob blob-2"></div>
                        <div className="shape-blob blob-3"></div>

                        {/* Logo */}
                        <Link href="/" className="left-logo">
                            <div className="left-logo-icon">C</div>
                            <span className="left-logo-text">CAT System</span>
                        </Link>

                        {/* Body */}
                        <div className="left-body">
                            <h1 className="left-tagline">
                                Satu langkah lagi<br />
                                untuk memulai<br />
                                <em>perjalanan Anda.</em>
                            </h1>
                            <p className="left-desc">
                                Terima kasih telah mendaftar! Harap verifikasi alamat email Anda terlebih dahulu
                                dengan mengklik link tautan yang baru saja kami kirimkan ke inbox email Anda.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">Validasi</div>
                                    <div className="left-stat-label">Keamanan Akun</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">100%</div>
                                    <div className="left-stat-label">Prosedur Standar</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Email Valid
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Anti-Spam
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">V</div>
                            <div>
                                <div className="review-name">Verification Bot</div>
                                <div className="review-role">CAT Gatekeeper</div>
                                <div className="review-text">"Pemeriksaan email memastikan bahwa semua notifikasi hasil ujian, jadwal, serta tagihan institusi Anda terkirim dengan tepat."</div>
                                <div className="review-stars">★★★★★</div>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RIGHT PANEL — FORM ═══ */}
                    <div className="right-panel">
                        <div className="form-box">
                            {/* Mobile logo */}
                            <div className="mobile-logo">
                                <div className="mobile-logo-icon">C</div>
                                <span className="mobile-logo-text">CAT System</span>
                            </div>

                            {/* Header */}
                            <div className="form-hello verify-theme-text">Konfirmasi Pendaftaran</div>
                            <h2 className="form-title">Verifikasi<br /><em>email Anda</em></h2>
                            <p className="form-subtitle">
                                Silakan periksa inbox email Anda untuk mengaktifkan akun secara penuh.
                            </p>

                            {/* Status Message */}
                            {status === 'verification-link-sent' && (
                                <div className="mb-4" style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(16,185,129,0.1)',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    color: '#10B981',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    lineHeight: '1.5',
                                    marginBottom: '24px'
                                }}>
                                    Link verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit}>
                                <button type="submit" className={`btn-submit verify-theme-btn ${processing ? 'loading' : ''}`} disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Kirim Ulang Email Verifikasi</span>
                                </button>
                            </form>

                            {/* Logout link */}
                            <div className="register-row" style={{ marginTop: 24 }}>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#E53E3E',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Keluar (Log Out)
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
