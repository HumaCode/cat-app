import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    exams: string[];
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function ImportModal({ isOpen, onClose, exams, showToast }: ImportModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        file: null as File | null,
        ujian: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
        setFileName(file ? file.name : null);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file) {
            showToast('Silakan pilih file Excel terlebih dahulu.', 'error');
            return;
        }

        if (!data.ujian) {
            showToast('Silakan pilih ujian terlebih dahulu.', 'error');
            return;
        }

        post(route('peserta.import'), {
            onSuccess: () => {
                showToast('Import peserta berhasil diproses.', 'success');
                reset();
                setFileName(null);
                onClose();
            },
            onError: () => {
                showToast('Gagal mengimpor file. Periksa format file Anda.', 'error');
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay open" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-head">
                        <div>
                            <h3 className="modal-title">📥 Import Peserta via Excel</h3>
                            <p className="modal-sub">Daftarkan peserta secara massal menggunakan file Excel.</p>
                        </div>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => {
                                reset();
                                setFileName(null);
                                onClose();
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Download Template */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: '12px 14px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>
                                Belum memiliki template import?
                            </div>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Template download is simulated.');
                                }}
                                style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                📥 Download Template
                            </a>
                        </div>

                        {/* Ujian selection */}
                        <div className="form-field">
                            <label className="form-label">
                                Daftarkan ke Ujian <span className="req">*</span>
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

                        {/* Upload Zone */}
                        <div className="form-field">
                            <label className="form-label">Upload File Excel (.xlsx, .xls)</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                            />
                            <div className="upload-zone" onClick={triggerFileSelect}>
                                <div className="upload-icon">📊</div>
                                <div className="upload-label">
                                    {fileName ? fileName : 'Pilih atau drop file template Anda di sini'}
                                </div>
                                <div className="upload-sub">Format file .xlsx atau .xls (Maks. 5 MB)</div>
                            </div>
                            {errors.file && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.file}</span>}
                        </div>
                    </div>

                    <div className="modal-foot">
                        <button
                            type="button"
                            className="btn-modal cancel"
                            onClick={() => {
                                reset();
                                setFileName(null);
                                onClose();
                            }}
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
                                    Mengimpor...
                                </>
                            ) : (
                                'Mulai Import'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
