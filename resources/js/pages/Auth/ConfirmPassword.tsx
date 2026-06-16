import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import '../../../css/login.css';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        password: '',
    });

    const [pwdVisible, setPwdVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Konfirmasi Password — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel confirm-theme">
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
                                Area Keamanan<br />
                                Terproteksi<br />
                                <em>Sistem CAT.</em>
                            </h1>
                            <p className="left-desc">
                                Anda mencoba mengakses area yang sensitif. Untuk keamanan akun Anda,
                                harap konfirmasikan password Anda terlebih dahulu sebelum melanjutkan.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">Proteksi</div>
                                    <div className="left-stat-label">Sesi Aktif Diuji</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">Valid</div>
                                    <div className="left-stat-label">Konfirmasi Instan</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#06B6D4' }}></span> Area Aman
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#06B6D4' }}></span> Proteksi Ganda
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">S</div>
                            <div>
                                <div className="review-name">Security Guard</div>
                                <div className="review-role">CAT Gatekeeper</div>
                                <div className="review-text">"Konfirmasi sandi diperlukan sebelum Anda melakukan perubahan pengaturan atau data profil sensitif."</div>
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
                            <div className="form-hello confirm-theme-text">Verifikasi Akun</div>
                            <h2 className="form-title">Konfirmasi<br /><em>password</em></h2>
                            <p className="form-subtitle">
                                Masukkan password Anda untuk melanjutkan.
                            </p>

                            {/* Form */}
                            <form onSubmit={submit} noValidate>
                                <div className="field-group">
                                    {/* Password */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="password">Password Anda</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: isFocused ? '#06B6D4' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                            <input
                                                type={pwdVisible ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                className={errors.password ? 'error' : ''}
                                                placeholder="••••••••"
                                                value={data.password}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                onChange={(e) => {
                                                    setData('password', e.target.value);
                                                    if (errors.password) clearErrors('password');
                                                }}
                                            />
                                            <button type="button" className="pwd-toggle" onClick={() => setPwdVisible(!pwdVisible)} aria-label="Lihat password">
                                                {pwdVisible ? (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                                                    </svg>
                                                ) : (
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <div className="field-error show">{errors.password}</div>}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" className={`btn-submit confirm-theme-btn ${processing ? 'loading' : ''}`} style={{ marginTop: 24 }} disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Konfirmasi</span>
                                </button>
                            </form>

                            {/* Back to welcome */}
                            <div className="register-row">
                                <Link href="/">Kembali ke Beranda</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
