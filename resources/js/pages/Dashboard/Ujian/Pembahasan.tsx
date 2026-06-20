import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PesertaLayout from '@/Layouts/PesertaLayout';

interface QuestionOption {
    id: string;
    text: string;
    pair_text?: string;
}

interface Question {
    id: string;
    text: string;
    type?: string;
    difficulty: string;
    points: number;
    correct_option_id: string | null;
    correct_option_ids?: string[];
    correct_answers?: string[];
    options: QuestionOption[];
    explanation?: string | null;
}

interface Section {
    key: string;
    label: string;
    color: string;
    tag: string;
    soal_count: number;
    questions: Question[];
}

interface Exam {
    id: string;
    title: string;
    type: string;
    duration: number;
    institution: string;
    settings: {
        passing_grade: number;
        passing_grade_type: string;
        shuffle_questions: boolean;
        shuffle_options: boolean;
        lockdown_mode: boolean;
        activity_logging: boolean;
        show_results: boolean;
    };
}

interface PembahasanProps {
    exam: Exam;
    sections: Section[];
    user: {
        id: number;
        name: string;
    };
}

const TYPE_MAP: Record<string, string> = {
    pg: 'Pilihan Ganda',
    pgk: 'Pilihan Ganda Kompleks',
    essay: 'Essay / Uraian',
    tf: 'Benar / Salah',
    isian: 'Isian Singkat',
    jodoh: 'Menjodohkan',
    urutan: 'Urutan / Reorder',
};

