import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { ParticipantItem } from './DetailDrawer';

interface RegisterExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    participants: ParticipantItem[];
    selectedIds: string[];
    exams: string[];
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function RegisterExamModal({
    isOpen,
    onClose,
    participants,
    selectedIds,
    exams,
    showToast,
}: RegisterExamModalProps) {
    const isBulk = selectedIds.length > 0;
    
    // Get target names
    const targetNames = isBulk
        ? `${selectedIds.length} peserta terpilih`
        : participants.length === 1
        ? participants[0].name
        : 'Peserta';

    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'register',
        ids: [] as string[],
        ujian: '',
        attempts_limit: 3,
    });

    useEffect(() => {
        if (isOpen) {
            setData((prev) => ({
                ...prev,
                ids: isBulk ? selectedIds : participants.map((p) => p.id),
                ujian: '',
                attempts_limit: 3,
            }));
        } else {
            reset();
        }
    }, [isOpen, selectedIds, participants]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.ujian) {
            showToast('Silakan pilih ujian.', 'error');
            return;
        }

        post(route('peserta.bulk'), {
            onSuccess: () => {
                showToast(`Peserta berhasil didaftarkan ke ujian: ${data.ujian}`, 'success');
                onClose();
            },
            onError: () => {
                showToast('Gagal mendaftarkan peserta ke ujian.', 'error');
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay open" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-head">
                        <div>
                            <h3 className="modal-title">📋 Daftarkan ke Ujian</h3>
                            <p className="modal-sub">Daftarkan {targetNames} ke dalam kelas ujian.</p>
                        </div>
                        <button type="button" className="modal-close" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Target info */}
                        <div style={{ fontSize: '13px', color: 'var(--ink-2)', background: 'var(--bg)', padding: '10px 12px', borderRadius: '6px' }}>
                            Mendaftarkan: <strong>{targetNames}</strong>
                        </div>

                        {/* Ujian selection */}
                        <div className="form-field">
                            <label className="form-label">
                                Pilih Ujian <span className="req">*</span>
                            </label>
                            <select
                                className="form-select"
                                value={data.ujian}
                                onChange={(e) => setData('ujian', e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Ujian --</option>
                                {exams.map((exam, idx) => (
                                    <option key={idx} value={exam}>
                                        {exam}
                                    </option>
                                ))}
                                {!exams.includes('SKD CPNS 2025 — Paket A') && (
                                    <option value="SKD CPNS 2025 — Paket A">SKD CPNS 2025 — Paket A</option>
                                )}
                                {!exams.includes('TKD PPPK Guru Batch 2') && (
                                    <option value="TKD PPPK Guru Batch 2">TKD PPPK Guru Batch 2</option>
                                )}
                                {!exams.includes('Ujian Kompetensi Teknis IT') && (
                                    <option value="Ujian Kompetensi Teknis IT">Ujian Kompetensi Teknis IT</option>
                                )}
                            </select>
                            {errors.ujian && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.ujian}</span>}
                        </div>

                        {/* Attempts limit */}
                        <div className="form-field">
                            <label className="form-label">
                                Batas Jumlah Percobaan (Attempts Limit) <span className="req">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className="form-input"
                                value={data.attempts_limit}
                                onChange={(e) => setData('attempts_limit', parseInt(e.target.value) || 3)}
                                required
                            />
                            <span className="form-hint">Maksimal percobaan yang diizinkan untuk paket ujian ini (default: 3).</span>
                            {errors.attempts_limit && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.attempts_limit}</span>}
                        </div>
                    </div>

                    <div className="modal-foot">
                        <button
                            type="button"
                            className="btn-modal cancel"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn-modal confirm"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner"></span>
                                    Memproses...
                                </>
                            ) : (
                                'Konfirmasi Pendaftaran'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
