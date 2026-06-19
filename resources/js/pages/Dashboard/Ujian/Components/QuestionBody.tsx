import { useEffect, useState, useRef } from 'react';

interface QuestionBodyProps {
    question: {
        id: string;
        text: string;
        type?: string;
        difficulty: string;
        points: number;
        options: Array<{ id: string; text: string; pair_text?: string }>;
    } | null;
    globalIndex: number;
    totalQuestions: number;
    sectionTag: string;
    sectionLabel: string;
    currentAnswer: string | null;
    onSelectOption: (optionId: string) => void;
    isCurrentFlagged: boolean;
    onToggleFlag: () => void;
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    isLastQuestion: boolean;
    onSubmitClick: () => void;
}

function CustomMatchSelect({
    value,
    options,
    onChange,
    placeholder = "-- Pilih Pasangan --",
    openUpwards = false
}: {
    value: string;
    options: string[];
    onChange: (val: string) => void;
    placeholder?: string;
    openUpwards?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-xs)',
                    border: '1.5px solid var(--border)',
                    background: 'var(--surface)',
                    color: value ? 'var(--ink)' : 'var(--ink-4)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--indigo)';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.borderColor = 'var(--border)';
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {value || placeholder}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--ink-4)', marginLeft: '8px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    ▼
                </span>
            </div>

            {/* Options Dropdown List */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: openUpwards ? 'calc(100% + 4px)' : undefined,
                        top: openUpwards ? undefined : 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 999,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--r-sm)',
                        boxShadow: 'var(--shadow-lg)',
                        maxHeight: '160px',
                        overflowY: 'auto',
                        padding: '4px 0',
                    }}
                >
                    {/* Placeholder option */}
                    <div
                        onClick={() => {
                            onChange('');
                            setIsOpen(false);
                        }}
                        style={{
                            padding: '8px 14px',
                            fontSize: '13px',
                            color: 'var(--ink-4)',
                            cursor: 'pointer',
                            background: value === '' ? 'var(--surface-2)' : 'transparent',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={(e) => {
                            if (value !== '') e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        {placeholder}
                    </div>

                    {/* Options list */}
                    {options.map((opt, idx) => {
                        const isSelected = value === opt;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: '13px',
                                    color: isSelected ? 'var(--indigo)' : 'var(--ink)',
                                    fontWeight: isSelected ? 600 : 400,
                                    cursor: 'pointer',
                                    background: isSelected ? 'var(--indigo-s)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'var(--surface-2)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <span>{opt}</span>
                                {isSelected && <span style={{ fontSize: '11px' }}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function QuestionBody({
    question,
    globalIndex,
    totalQuestions,
    sectionTag,
    sectionLabel,
    currentAnswer,
    onSelectOption,
    isCurrentFlagged,
    onToggleFlag,
    onPrev,
    onNext,
    hasPrev,
    isLastQuestion,
    onSubmitClick,
}: QuestionBodyProps) {
    // Scroll question panel to top when question changes
    useEffect(() => {
        const panel = document.getElementById('questionPanel');
        if (panel) {
            panel.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [question?.id]);

    if (!question) {
        return (
            <div className="question-panel" id="questionPanel">
                <div className="question-body" style={{ padding: '40px', textAlign: 'center' }}>
                    <p className="question-text">Tidak ada soal tersedia di seksi ini.</p>
                </div>
            </div>
        );
    }

    const labels = ['A', 'B', 'C', 'D', 'E'];

    const renderQuestionInput = () => {
        const qType = question.type || 'pg';

        if (qType === 'essay') {
            return (
                <div style={{ padding: '0 20px 20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--ink-2)', fontSize: '14px' }}>
                        Jawaban Uraian / Essay:
                    </label>
                    <textarea
                        className="form-control"
                        rows={6}
                        placeholder="Tuliskan jawaban Anda di sini secara lengkap..."
                        value={currentAnswer || ''}
                        onChange={(e) => onSelectOption(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 'var(--r-sm)',
                            border: '1.5px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--ink)',
                            fontSize: '14.5px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                    />
                </div>
            );
        }

        if (qType === 'isian') {
            return (
                <div style={{ padding: '0 20px 20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--ink-2)', fontSize: '14px' }}>
                        Jawaban Isian Singkat:
                    </label>
                    <input
                        type="text"
                        placeholder="Tuliskan jawaban singkat Anda di sini..."
                        value={currentAnswer || ''}
                        onChange={(e) => onSelectOption(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 'var(--r-sm)',
                            border: '1.5px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--ink)',
                            fontSize: '14.5px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                    />
                </div>
            );
        }

        if (qType === 'jodoh') {
            const allPairs = question.options.map(o => o.pair_text).filter(Boolean);
            // Parse current matches: e.g. "opt_id_1:Mamalia,opt_id_2:Burung"
            const currentMatches = (currentAnswer || '').split(',').reduce((acc, pairStr) => {
                const [optId, val] = pairStr.split(':');
                if (optId) acc[optId] = val;
                return acc;
            }, {} as Record<string, string>);

            const handleSelectPair = (optId: string, val: string) => {
                const updated = { ...currentMatches, [optId]: val };
                const serialized = Object.entries(updated)
                    .map(([id, p]) => `${id}:${p}`)
                    .join(',');
                onSelectOption(serialized);
            };

            return (
                <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500, marginBottom: '4px' }}>
                        Jodohkanlah setiap pilihan di sebelah kiri dengan pasangan yang sesuai di sebelah kanan:
                    </div>
                    {question.options.map((opt, i) => {
                        const selectedVal = currentMatches[opt.id] || '';
                        // Open upwards if it's the last or second to last item to prevent cutoff
                        const openUpwards = i >= Math.max(1, question.options.length - 2);
                        return (
                            <div 
                                key={opt.id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px', 
                                    background: 'var(--surface-2)', 
                                    padding: '10px 14px', 
                                    borderRadius: 'var(--r-sm)',
                                    border: '1.5px solid var(--border)'
                                }}
                            >
                                <div style={{ minWidth: '24px', fontWeight: 800, color: 'var(--indigo)' }}>
                                    {labels[i]}.
                                </div>
                                <div style={{ flex: 1, fontSize: '14px', color: 'var(--ink)' }}>
                                    {opt.text}
                                </div>
                                <div style={{ color: 'var(--ink-4)', fontWeight: 'bold' }}>➔</div>
                                <div style={{ flex: 1 }}>
                                    <CustomMatchSelect
                                        value={selectedVal}
                                        options={allPairs}
                                        onChange={(val) => handleSelectPair(opt.id, val)}
                                        openUpwards={openUpwards}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (qType === 'urutan') {
            // Get current ordered option list.
            // If answer exists, order the options according to the comma-separated IDs.
            // Otherwise, use the options as they are currently loaded (which might be shuffled).
            let orderedOptions = [...question.options];
            if (currentAnswer) {
                const orderedIds = currentAnswer.split(',').filter(Boolean);
                orderedOptions.sort((a, b) => {
                    const idxA = orderedIds.indexOf(a.id);
                    const idxB = orderedIds.indexOf(b.id);
                    if (idxA === -1 && idxB === -1) return 0;
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                });
            }

            const moveItem = (index: number, direction: 'up' | 'down') => {
                const newOrdered = [...orderedOptions];
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex >= 0 && targetIndex < newOrdered.length) {
                    const temp = newOrdered[index];
                    newOrdered[index] = newOrdered[targetIndex];
                    newOrdered[targetIndex] = temp;

                    // Serialize option IDs
                    const serialized = newOrdered.map(o => o.id).join(',');
                    onSelectOption(serialized);
                }
            };

            return (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500, marginBottom: '4px' }}>
                        Urutkanlah langkah-langkah di bawah ini dengan benar (gunakan tombol ▲ dan ▼ untuk memindahkan posisi):
                    </div>
                    {orderedOptions.map((opt, i) => {
                        return (
                            <div 
                                key={opt.id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '14px', 
                                    background: 'var(--surface-2)', 
                                    padding: '10px 16px', 
                                    borderRadius: 'var(--r-sm)',
                                    border: '1.5px solid var(--border)'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(i, 'up')}
                                        disabled={i === 0}
                                        style={{
                                            padding: '2px 8px',
                                            fontSize: '11px',
                                            background: i === 0 ? 'var(--surface-3)' : 'var(--indigo-s)',
                                            color: i === 0 ? 'var(--ink-4)' : 'var(--indigo)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '4px',
                                            cursor: i === 0 ? 'not-allowed' : 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ▲
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(i, 'down')}
                                        disabled={i === orderedOptions.length - 1}
                                        style={{
                                            padding: '2px 8px',
                                            fontSize: '11px',
                                            background: i === orderedOptions.length - 1 ? 'var(--surface-3)' : 'var(--indigo-s)',
                                            color: i === orderedOptions.length - 1 ? 'var(--ink-4)' : 'var(--indigo)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '4px',
                                            cursor: i === orderedOptions.length - 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        ▼
                                    </button>
                                </div>
                                <div style={{ fontSize: '11.5px', fontWeight: 800, background: 'var(--border)', color: 'var(--ink-2)', padding: '4px 8px', borderRadius: '4px' }}>
                                    Posisi {i + 1}
                                </div>
                                <div style={{ flex: 1, fontSize: '14px', color: 'var(--ink)' }}>
                                    {opt.text}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Default: pg, pgk, tf
        const isPgk = qType === 'pgk';
        const selectedList = currentAnswer ? currentAnswer.split(',').filter(Boolean) : [];

        return (
            <div className="options-wrap">
                {question.options.map((opt, i) => {
                    const isSelected = isPgk ? selectedList.includes(opt.id) : currentAnswer === opt.id;
                    return (
                        <div
                            key={opt.id}
                            className={`option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectOption(opt.id)}
                        >
                            <input
                                type={isPgk ? "checkbox" : "radio"}
                                className="option-radio"
                                name={`opt_${question.id}`}
                                checked={isSelected}
                                onChange={() => {}}
                                style={{ display: 'none' }}
                            />
                            <div className="option-label-box">{labels[i]}</div>
                            <div className="option-text-val">{opt.text}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="question-panel" id="questionPanel">
            <div className="question-header">
                <div className="question-num-row">
                    <div className="question-num-badge">
                        <span className="qnum-label">Soal</span>
                        <span className="qnum-val">{globalIndex + 1}</span>
                        <span className="qnum-total">/ {totalQuestions}</span>
                    </div>
                    <div className="question-tags">
                        <span className={`qtag ${sectionTag.toLowerCase()}`}>{sectionLabel}</span>
                        <span className="qtag diff">{question.difficulty}</span>
                        {question.type === 'pgk' && (
                            <span className="qtag" style={{ background: '#D97706', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                🗹 Pilihan Ganda Kompleks (Multi-Jawaban)
                            </span>
                        )}
                        {question.type === 'essay' && (
                            <span className="qtag" style={{ background: '#4F46E5', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                📝 Uraian / Essay
                            </span>
                        )}
                        {question.type === 'tf' && (
                            <span className="qtag" style={{ background: '#059669', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                ⚖ Benar / Salah
                            </span>
                        )}
                        {question.type === 'isian' && (
                            <span className="qtag" style={{ background: '#2563EB', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                ✏ Isian Singkat
                            </span>
                        )}
                        {question.type === 'urutan' && (
                            <span className="qtag" style={{ background: '#7C3AED', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                🔢 Urutan (Ordering)
                            </span>
                        )}
                        {question.type === 'jodoh' && (
                            <span className="qtag" style={{ background: '#DB2777', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                                🔗 Menjodohkan (Matching)
                            </span>
                        )}
                    </div>
                </div>
                <span className="question-point">+{question.points} poin</span>
            </div>

            <div className="question-body" id="questionBody" key={question.id}>
                <div className="question-content">
                    <p
                        className="question-text"
                        dangerouslySetInnerHTML={{ __html: question.text }}
                    />
                </div>
                {renderQuestionInput()}
            </div>

            <div className="question-nav">
                <button
                    className="btn-nav"
                    onClick={onPrev}
                    disabled={!hasPrev}
                >
                    ← <span>Sebelumnya</span>
                </button>
                <div className="btn-nav-mid">
                    <button
                        className="btn-flag"
                        onClick={onToggleFlag}
                        style={{
                            background: isCurrentFlagged ? 'rgba(180,83,9,0.12)' : '',
                            borderColor: isCurrentFlagged ? 'rgba(180,83,9,0.3)' : '',
                        }}
                    >
                        🚩 Tandai Soal
                    </button>
                </div>
                {isLastQuestion ? (
                    <button
                        className="btn-nav btn-nav-next"
                        onClick={onSubmitClick}
                        style={{
                            background: 'linear-gradient(135deg, var(--rose), #F43F5E)',
                            borderColor: 'transparent',
                            boxShadow: '0 4px 14px rgba(190,18,60,0.3)',
                        }}
                    >
                        <span>Kumpulkan</span> ✓
                    </button>
                ) : (
                    <button
                        className="btn-nav btn-nav-next"
                        onClick={onNext}
                    >
                        <span>Selanjutnya</span> →
                    </button>
                )}
            </div>
        </div>
    );
}
