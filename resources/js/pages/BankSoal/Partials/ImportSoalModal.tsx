import { createPortal } from 'react-dom';

interface ImportSoalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportSoalModal({
    isOpen,
    onClose
}: ImportSoalModalProps) {
    if (!isOpen) return null;

    const handleImportClick = () => {
        alert('Fitur import akan memproses file Excel / Aiken TXT. Pada backend sesungguhnya, controller akan menerima Request file dan memvalidasinya.');
        onClose();
    };

    return createPortal(
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-2)' }}>
                    <h3 className="modal-title" style={{ margin: 0 }}>Import Soal Massal</h3>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body" style={{ padding: '20px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <span style={{ fontSize: '11.5px', color: 'var(--ink-4)' }}>FORMAT YANG DIDUKUNG</span>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                                <div style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)' }}>
                                    <strong style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>Excel (.xlsx)</strong>
                                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>Gunakan template tabel standar dengan kolom opsi A-E.</div>
                                </div>
                                <div style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)' }}>
                                    <strong style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>Aiken Format (.txt)</strong>
                                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>Format baris teks sederhana yang populer di Moodle.</div>
                                </div>
                            </div>
                        </div>

                        <div className="upload-zone" onClick={handleImportClick}>
                            <div className="upload-icon">📥</div>
                            <div className="upload-label">Pilih file Excel atau Aiken TXT</div>
                            <div className="upload-sub">atau seret dan lepas file di sini</div>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--indigo-s)', padding: '10px 14px', borderRadius: 'var(--r-sm)' }}>
                            <span>ℹ️</span>
                            <span>
                                Belum punya template?{' '}
                                <a href="#" style={{ color: 'var(--indigo)', fontWeight: 600, textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); alert('Mengunduh template_import_soal.xlsx'); }}>
                                    Unduh Template Excel
                                </a>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-foot" style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn-modal cancel" onClick={onClose} style={{ flex: 'none', width: 'auto' }}>
                        Batal
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
