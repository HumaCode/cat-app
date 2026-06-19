interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    sections: Array<{ questions: Array<{ id: string }> }>;
    answersState: Record<string, string | null>;
    flaggedState: Record<string, boolean>;
}

export default function SubmitModal({
    isOpen,
    onClose,
    onSubmit,
    sections,
    answersState,
    flaggedState,
}: SubmitModalProps) {
    let totalQuestions = 0;
    let answeredCount = 0;
    let flaggedCount = 0;

    sections.forEach((sec) => {
        totalQuestions += sec.questions.length;
        sec.questions.forEach((q) => {
            if (answersState[q.id] !== undefined && answersState[q.id] !== null) {
                answeredCount++;
            }
            if (flaggedState[q.id]) {
                flaggedCount++;
            }
        });
    });

    const emptyCount = totalQuestions - answeredCount;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-box">
                <div className="modal-icon rose">🚨</div>
                <div className="modal-title">
                    Yakin ingin<br /><em>mengumpulkan jawaban?</em>
                </div>
                <div className="modal-desc">
                    {emptyCount > 0
                        ? `Kamu masih memiliki ${emptyCount} soal yang belum dijawab. Pastikan kamu telah memeriksa semua jawaban sebelum mengumpulkan.`
                        : 'Kamu telah menjawab semua soal. Pastikan kamu telah memeriksa kembali semua jawaban sebelum mengumpulkan.'}
                </div>
                <div className="modal-stats">
                    <div className="modal-stat">
                        <div className="modal-stat-num green">{answeredCount}</div>
                        <div className="modal-stat-lbl">Dijawab</div>
                    </div>
                    <div className="modal-stat">
                        <div className="modal-stat-num amber">{flaggedCount}</div>
                        <div className="modal-stat-lbl">Ditandai</div>
                    </div>
                    <div className="modal-stat">
                        <div className="modal-stat-num gray">{emptyCount}</div>
                        <div className="modal-stat-lbl">Kosong</div>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="modal-btn-primary" onClick={onSubmit}>
                        Ya, Kumpulkan Sekarang
                    </button>
                    <button className="modal-btn-secondary" onClick={onClose}>
                        Kembali & Periksa Lagi
                    </button>
                </div>
            </div>
        </div>
    );
}