const OPT_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export default function Pembahasan({ exam, sections = [], user }: PembahasanProps) {
    const [activeSectionIdx, setActiveSectionIdx] = useState(0);

    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
        : user.name.slice(0, 2).toUpperCase();

    const currentSection = sections[activeSectionIdx] || null;
    const totalQuestions = sections.reduce((acc, sec) => acc + sec.questions.length, 0);

    const renderQuestionAnswers = (q: Question) => {
        const qType = q.type || 'pg';

        if (qType === 'pg' || qType === 'pgk') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {q.options.map((opt, i) => {
                        const isCorrect = q.correct_option_ids?.includes(opt.id) || q.correct_option_id === opt.id;
                        const label = OPT_LABELS[i] || String.fromCharCode(65 + i);

                        return (
                            <div
                                key={opt.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `1.5px solid ${isCorrect ? 'var(--emerald)' : 'var(--border)'}`,
                                    background: isCorrect ? 'var(--emerald-s)' : 'var(--surface)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <span
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        border: `1.5px solid ${isCorrect ? 'var(--emerald)' : 'var(--border)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: isCorrect ? 'var(--emerald)' : 'var(--ink-3)',
                                        background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        flexShrink: 0,
                                    }}
                                >
                                    {label}
                                </span>
                                <div style={{ fontSize: '13.5px', color: 'var(--ink)', flex: 1 }}>
                                    {opt.text}
                                </div>
                                {isCorrect && (
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                                        ✓ Kunci Jawaban
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (qType === 'tf') {
            return (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    {['Benar', 'Salah'].map((val) => {
                        const isCorrect = q.correct_answers?.map(a => a.toLowerCase()).includes(val.toLowerCase()) || 
                                          q.options.find(o => o.is_correct || q.correct_option_ids?.includes(o.id) || q.correct_option_id === o.id)?.text.toLowerCase() === val.toLowerCase();
                        return (
                            <div
                                key={val}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: `1.5px solid ${isCorrect ? 'var(--emerald)' : 'var(--border)'}`,
                                    background: isCorrect ? 'var(--emerald-s)' : 'var(--surface)',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: isCorrect ? 'var(--emerald)' : 'var(--ink-3)',
                                }}
                            >
                                {val} {isCorrect ? '✓' : ''}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (qType === 'isian') {
            return (
                <div style={{ marginTop: '12px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-3)' }}>Kunci Jawaban yang Diterima:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {(q.correct_answers || []).map((ans, idx) => (
                            <span key={idx} style={{ background: 'var(--indigo-s)', color: 'var(--indigo)', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                                {ans}
                            </span>
                        ))}
                    </div>
                </div>
            );
        }

        if (qType === 'jodoh') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {q.options.map((opt, i) => (
                        <div
                            key={opt.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                            }}
                        >
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', width: '18px' }}>
                                {i + 1}
                            </span>
                            <span style={{ fontSize: '13.5px', color: 'var(--ink)', flex: 1 }}>
                                {opt.text}
                            </span>
                            <span style={{ fontSize: '14px', color: 'var(--ink-4)' }}>↔</span>
                            <span style={{ fontSize: '13.5px', color: 'var(--indigo)', fontWeight: 600, flex: 1 }}>
                                {opt.pair_text}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        if (qType === 'urutan') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {q.options.map((opt, i) => (
                        <div
                            key={opt.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                            }}
                        >
                            <span style={{ fontSize: '12px', fontWeight: 700, background: 'var(--bg-2)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: '4px' }}>
                                {i + 1}
                            </span>
                            <span style={{ fontSize: '13.5px', color: 'var(--ink)', flex: 1 }}>
                                {opt.text}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        if (qType === 'essay') {
            return (
                <div style={{ marginTop: '12px', padding: '14px', borderRadius: '8px', border: '1px dashed var(--border)', background: 'var(--bg-2)', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-4)' }}>
                    Jawaban esai dinilai secara manual oleh penguji berdasarkan pedoman penilaian.
                </div>
            );
        }

        return null;
    };

    return (
        <PesertaLayout
            title={`Pembahasan: ${exam.title}`}
            userName={user.name}
            userInitials={initials}
        >
            <div className="content-wrap" style={{ paddingBottom: '40px' }}>
                {/* Header Section */}
                <div 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
                            Pembahasan & Kunci Jawaban
                        </h1>
                        <p style={{ color: 'var(--ink-3)', fontSize: '13.5px', marginTop: '4px', margin: 0 }}>
                            {exam.title} &bull; {exam.institution}
                        </p>
                    </div>

                    <nav 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            background: 'var(--bg-2)', 
                            border: '1px solid var(--border-2)', 
                            borderRadius: '999px', 
                            padding: '6px 14px',
                            fontSize: '12px', 
                            fontWeight: 600, 
                        }}
                    >
                        <Link 
                            href={route('dashboard.peserta')}
                            style={{
                                color: 'var(--ink-3)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--indigo)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-3)'}
                        >
                            <span>🏠</span> Beranda
                        </Link>
                        <span style={{ color: 'var(--ink-4)', margin: '0 2px' }}>/</span>
                        <span style={{ color: 'var(--indigo)', fontWeight: 700 }}>Pembahasan Ujian</span>
                    </nav>
                </div>

                {/* Section selection tabs */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--border-2)', marginBottom: '24px' }}>
                    {sections.map((sec, idx) => {
                        const isActive = idx === activeSectionIdx;
                        return (
                            <button
                                key={sec.key}
                                onClick={() => setActiveSectionIdx(idx)}
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: isActive ? 'var(--indigo)' : 'var(--surface)',
                                    color: isActive ? '#ffffff' : 'var(--ink-3)',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? '0 4px 12px rgba(67, 56, 202, 0.25)' : 'var(--shadow-sm)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {sec.label} ({sec.questions.length} Soal)
                            </button>
                        );
                    })}
                </div>

                {/* Questions Review List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {currentSection && currentSection.questions.length > 0 ? (
                        currentSection.questions.map((q, idx) => (
                            <div
                                key={q.id}
                                style={{
                                    background: 'var(--surface)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid var(--border)',
                                }}
                            >
                                {/* Question Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-2)', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--indigo)', background: 'var(--indigo-s)', padding: '4px 10px', borderRadius: '6px' }}>
                                        Soal {idx + 1} &bull; {TYPE_MAP[q.type || 'pg']}
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                                        <span style={{ background: 'var(--bg-2)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {q.difficulty}
                                        </span>
                                        <span style={{ background: 'var(--bg-2)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                            {q.points} Poin
                                        </span>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div 
                                    style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', lineHeight: '1.6', marginBottom: '16px' }}
                                    dangerouslySetInnerHTML={{ __html: q.text }}
                                />

                                {/* Question Answers */}
                                {renderQuestionAnswers(q)}

                                {/* Explanation / Discussion */}
                                <div
                                    style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        background: 'rgba(79, 70, 229, 0.04)',
                                        border: '1px dashed rgba(79, 70, 229, 0.25)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--indigo)', fontSize: '13.5px', marginBottom: '6px' }}>
                                        <span>💡</span> Pembahasan:
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                                        {q.explanation || 'Tidak ada pembahasan khusus untuk soal ini.'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface)', borderRadius: '12px', color: 'var(--ink-4)' }}>
                            Tidak ada soal di bagian ini.
                        </div>
                    )}
                </div>
            </div>
        </PesertaLayout>
    );
}
