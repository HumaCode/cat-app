import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import '../../../css/login.css';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [pwdVisible, setPwdVisible] = useState(false);
    const [pwdConfirmVisible, setPwdConfirmVisible] = useState(false);
    const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});

    const handleFocus = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: string) => {
        setFocusedFields((prev) => ({ ...prev, [field]: false }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password — CAT System" />

            <div className="login-page-body">
                <div className="page-wrap">
                    {/* ═══ LEFT PANEL ═══ */}
                    <div className="left-panel reset-theme">
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
                                Perbarui kredensial<br />
                                untuk keamanan<br />
                                <em>akun Anda.</em>
                            </h1>
                            <p className="left-desc">
                                Buat password baru yang kuat dan unik untuk melindungi data ujian,
                                hasil laporan, serta informasi institusi Anda.
                            </p>
                            <div className="left-stats">
                                <div>
                                    <div className="left-stat-num">Enkripsi</div>
                                    <div className="left-stat-label">Bcrypt/Argon2</div>
                                </div>
                                <div>
                                    <div className="left-stat-num">Valid</div>
                                    <div className="left-stat-label">Token Resmi Teruji</div>
                                </div>
                            </div>
                            <div className="feature-pills">
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#8B5CF6' }}></span> Token Valid
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#8B5CF6' }}></span> Enkripsi Kuat
                                </div>
                                <div className="pill">
                                    <span className="pill-dot" style={{ backgroundColor: '#8B5CF6' }}></span> Akses Terlindungi
                                </div>
                            </div>
                        </div>

                        {/* Review card */}
                        <div className="review-card">
                            <div className="review-avatar">A</div>
                            <div>
                                <div className="review-name">Audit System</div>
                                <div className="review-role">CAT Security Protocol</div>
                                <div className="review-text">"Pastikan password baru Anda menggunakan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus."</div>
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
                            <div className="form-hello reset-theme-text">Pembaharuan Sandi</div>
                            <h2 className="form-title">Reset<br /><em>password</em></h2>
                            <p className="form-subtitle">
                                Masukkan email Anda dan password baru untuk memperbarui akun.
                            </p>

                            {/* Form */}
                            <form onSubmit={submit} noValidate>
                                <div className="field-group">
                                    {/* Email */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="email">Alamat Email</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['email'] ? '#8B5CF6' : '' }}>
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
                                        <label className="field-label" htmlFor="password">Password Baru</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['password'] ? '#8B5CF6' : '' }}>
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

                                    {/* Password Confirmation */}
                                    <div className="field">
                                        <label className="field-label" htmlFor="password_confirmation">Konfirmasi Password Baru</label>
                                        <div className="field-wrap">
                                            <div className="field-icon" style={{ color: focusedFields['password_confirmation'] ? '#8B5CF6' : '' }}>
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
                                            <button type="button" className="pwd-toggle" onClick={() => setPwdConfirmVisible(!pwdConfirmVisible)} aria-label="Lihat password">
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
                                <button type="submit" className={`btn-submit reset-theme-btn ${processing ? 'loading' : ''}`} style={{ marginTop: 24 }} disabled={processing}>
                                    <div className="spinner"></div>
                                    <span className="btn-text">Reset Password</span>
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
