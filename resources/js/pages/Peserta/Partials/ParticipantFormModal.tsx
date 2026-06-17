import { useEffect, useState, FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { ParticipantItem } from './DetailDrawer';

interface ParticipantFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editParticipant?: ParticipantItem | null;
    exams: string[];
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function ParticipantFormModal({
    isOpen,
    onClose,
    editParticipant,
    exams,
    showToast,
}: ParticipantFormModalProps) {
    const isEdit = !!editParticipant;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        nip_nik: '',
        email: '',
        telepon: '',
        instansi: '',
        jabatan: '',
        ujian: '',
        status: 'aktif' as 'aktif' | 'nonaktif' | 'pending',
    });

    // Sync form state when modal opens or editing target changes
    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editParticipant) {
                setData({
                    name: editParticipant.name || '',
                    nip_nik: editParticipant.nip_nik || '',
                    email: editParticipant.email || '',
                    telepon: editParticipant.telepon || '',
                    instansi: editParticipant.instansi || '',
                    jabatan: editParticipant.jabatan || '',
                    ujian: editParticipant.exam_data?.ujian || '',
                    status: editParticipant.status || 'aktif',
                });
            } else {
                setData({
                    name: '',
                    nip_nik: '',
                    email: '',
                    telepon: '',
                    instansi: '',
                    jabatan: '',
                    ujian: '',
                    status: 'aktif',
                });
            }
        } else {
            reset();
        }
    }, [isOpen, editParticipant]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('peserta.update', { id: editParticipant!.id }), {
                onSuccess: () => {
                    showToast('Data peserta berhasil diperbarui.', 'success');
                    onClose();
                },
                onError: () => {
                    showToast('Gagal memperbarui data peserta. Periksa kembali inputan Anda.', 'error');
                },
            });
        } else {
            post(route('peserta.store'), {
                onSuccess: () => {
                    showToast('Peserta berhasil ditambahkan.', 'success');
                    onClose();
                },
                onError: () => {
                    showToast('Gagal menambahkan peserta. Periksa kembali inputan Anda.', 'error');
                },
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay open`} onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-head">
                        <div>
                            <h3 className="modal-title">
                                {isEdit ? 'Edit Data Peserta' : 'Tambah Peserta Baru'}
                            </h3>
                            <p className="modal-sub">
                                {isEdit
                                    ? 'Perbarui profil dan status peserta ujian.'
                                    : 'Daftarkan peserta baru untuk mengikuti ujian.'}
                            </p>
                        </div>
                        <button type="button" className="modal-close" onClick={onClose}>
                            ✕
                        </button>
                    </div>

                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Data Diri Section */}
                        <div className="form-section">Data Personal</div>

                        <div className="form-grid fg-2">
                            <div className="form-field">
                                <label className="form-label">
                                    Nama Lengkap <span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Rina Wijayanti, S.Pd"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.name}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-label">NIP / NIK</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="198702142010012014"
                                    value={data.nip_nik}
                                    onChange={(e) => setData('nip_nik', e.target.value)}
                                />
                                {errors.nip_nik && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.nip_nik}</span>}
                            </div>
                        </div>

                        <div className="form-grid fg-2">
                            <div className="form-field">
                                <label className="form-label">
                                    Alamat Email <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="peserta@domain.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.email}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-label">No. HP / WhatsApp</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="081234567890"
                                    value={data.telepon}
                                    onChange={(e) => setData('telepon', e.target.value)}
                                />
                                {errors.telepon && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.telepon}</span>}
                            </div>
                        </div>

                        <div className="form-grid fg-2">
                            <div className="form-field">
                                <label className="form-label">Instansi / OPD</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Dinas Pendidikan"
                                    value={data.instansi}
                                    onChange={(e) => setData('instansi', e.target.value)}
                                />
                                {errors.instansi && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.instansi}</span>}
                            </div>
                            <div className="form-field">
                                <label className="form-label">Golongan / Jabatan</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Guru Ahli Muda"
                                    value={data.jabatan}
                                    onChange={(e) => setData('jabatan', e.target.value)}
                                />
                                {errors.jabatan && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.jabatan}</span>}
                            </div>
                        </div>

                        {/* Status selection */}
                        <div className="form-field">
                            <label className="form-label">Status Peserta</label>
                            <select
                                className="form-select"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as any)}
                            >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                                <option value="pending">Pending (Perlu Validasi)</option>
                            </select>
                            {errors.status && <span className="form-hint" style={{ color: 'var(--rose)' }}>{errors.status}</span>}
                        </div>

                        {/* Ujian selection (Only when creating) */}
                        {!isEdit && (
                            <>
                                <div className="form-section">Daftarkan ke Ujian</div>
                                <div className="form-field">
                                    <label className="form-label">Pilih Ujian (Opsional)</label>
                                    <select
                                        className="form-select"
                                        value={data.ujian}
                                        onChange={(e) => setData('ujian', e.target.value)}
                                    >
                                        <option value="">-- Tidak Mendaftar Ujian --</option>
                                        {exams.map((exam, idx) => (
                                            <option key={idx} value={exam}>
                                                {exam}
                                            </option>
                                        ))}
                                        {/* Add standard fallback exams if none seeded */}
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
                            </>
                        )}

                        <div className="form-hint" style={{ background: 'var(--bg)', padding: '10px', borderRadius: '6px', fontSize: '11.5px' }}>
                            💡 Kata sandi default untuk akun baru adalah <strong>password</strong>. Kode akses ujian akan dibuat secara otomatis setelah peserta didaftarkan ke ujian.
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
                                    Sedang proses...
                                </>
                            ) : isEdit ? (
                                'Simpan Perubahan'
                            ) : (
                                'Daftarkan Peserta'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
