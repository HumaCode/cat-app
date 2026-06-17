import React from 'react';

export interface ParticipantItem {
    id: string;
    name: string;
    email: string;
    nip_nik: string | null;
    telepon: string | null;
    instansi: string | null;
    jabatan: string | null;
    status: 'aktif' | 'nonaktif' | 'pending';
    created_at: string;
    exam_data?: {
        ujian?: string | null;
        ujian_count?: number;
        nilai?: number | null;
        attempts?: boolean[];
        riwayat?: Array<{
            nama: string;
            tgl: string;
            nilai: number;
            lulus: boolean;
        }>;
    };
}

interface DetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    participant: ParticipantItem | null;
}

export default function DetailDrawer({ isOpen, onClose, participant }: DetailDrawerProps) {
    if (!participant) return null;

    // Get initials for avatar
    const initials = participant.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Format join date
    const joinDate = new Date(participant.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const examData = participant.exam_data || {};
    const riwayat = examData.riwayat || [];
    const attempts = examData.attempts || [false, false, false];

    // Access token is generated from user ID in uppercase
    const mockToken = participant.id ? `CAT-${participant.id.slice(0, 6).toUpperCase()}` : 'CAT-NONE';

    const handleCopyToken = () => {
        navigator.clipboard.writeText(mockToken);
        alert('Token copied to clipboard: ' + mockToken);
    };

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
                <div className="drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="drawer-head">
                        <h3 className="drawer-title">Profil Detail Peserta</h3>
                        <button type="button" className="drawer-close" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="drawer-body">
                        {/* Profile Card */}
                        <div className="d-profile">
                            <div className="d-ava" style={{ '--g': 'linear-gradient(135deg, var(--indigo), var(--teal))' } as any}>
                                {initials}
                            </div>
                            <div className="d-info">
                                <h4 className="d-info-name">{participant.name}</h4>
                                <p className="d-info-email">{participant.email}</p>
                                <div className="d-info-meta">
                                    <span className="d-tag">Peserta</span>
                                    <span className={`sbadge s-${participant.status}`}>
                                        {participant.status === 'aktif' ? 'Aktif' : participant.status === 'nonaktif' ? 'Nonaktif' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Data */}
                        <div className="d-section">
                            <h5 className="d-section-title">Data Personal</h5>
                            <div className="d-row">
                                <span className="d-row-label">NIP / NIK</span>
                                <span className="d-row-val">{participant.nip_nik || '-'}</span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">No. HP / WhatsApp</span>
                                <span className="d-row-val">{participant.telepon || '-'}</span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">Instansi / OPD</span>
                                <span className="d-row-val">{participant.instansi || '-'}</span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">Golongan / Jabatan</span>
                                <span className="d-row-val">{participant.jabatan || '-'}</span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">Tanggal Bergabung</span>
                                <span className="d-row-val">{joinDate}</span>
                            </div>
                        </div>

                        {/* Exam Status */}
                        <div className="d-section">
                            <h5 className="d-section-title">Status Ujian Aktif</h5>
                            <div className="d-row">
                                <span className="d-row-label">Ujian Terdaftar</span>
                                <span className="d-row-val" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {examData.ujian || 'Tidak ada ujian aktif'}
                                </span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">Nilai Terakhir</span>
                                <span className="d-row-val">
                                    {examData.nilai !== undefined && examData.nilai !== null ? (
                                        <span className={`score-pill ${examData.nilai >= 80 ? 'sc-hi' : examData.nilai >= 60 ? 'sc-md' : 'sc-lo'}`}>
                                            {examData.nilai.toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="score-pill sc-none">-</span>
                                    )}
                                </span>
                            </div>
                            <div className="d-row">
                                <span className="d-row-label">Batas Percobaan</span>
                                <span className="d-row-val">
                                    <div className="attempt-bar">
                                        <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                                            {attempts.filter(Boolean).length} / {attempts.length}
                                        </span>
                                        <div className="attempt-dots">
                                            {attempts.map((used, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`attempt-dot ${used ? 'used' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </span>
                            </div>
                        </div>

                        {/* Access Token */}
                        {examData.ujian && (
                            <div className="d-section">
                                <h5 className="d-section-title">Kode Akses Ujian</h5>
                                <div className="token-box">
                                    <span className="token-val">{mockToken}</span>
                                    <button type="button" className="token-copy" onClick={handleCopyToken}>
                                        <i className="bi bi-copy" style={{ marginRight: '5px' }}></i> Salin
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Exam History */}
                        <div className="d-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h5 className="d-section-title" style={{ marginBottom: 0 }}>Riwayat Ujian</h5>
                                {riwayat.length > 0 && (
                                    <div className="mini-chart">
                                        {riwayat.map((r, idx) => (
                                            <div
                                                key={idx}
                                                className={`mini-bar ${r.nilai >= 80 ? 'hi' : r.nilai >= 60 ? 'md' : 'lo'}`}
                                                style={{ height: `${(r.nilai / 100) * 36}px` }}
                                                title={`${r.nama}: ${r.nilai}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {riwayat.length > 0 ? (
                                riwayat.map((r, idx) => (
                                    <div key={idx} className="history-item">
                                        <div
                                            className="hi-icon"
                                            style={{
                                                background: r.lulus ? 'var(--emerald-s)' : 'var(--rose-s)',
                                                color: r.lulus ? 'var(--emerald)' : 'var(--rose)',
                                            }}
                                        >
                                            {r.lulus ? '✓' : '✕'}
                                        </div>
                                        <div className="hi-body">
                                            <div className="hi-title">{r.nama}</div>
                                            <div className="hi-meta">{r.tgl}</div>
                                        </div>
                                        <div className="hi-score">
                                            <div className="hi-score-num" style={{ color: r.lulus ? 'var(--emerald)' : 'var(--rose)' }}>
                                                {r.nilai.toFixed(1)}
                                            </div>
                                            <div className="hi-score-lbl">{r.lulus ? 'Lulus' : 'Gagal'}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '13px', color: 'var(--ink-4)', textAlign: 'center', padding: '10px' }}>
                                    Belum ada riwayat ujian.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
