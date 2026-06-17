interface BulkStatusBarProps {
    selectedIds: string[];
    onClearSelection: () => void;
    onBulkUpdateStatus: (status: boolean) => void;
    onBulkDelete: () => void;
}

export default function BulkStatusBar({
    selectedIds,
    onClearSelection,
    onBulkUpdateStatus,
    onBulkDelete
}: BulkStatusBarProps) {
    if (selectedIds.length === 0) return null;

    return (
        <div className="bulk-bar anim-in">
            <div className="bulk-count">{selectedIds.length} soal dipilih</div>
            <div className="bulk-actions">
                <button
                    type="button"
                    className="bulk-btn light"
                    onClick={() => onBulkUpdateStatus(true)}
                >
                    🟢 Aktifkan
                </button>
                <button
                    type="button"
                    className="bulk-btn light"
                    onClick={() => onBulkUpdateStatus(false)}
                >
                    🟡 Draftkan
                </button>
                <button
                    type="button"
                    className="bulk-btn danger-b"
                    onClick={onBulkDelete}
                >
                    🗑️ Hapus Soal
                </button>
                <button
                    type="button"
                    className="bulk-btn white"
                    onClick={onClearSelection}
                >
                    ✕ Batal
                </button>
            </div>
        </div>
    );
}
