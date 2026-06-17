import { ParticipantItem } from './DetailDrawer';

interface ParticipantTableProps {
    participants: ParticipantItem[];
    selectedIds: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: string, checked: boolean) => void;
    onViewDetail: (participant: ParticipantItem) => void;
    onEdit: (participant: ParticipantItem) => void;
    onDelete: (participant: ParticipantItem) => void;
    onRegisterExam: (participant: ParticipantItem) => void;
}

// Helper to generate consistent gradients based on string
const getAvatarGradient = (str: string) => {
    const gradients = [
        'linear-gradient(135deg, #4f46e5, #0d9488)',
        'linear-gradient(135deg, #7c3aed, #0284c7)',
        'linear-gradient(135deg, #059669, #0d9488)',
        'linear-gradient(135deg, #db2777, #7c3aed)',
        'linear-gradient(135deg, #ea580c, #db2777)',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

export default function ParticipantTable({
    participants,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onViewDetail,
    onEdit,
    onDelete,
    onRegisterExam,
}: ParticipantTableProps) {
    const allSelected = participants.length > 0 && participants.every((p) => selectedIds.includes(p.id));

    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th className="cb-col">
                            <input
                                type="checkbox"
                                className="cb"
                                checked={allSelected}
                                onChange={(e) => onSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>Nama & Email</th>
                        <th>NIP / NIK</th>
                        <th>Instansi & Jabatan</th>
                        <th>Ujian Terdaftar</th>
                        <th className="c">Nilai Terakhir</th>
                        <th>Percobaan</th>
                        <th>Status</th>
                        <th>Bergabung</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {participants.length > 0 ? (
                        participants.map((p) => {
                            const initials = p.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase();

                            const joinDate = new Date(p.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            });

                            const examData = p.exam_data || {};
                            const attempts = examData.attempts || [false, false, false];

                            return (
                                <tr key={p.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="cb"
                                            checked={selectedIds.includes(p.id)}
                                            onChange={(e) => onSelectOne(p.id, e.target.checked)}
                                        />
                                    </td>
                                    <td>
                                        <div className="p-cell">
                                            <div
                                                className="p-ava"
                                                style={{ background: getAvatarGradient(p.name) }}
                                            >
                                                {initials}
                                            </div>
                                            <div className="p-info">
                                                <div className="p-name" title={p.name}>
                                                    {p.name}
                                                </div>
                                                <div className="p-email">{p.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{p.nip_nik || '-'}</td>
                                    <td>
                                        <div className="p-info">
                                            <div className="p-name" style={{ fontSize: '13px', fontWeight: 500 }}>
                                                {p.instansi || '-'}
                                            </div>
                                            <div className="p-email" style={{ fontSize: '11px' }}>
                                                {p.jabatan || '-'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {examData.ujian ? (
                                            <div className="p-info">
                                                <div
                                                    className="p-name"
                                                    style={{ fontSize: '12.5px', fontWeight: 500, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    title={examData.ujian}
                                                >
                                                    {examData.ujian}
                                                </div>
                                                <div className="p-email" style={{ fontSize: '11px', color: 'var(--indigo)' }}>
                                                    {examData.ujian_count || 1} Ujian
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>-</span>
                                        )}
                                    </td>
                                    <td className="c">
                                        {examData.nilai !== undefined && examData.nilai !== null ? (
                                            <span
                                                className={`score-pill ${
                                                    examData.nilai >= 80 ? 'sc-hi' : examData.nilai >= 60 ? 'sc-md' : 'sc-lo'
                                                }`}
                                            >
                                                {examData.nilai.toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="score-pill sc-none">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="attempt-bar">
                                            <div className="attempt-dots">
                                                {attempts.map((used, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`attempt-dot ${used ? 'used' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`sbadge s-${p.status}`}>
                                            {p.status === 'aktif'
                                                ? 'Aktif'
                                                : p.status === 'nonaktif'
                                                ? 'Nonaktif'
                                                : 'Pending'}
                                        </span>
                                    </td>
                                    <td>{joinDate}</td>
                                    <td>
                                        <div className="row-acts">
                                            <button
                                                type="button"
                                                className="row-btn row-btn-view"
                                                title="Detail Profil"
                                                onClick={() => onViewDetail(p)}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn row-btn-edit"
                                                title="Edit Peserta"
                                                onClick={() => onEdit(p)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn row-btn-key"
                                                title="Daftarkan ke Ujian / Reset Token"
                                                onClick={() => onRegisterExam(p)}
                                            >
                                                <i className="bi bi-key"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn row-btn-delete"
                                                title="Hapus Peserta"
                                                onClick={() => onDelete(p)}
                                            >
                                                <i className="bi bi-dash-circle"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={10} style={{ textAlign: 'center', height: '100px', color: 'var(--ink-4)' }}>
                                Tidak ada data peserta yang ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
