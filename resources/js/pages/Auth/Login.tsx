import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import useLoginEffects from './useLoginEffects';
import '../../../css/login.css';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        login: '',
        password: '',
        remember: false as boolean,
    });

    const {
        pwdVisible,
        togglePwd,
        showSuccess,
        triggerSuccessOverlay,
        focusedFields,
        handleFocus,
        handleBlur,
    } = useLoginEffects();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('login'), {
            onSuccess: () => {
                triggerSuccessOverlay();
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel">
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
                                Ujian lebih cerdas<br />
                                dimulai dari<br />
                                <em>satu langkah ini.</em>
                            </h1>
                            <p className="left-desc">
                                Platform Computer Assisted Test modern untuk seleksi CPNS, PPPK,
                                ujian akademik, dan diklat institusi Anda.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">120+</div>
                                    <div className="left-stat-label">Institusi Aktif</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">500rb+</div>
                                    <div className="left-stat-label">Sesi Ujian</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">9</div>
                                    <div className="left-stat-label">Tipe Soal</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#34D399' }}></span> Anti-cheat
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#60A5FA' }}></span> Real-time
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#FBBF24' }}></span> Multi-institusi
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#F472B6' }}></span> Bank soal
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#A78BFA' }}></span> Proctoring
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">BK</div>
                            <div>
                                <div className="review-name">Budi Kurniawan</div>
                                <div className="review-role">Kepala BKPSDM Kota Pekalongan</div>
                                <div className="review-text">"Seleksi yang dulunya 3 hari kini selesai dalam 1 hari. Akurat dan transparan."</div>
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
                            <div className="form-hello">Selamat datang kembali</div>
                            <h2 className="form-title">Masuk ke<br /><em>akun Anda</em></h2>
                            <p className="form-subtitle">
                                Belum punya akun?{' '}
                                <Link href={route('register')}>Daftar sekarang →</Link>
                            </p>

                            {/* Google Sign In */}
                            <a href="#" className="btn-google" onClick={(e) => e.preventDefault()}>
                                <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Lanjutkan dengan Google
                            </a>

                            {/* Divider */}
                            <div className="divider">atau masuk dengan username / email</div>

                            {status && (
                                <div style={{ marginBottom: 20, padding: 12, backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 13, color: 'var(--green)' }}>
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} noValidate>
                                <div className="field-group">
                                    {/* Username or Email */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="login">Username / Email</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['login'] ? 'var(--accent)' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="login"
                                                name="login"
                                                className={errors.login ? 'error' : ''}
                                                placeholder="Masukkan username atau email Anda"
                                                autoComplete="username"
                                                value={data.login}
                                                onFocus={() => handleFocus('login')}
                                                onBlur={() => handleBlur('login')}
                                                onChange={(e) => {
                                                    setData('login', e.target.value);
                                                    if (errors.login) clearErrors('login');
                                                }}
                                            />
                                        </div>
                                        {errors.login && <div className="field-error show">{errors.login}</div>}
                                    </div>

                                    {/* Password */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="password">Password</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['password'] ? 'var(--accent)' : '' }}>
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
                                                autoComplete="current-password"
                                                value={data.password}
                                                onFocus={() => handleFocus('password')}
                                                onBlur={() => handleBlur('password')}
                                                onChange={(e) => {
                                                    setData('password', e.target.value);
                                                    if (errors.password) clearErrors('password');
                                                }}
                                            />
                                            <button type="button" className="pwd-toggle" onClick={togglePwd} aria-label="Lihat password">
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

                                {/* Remember + Forgot */}
                                <div className="field-meta">
                                    <label className="checkbox-wrap">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="checkbox-label">Ingat saya</span>
                                    </label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="forgot-link">
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit */}
                                <button type="submit" className={`btn-submit ${processing ? 'loading' : ''}`} id="submitBtn" disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Masuk Sekarang</span>
                                </button>
                            </form>

                            {/* Register */}
                            <div className="register-row">
                                Belum memiliki akun?{' '}
                                <Link href={route('register')}>Daftar di sini</Link>
                            </div>

                            {/* Trust badges */}
                            <div className="trust-row">
                                <div className="trust-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    SSL Terenkripsi
                                </div>
                                <div className="trust-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Data Aman
                                </div>
                                <div className="trust-item">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                    Uptime 99.9%
                                </div>
                            </div>
                        </div>

                        {/* Success overlay */}
                        <div className={`success-overlay ${showSuccess ? 'show' : ''}`} id="successOverlay">
                            <div className="success-check">✓</div>
                            <div className="success-title">Berhasil masuk!</div>
                            <p className="success-sub">Mengalihkan ke dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
