interface Category {
    id: string;
    name: string;
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

interface QuestionGridProps {
    questions: Question[];
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

export default function QuestionGrid({
    questions,
    onPreview,
    onEdit,
    onDelete
}: QuestionGridProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    };

    if (questions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', color: 'var(--ink-4)' }}>
                Tidak ada data soal ditemukan.
            </div>
        );
    }

    return (
        <div className="soal-grid" id="viewGrid">
            {questions.map(q => (
                <div key={q.id} className="soal-card">
                    <div className="soal-card-top">
                        <div className="soal-card-badges">
                            <span className={`type-badge ${TYPE_CLASSES[q.type] || 't-pg'}`}>
                                {TYPE_MAP[q.type] || q.type}
                            </span>
                            <span className={`diff-badge ${DIFF_CLASSES[q.difficulty] || 'd-sedang'}`}>
                                {q.difficulty}
                            </span>
                            {!q.is_active && (
                                <span className="diff-badge" style={{ background: 'var(--amber-s)', color: 'var(--amber)' }}>
                                    Draft
                                </span>
                            )}
                        </div>
                        <div className="soal-card-menu">
                            <button
                                type="button"
                                className="row-btn"
                                onClick={() => onPreview(q)}
                                title="Preview"
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
                                onClick={() => onEdit(q)}
                                title="Edit"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="row-btn d"
                                onClick={() => onDelete(q.id)}
                                title="Hapus"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="soal-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} title={stripHtml(q.question_text)}>
                        {q.image_url && (
                            <div style={{ width: '100%', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-2)', background: 'var(--surface-2)', flexShrink: 0 }}>
                                <img src={q.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px', lineHeight: '1.5', color: 'var(--ink)' }}>
                            {stripHtml(q.question_text)}
                        </div>
                    </div>
                    
                    <div className="soal-card-foot">
                        <div className="soal-card-meta">
                            <span>🎯 {q.points} poin</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>
                            {formatDate(q.created_at)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
