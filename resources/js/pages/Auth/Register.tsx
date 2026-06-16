import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import useRegisterEffects from './useRegisterEffects';
import '../../../css/login.css';

export default function Register() {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const {
        pwdVisible,
        togglePwd,
        pwdConfirmVisible,
        togglePwdConfirm,
        focusedFields,
        handleFocus,
        handleBlur,
    } = useRegisterEffects();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar Akun Baru — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel register-theme">
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
                                Bergabung bersama kami,<br />
                                rasakan kemudahan<br />
                                <em>evaluasi digital.</em>
                            </h1>
                            <p className="left-desc">
                                Mulai sekarang secara gratis. Buat soal ujian Anda sendiri, atur
                                proctoring AI, dan lihat hasil laporan secara instan.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">5 Juta+</div>
                                    <div className="left-stat-label">Soal Terjawab</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">100%</div>
                                    <div className="left-stat-label">Akurat & Transparan</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Anti-cheat
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Real-time
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Multi-institusi
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#10B981' }}></span> Bank soal
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">HN</div>
                            <div>
                                <div className="review-name">Hendra Nasution</div>
                                <div className="review-role">Dosen Universitas Negeri Medan</div>
                                <div className="review-text">"Proses pendaftaran sangat cepat. Sistem bank soalnya sangat membantu kami mengacak ujian secara adil."</div>
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
                            <div className="form-hello register-theme-text">Mulai Sekarang</div>
                            <h2 className="form-title">Daftar<br /><em>akun baru</em></h2>
                            <p className="form-subtitle">
                                Sudah memiliki akun?{' '}
                                <Link href={route('login')}>Masuk di sini</Link>
                            </p>

                            {/* Google Sign In */}
                            <a href="#" className="btn-google" onClick={(e) => e.preventDefault()}>
                                <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Daftar dengan Google
                            </a>

                            {/* Divider */}
                            <div className="divider">atau daftar dengan email</div>

                            {/* Form */}
                            <form onSubmit={submit} noValidate>
                                <div className="field-group">
                                    {/* Name */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="name">Nama Lengkap</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['name'] ? '#10B981' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={errors.name ? 'error' : ''}
                                                placeholder="Nama Lengkap Anda"
                                                value={data.name}
                                                onFocus={() => handleFocus('name')}
                                                onBlur={() => handleBlur('name')}
                                                onChange={(e) => {
                                                    setData('name', e.target.value);
                                                    if (errors.name) clearErrors('name');
                                                }}
                                            />
                                        </div>
                                        {errors.name && <div className="field-error show">{errors.name}</div>}
                                    </div>

                                    {/* Username */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="username">Username</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['username'] ? '#10B981' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                className={errors.username ? 'error' : ''}
                                                placeholder="username_anda"
                                                value={data.username}
                                                onFocus={() => handleFocus('username')}
                                                onBlur={() => handleBlur('username')}
                                                onChange={(e) => {
                                                    setData('username', e.target.value);
                                                    if (errors.username) clearErrors('username');
                                                }}
                                            />
                                        </div>
                                        {errors.username && <div className="field-error show">{errors.username}</div>}
                                    </div>

                                    {/* Email */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="email">Email</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['email'] ? '#10B981' : '' }}>
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
                                                onFocus={() => handleFocus('email')}
                                                onBlur={() => handleBlur('email')}
                                                onChange={(e) => {
                                                    setData('email', e.target.value);
                                                    if (errors.email) clearErrors('email');
                                                }}
                                            />
                                        </div>
                                        {errors.email && <div className="field-error show">{errors.email}</div>}
                                    </div>

                                    {/* Password */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="password">Password</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['password'] ? '#10B981' : '' }}>
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

                                    {/* Confirm Password */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="password_confirmation">Konfirmasi Password</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['password_confirmation'] ? '#10B981' : '' }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                            <input
                                                type={pwdConfirmVisible ? 'text' : 'password'}
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                className={errors.password_confirmation ? 'error' : ''}
                                                placeholder="••••••••"
                                                value={data.password_confirmation}
                                                onFocus={() => handleFocus('password_confirmation')}
                                                onBlur={() => handleBlur('password_confirmation')}
                                                onChange={(e) => {
                                                    setData('password_confirmation', e.target.value);
                                                    if (errors.password_confirmation) clearErrors('password_confirmation');
                                                }}
                                            />
                                            <button type="button" className="pwd-toggle" onClick={togglePwdConfirm} aria-label="Lihat password">
                                                {pwdConfirmVisible ? (
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
                                        {errors.password_confirmation && <div className="field-error show">{errors.password_confirmation}</div>}
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" className={`btn-submit register-theme-btn ${processing ? 'loading' : ''}`} style={{ marginTop: 24 }} disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Daftar Akun</span>
                                </button>
                            </form>

                            {/* Back to login */}
                            <div className="register-row">
                                Sudah memiliki akun?{' '}
                                <Link href={route('login')}>Masuk di sini</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
