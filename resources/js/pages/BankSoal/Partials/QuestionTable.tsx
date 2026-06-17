import { router } from '@inertiajs/react';

interface Category {
    id: string;
    name: string;
    parent?: {
        name: string;
    };
}

interface Question {
    id: string;
    question_text: string;
    type: string;
    difficulty: string;
    points: number;
    is_active: boolean;
    created_at: string;
    category?: Category;
    image_url?: string;
}

interface QuestionTableProps {
    questions: Question[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: (checked: boolean) => void;
    onPreview: (question: Question) => void;
    onEdit: (question: Question) => void;
    onDelete: (id: string) => void;
}

const TYPE_MAP: Record<string, string> = {
    pg: 'Pilihan Ganda',
    pgk: 'PG Kompleks',
    essay: 'Essay',
    tf: 'Benar / Salah',
    isian: 'Isian Singkat',
    jodoh: 'Menjodohkan',
    urutan: 'Urutan',
};

const TYPE_CLASSES: Record<string, string> = {
    pg: 't-pg',
    pgk: 't-pgk',
    essay: 't-essay',
    tf: 't-tf',
    isian: 't-isian',
    jodoh: 't-jodoh',
    urutan: 't-urutan',
};

const DIFF_CLASSES: Record<string, string> = {
    Mudah: 'd-mudah',
    Sedang: 'd-sedang',
    Sulit: 'd-sulit',
};

export default function QuestionTable({
    questions,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onPreview,
    onEdit,
    onDelete
}: QuestionTableProps) {
    const isAllSelected = questions.length > 0 && questions.every(q => selectedIds.includes(q.id));
    const isSomeSelected = questions.some(q => selectedIds.includes(q.id)) && !isAllSelected;

    const handleDuplicate = (question: Question) => {
        if (confirm('Duplikat soal ini?')) {
            // Simply submit a post request to store the duplicate
            router.post(route('bank-soal.store'), {
                category_id: question.category?.id,
                type: question.type,
                difficulty: question.difficulty,
                points: question.points,
                question_text: `${question.question_text} (Salinan)`,
                is_active: question.is_active,
                options: (question as any).options?.map((opt: any) => ({
                    option_text: opt.option_text,
                    is_correct: opt.is_correct,
                    order_column: opt.order_column,
                    pair_text: opt.pair_text
                }))
            });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getCategoryPath = (cat?: Category) => {
        if (!cat) return '-';
        if (cat.parent) {
            return `${cat.parent.name} → ${cat.name}`;
        }
        return cat.name;
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    };

    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th className="cb-col">
                            <input
                                type="checkbox"
                                className="cb"
                                checked={isAllSelected}
                                ref={el => {
                                    if (el) el.indeterminate = isSomeSelected;
                                }}
                                onChange={e => onToggleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>Soal</th>
                        <th>Tipe</th>
                        <th>Kesukaran</th>
                        <th className="c">Poin</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="soalBody">
                    {questions.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="c" style={{ padding: '24px', color: 'var(--ink-4)' }}>
                                Tidak ada data soal ditemukan.
                            </td>
                        </tr>
                    ) : (
                        questions.map(q => {
                            const isSelected = selectedIds.includes(q.id);
                            return (
                                <tr key={q.id} style={{ background: isSelected ? 'var(--indigo-s)' : '' }}>
                                    <td className="cb-col">
                                        <input
                                            type="checkbox"
                                            className="cb row-cb"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(q.id)}
                                        />
                                    </td>
                                    <td style={{ maxWidth: '340px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {q.image_url && (
                                                <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-2)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src={q.image_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="td-q" title={stripHtml(q.question_text)}>
                                                    {stripHtml(q.question_text)}
                                                </div>
                                                <div className="td-q-sub">{getCategoryPath(q.category)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`type-badge ${TYPE_CLASSES[q.type] || 't-pg'}`}>
                                            {TYPE_MAP[q.type] || q.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`diff-badge ${DIFF_CLASSES[q.difficulty] || 'd-sedang'}`}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td className="c" style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--ink)' }}>
                                        {q.points}
                                    </td>
                                    <td>
                                        {q.is_active ? (
                                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--teal)', background: 'var(--teal-s)', padding: '2px 8px', borderRadius: '100px' }}>
                                                Aktif
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--amber)', background: 'var(--amber-s)', padding: '2px 8px', borderRadius: '100px' }}>
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--ink-4)' }}>
                                        {formatDate(q.created_at)}
                                    </td>
                                    <td>
                                        <div className="row-acts">
                                            <button
                                                type="button"
                                                className="row-btn"
                                                title="Preview"
                                                onClick={() => onPreview(q)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn"
                                                title="Edit"
                                                onClick={() => onEdit(q)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn"
                                                title="Duplikat"
                                                onClick={() => handleDuplicate(q)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                                                    <path d="M2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="row-btn d"
                                                title="Hapus"
                                                onClick={() => onDelete(q.id)}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
