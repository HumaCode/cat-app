
interface TokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    participantName: string;
}

export default function TokenModal({ isOpen, onClose, token, participantName }: TokenModalProps) {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        alert('Token berhasil disalin ke clipboard!');
    };

    return (
        <div className="modal-overlay open" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                <div className="modal-head">
                    <div>
                        <h3 className="modal-title">🔑 Kode Akses Ujian</h3>
                        <p className="modal-sub">Berikan kode ini kepada peserta untuk dapat masuk ke sistem ujian.</p>
                    </div>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
                        Peserta: <strong>{participantName}</strong>
                    </div>
                    
                    <div className="token-box">
                        <span className="token-val">{token}</span>
                        <button type="button" className="token-copy" onClick={handleCopy}>
                            <i className="bi bi-copy" style={{ marginRight: '5px' }}></i> Salin
                        </button>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--ink-4)', background: 'var(--bg)', padding: '10px', borderRadius: '6px', lineHeight: '1.4' }}>
                        ⚠️ Kode akses bersifat rahasia. Pastikan kode hanya dikirimkan kepada peserta yang bersangkutan via Email atau WhatsApp.
                    </div>
                </div>
                <div className="modal-foot">
                    <button type="button" className="btn-modal confirm" onClick={onClose}>
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}
