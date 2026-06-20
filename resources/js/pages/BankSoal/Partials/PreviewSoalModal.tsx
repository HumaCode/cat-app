import { createPortal } from 'react-dom';

interface Category {
    id: string;
    name: string;
    parent?: {
        name: string;
    };
}

interface QuestionOption {
    id: string;
    option_text: string;
    is_correct: boolean;
    order_column: number;
    pair_text?: string;
    image_url?: string;
}

interface Question {
    id: string;
    question_text: string;
    type: string;
    difficulty: string;
    points: number;
    is_active: boolean;
    category?: Category;
    options?: QuestionOption[];
    explanation?: string;
    image_url?: string;
}

interface PreviewSoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: Question | null;
}

const TYPE_MAP: Record<string, string> = {
    pg: 'Pilihan Ganda',
    pgk: 'Pilihan Ganda Kompleks',
    essay: 'Essay',
    tf: 'Benar / Salah',
    isian: 'Isian Singkat',
    jodoh: 'Menjodohkan',
    urutan: 'Urutan',
};

const OPT_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function PreviewSoalModal({
    isOpen,
    onClose,
    question
}: PreviewSoalModalProps) {
    if (!isOpen || !question) return null;

    const getCategoryPath = (cat?: Category) => {
        if (!cat) return '-';
        if (cat.parent) {
            return `${cat.parent.name} → ${cat.name}`;
        }
        return cat.name;
    };

    const renderOptions = () => {
        const { type, options } = question;

        if (type === 'pg' || type === 'pgk') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(options || []).map((o, i) => {
                        const isCorrect = o.is_correct;
                        const label = OPT_LABELS[i] || String.fromCharCode(65 + i);
                        return (
                            <div
                                key={o.id || i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--r-sm)',
                                    border: `1.5px solid ${isCorrect ? 'var(--emerald)' : 'var(--border)'}`,
                                    background: isCorrect ? 'var(--emerald-s)' : 'var(--surface)'
                                }}
                            >
                                <span
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        border: `1.5px solid ${isCorrect ? 'var(--emerald)' : 'var(--border)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: isCorrect ? 'var(--emerald)' : 'var(--ink-3)',
                                        flexShrink: 0
                                    }}
                                >
                                    {label}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                    <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                                        {o.option_text}
                                    </span>
                                    {o.image_url && (
                                        <div style={{ marginTop: '4px', borderRadius: 'var(--r-xs)', overflow: 'hidden', border: '1px solid var(--border-2)', display: 'inline-flex' }}>
                                            <img 
                                                src={o.image_url} 
                                                alt={`Opsi ${label}`} 
                                                style={{ maxHeight: '100px', maxWidth: '200px', objectFit: 'contain' }} 
                                            />
                                        </div>
                                    )}
                                </div>
                                {isCorrect && <span style={{ fontSize: '18px', color: 'var(--emerald)' }}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (type === 'tf') {
            const correctOption = (options || []).find(o => o.is_correct);
            const isCorrectTrue = correctOption ? correctOption.option_text === 'Benar' : false;

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: 'var(--r-sm)',
                            border: `1.5px solid ${isCorrectTrue ? 'var(--emerald)' : 'var(--border)'}`,
                            background: isCorrectTrue ? 'var(--emerald-s)' : 'var(--surface)'
                        }}
                    >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: isCorrectTrue ? 'var(--emerald)' : 'var(--ink-3)' }}>
                            Benar ✓
                        </span>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: 'var(--r-sm)',
                            border: `1.5px solid ${!isCorrectTrue ? 'var(--emerald)' : 'var(--border)'}`,
                            background: !isCorrectTrue ? 'var(--emerald-s)' : 'var(--surface)'
                        }}
                    >
                        <span style={{ fontSize: '13px', fontWeight: 600, color: !isCorrectTrue ? 'var(--emerald)' : 'var(--ink-3)' }}>
                            Salah ✗
                        </span>
                    </div>
                </div>
            );
        }

        if (type === 'essay') {
            return (
                <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r-sm)', padding: '16px', background: 'var(--bg)', color: 'var(--ink-4)', fontSize: '13px', fontStyle: 'italic' }}>
                    Peserta akan menulis jawaban essay di sini. Penilaian dilakukan secara manual oleh penguji/pengawas.
                </div>
            );
        }

        if (type === 'isian') {
            const keys = (options || []).map(o => o.option_text).join(', ');
            return (
                <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px', background: 'var(--surface)', fontSize: '13px' }}>
                    <strong>Kunci Jawaban yang Diterima:</strong>
                    <div style={{ marginTop: '6px', color: 'var(--indigo)', fontWeight: 600 }}>
                        {keys || '-'}
                    </div>
                </div>
            );
        }

        if (type === 'jodoh') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(options || []).map((o, i) => (
                        <div
                            key={o.id || i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '8px 14px',
                                borderRadius: 'var(--r-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)'
                            }}
                        >
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', width: '18px' }}>
                                {i + 1}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--ink)', flex: 1 }}>
                                {o.option_text}
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--ink-4)' }}>↔</span>
                            <span style={{ fontSize: '13px', color: 'var(--indigo)', fontWeight: 600, flex: 1 }}>
                                {o.pair_text}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        if (type === 'urutan') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(options || []).map((o, i) => (
                        <div
                            key={o.id || i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 14px',
                                borderRadius: 'var(--r-sm)',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)'
                            }}
                        >
                            <span style={{ fontSize: '14px', color: 'var(--ink-5)' }}>⠿</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, background: 'var(--bg-2)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: '4px' }}>
                                {i + 1}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                                {o.option_text}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    return createPortal(
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '640px', maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-2)', flexShrink: 0 }}>
                    <div>
                        <h3 className="modal-title" style={{ margin: 0 }}>
                            Preview Soal — {TYPE_MAP[question.type] || question.type}
                        </h3>
                        <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>
                            {getCategoryPath(question.category)} &middot; {question.difficulty} &middot; {question.points} Poin
                        </div>
                    </div>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body" style={{ padding: '20px 0', overflowY: 'auto', flex: 1 }}>
                    <div 
                        style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: '1.6', marginBottom: '16px' }}
                        dangerouslySetInnerHTML={{ __html: question.question_text }}
                    />

                    {question.image_url && (
                        <div style={{ marginBottom: '16px', borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img 
                                src={question.image_url} 
                                alt="Pendukung Soal" 
                                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
                            />
                        </div>
                    )}

                    {renderOptions()}

                    {question.explanation && (
                        <div style={{ marginTop: '20px', padding: '14px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-2)', marginBottom: '4px' }}>
                                💡 Pembahasan / Penjelasan:
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--ink-3)', lineHeight: '1.5' }}>
                                {question.explanation}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-foot" style={{ padding: '14px 0 0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0, borderTop: '1px solid var(--border-2)' }}>
                    <button type="button" className="btn-modal cancel" onClick={onClose} style={{ flex: 'none', width: 'auto' }}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
