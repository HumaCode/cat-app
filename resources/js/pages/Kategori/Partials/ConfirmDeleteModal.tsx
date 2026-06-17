import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel, isLoading = false }: Props) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted || !isOpen) return null;

    return createPortal(
        <div className="modal-overlay open" onClick={e => { if (!isLoading && e.target === e.currentTarget) onCancel(); }}>
            <div className="modal-card">
                <div className="modal-icon-wrap" style={{
                    background: 'var(--rose-s)', color: 'var(--rose)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                }}>
                    <i className="bi bi-trash3-fill" />
                </div>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-desc">{message}</p>
                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn-modal cancel"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="btn-modal confirm"
                        onClick={onConfirm}
                        disabled={isLoading}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" style={{ width: 14, height: 14 }} />
                                Sedang Proses...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash3" />
                                Ya, Hapus
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
