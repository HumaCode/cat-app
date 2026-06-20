import React from 'react';

interface FullscreenOverlayProps {
    show: boolean;
    onRestore: () => void;
}

export default function FullscreenOverlay({ show, onRestore }: FullscreenOverlayProps) {
    if (!show) return null;

    return (
        <div className="fullscreen-overlay">
            <div className="fullscreen-box">
                <div className="fullscreen-icon">
                    <span>🖥️</span>
                </div>
                <div className="fullscreen-title">Ujian Ditangguhkan!</div>
                <p className="fullscreen-desc">
                    Kamu terdeteksi keluar dari mode layar penuh (fullscreen). Demi menjaga integritas dan keamanan ujian, kamu harus berada dalam mode layar penuh selama pengerjaan.
                </p>
                <button className="btn-fullscreen-restore" onClick={onRestore}>
                    🖥️ Masuk Mode Layar Penuh
                </button>
            </div>
        </div>
    );
}
