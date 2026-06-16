import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import '../../../css/login.css';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
    });

    const [isFocused, setIsFocused] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel forgot-theme">
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
                                Keamanan akun Anda<br />
                                adalah prioritas<br />
                                <em>utama kami.</em>
                            </h1>
                            <p className="left-desc">
                                Jangan khawatir jika lupa password Anda. Masukkan alamat email Anda,
                                dan kami akan mengirimkan instruksi untuk mengatur ulang password baru.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">Keamanan</div>
                                    <div className="left-stat-label">Enkripsi End-to-End</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">Cepat</div>
                                    <div className="left-stat-label">Link Terkirim Instan</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#F59E0B' }}></span> Reset Aman
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#F59E0B' }}></span> Notifikasi Email
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#F59E0B' }}></span> Proteksi Akun
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">S</div>
                            <div>
                                <div className="review-name">Security Center</div>
                                <div className="review-role">CAT Authentication Layer</div>
                                <div className="review-text">"Proses reset password diverifikasi secara ketat menggunakan token terenkripsi dengan masa kedaluwarsa singkat."</div>
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
                            <div className="form-hello forgot-theme-text">Pemulihan Akun</div>
                            <h2 className="form-title">Lupa<br /><em>password?</em></h2>
                            <p className="form-subtitle">
                                Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang password.
                            </p>

                            {/* Status Message */}
                            {status && (
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
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} noValidate>
                                <div className="field-group">
                                    {/* Email */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="email">Alamat Email</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: isFocused ? '#F59E0B' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className={errors.email ? 'error' : ''}
                                                placeholder="nama@email.com"
                                                value={data.email}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                onChange={(e) => {
                                                    setData('email', e.target.value);
                                                    if (errors.email) clearErrors('email');
                                                }}
                                            />
                                        </div>
                                        {errors.email && <div className="field-error show">{errors.email}</div>}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" className={`btn-submit forgot-theme-btn ${processing ? 'loading' : ''}`} style={{ marginTop: 24 }} disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Kirim Link Reset</span>
                                </button>
                            </form>

                            {/* Back to login */}
                            <div className="register-row">
                                <Link href={route('login')}>Kembali ke Halaman Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
