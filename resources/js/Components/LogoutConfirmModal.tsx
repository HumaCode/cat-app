import { useEffect } from 'react';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function LogoutConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: LogoutConfirmModalProps) {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="global-logout-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.3)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999,
                padding: '20px',
                animation: 'globalFadeIn 0.2s ease-out forwards',
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes globalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes globalSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .global-logout-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 32px 24px 28px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05);
                    text-align: center;
                    animation: globalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }
                .global-logout-icon-wrap {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: #fef2f2;
                    color: #ef4444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 24px;
                }
                .global-logout-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1f2937;
                    margin: 0 0 8px 0;
                    font-family: 'Poppins', 'Inter', sans-serif;
                }
                .global-logout-desc {
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.5;
                    margin: 0 0 24px 0;
                    font-family: 'Poppins', 'Inter', sans-serif;
                }
                .global-logout-desc strong {
                    color: #1f2937;
                }
                .global-logout-actions {
                    display: flex;
                    gap: 12px;
                }
                .global-logout-btn {
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex: 1;
                    font-family: 'Poppins', 'Inter', sans-serif;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .global-logout-btn.cancel {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #e5e7eb;
                }
                .global-logout-btn.cancel:hover {
                    background: #e5e7eb;
                }
                .global-logout-btn.confirm {
                    background: #4f46e5;
                    color: #ffffff;
                    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
                }
                .global-logout-btn.confirm:hover {
                    background: #4338ca;
                    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
                }
                .global-logout-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .global-logout-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: globalSpin 0.7s linear infinite;
                    display: inline-block;
                    margin-right: 8px;
                }
                @keyframes globalSpin {
                    to { transform: rotate(360deg); }
                }
            ` }} />
            <div 
                className="global-logout-card" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="global-logout-icon-wrap">
                    <span role="img" aria-label="warning">⚠️</span>
                </div>
                <h3 className="global-logout-title">Konfirmasi Keluar</h3>
                <p className="global-logout-desc">
                    Apakah Anda yakin ingin keluar dari <strong>CAT System</strong>? Sesi Anda akan berakhir dan Anda perlu login kembali.
                </p>
                <div className="global-logout-actions">
                    <button 
                        type="button"
                        className="global-logout-btn cancel" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </button>
                    <button 
                        type="button"
                        className="global-logout-btn confirm" 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="global-logout-spinner"></span>
                                Sedang keluar...
                            </>
                        ) : (
                            'Ya, Keluar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
