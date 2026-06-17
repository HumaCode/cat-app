import { useForm, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    icon?: string;
}

interface QuestionOption {
    id?: string;
    option_text: string;
    is_correct: boolean;
    order_column: number;
    pair_text?: string;
}

interface Question {
    id: string;
    category_id?: string;
    category?: {
        id: string;
    };
    type: string;
    difficulty: string;
    points: number;
    bloom_level?: string;
    question_text: string;
    explanation?: string;
    is_active: boolean;
    options?: QuestionOption[];
}

interface TambahSoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    editingQuestion: Question | null;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const OPT_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function TambahSoalModal({
    isOpen,
    onClose,
    categories,
    editingQuestion,
    showToast
}: TambahSoalModalProps) {
    const isEdit = !!editingQuestion;

    const { data, setData, post, put, processing, errors, reset } = useForm<any>({
        category_id: '',
        type: 'pg',
        difficulty: 'Sedang',
        points: 5,
        bloom_level: 'C3',
        question_text: '',
        explanation: '',
        is_active: true,
        options: [] as QuestionOption[]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [opts, setOpts] = useState<QuestionOption[]>([]);
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [clearQuestionImage, setClearQuestionImage] = useState<boolean>(false);
    const [optionImages, setOptionImages] = useState<(File | null)[]>([]);
    const [clearOptionImages, setClearOptionImages] = useState<boolean[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setIsDropdownOpen(false);
            setSearchQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const editorRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    // Dynamic loading & initialization of CKEditor
    useEffect(() => {
        if (!isOpen) return;

        let script = document.getElementById('ckeditor-cdn-script') as HTMLScriptElement;
        if (!script) {
            script = document.createElement('script');
            script.id = 'ckeditor-cdn-script';
            script.src = 'https://cdn.ckeditor.com/ckeditor5/41.1.0/classic/ckeditor.js';
            script.async = true;
            document.body.appendChild(script);
        }

        const initEditor = () => {
            const ClassicEditor = (window as any).ClassicEditor;
            if (ClassicEditor && textareaRef.current && !editorRef.current) {
                ClassicEditor.create(textareaRef.current, {
                    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo' ]
                })
                .then((editor: any) => {
                    editorRef.current = editor;
                    setEditorInstance(editor);
                    
                    const initialContent = editingQuestion ? (editingQuestion.question_text || '') : (data.question_text || '');
                    editor.setData(initialContent);
                    
                    editor.model.document.on('change:data', () => {
                        const content = editor.getData();
                        setData('question_text', content);
                    });
                })
                .catch((err: any) => {
                    console.error('Failed to init CKEditor:', err);
                });
            }
        };

        if ((window as any).ClassicEditor) {
            const timer = setTimeout(initEditor, 100);
            return () => clearTimeout(timer);
        } else {
            script.addEventListener('load', initEditor);
            return () => {
                script.removeEventListener('load', initEditor);
            };
        }
    }, [isOpen]);

    // Handle Editor cleanup on modal close
    useEffect(() => {
        if (!isOpen && editorInstance) {
            editorInstance.destroy()
                .then(() => {
                    editorRef.current = null;
                    setEditorInstance(null);
                })
                .catch((err: any) => {
                    console.error('Failed to destroy CKEditor:', err);
                });
        }
    }, [isOpen, editorInstance]);

    // Sync editing question data with CKEditor when editing question switches
    useEffect(() => {
        if (isOpen && editorInstance && editingQuestion) {
            if (editorInstance.getData() !== editingQuestion.question_text) {
                editorInstance.setData(editingQuestion.question_text || '');
            }
        }
    }, [editingQuestion, isOpen, editorInstance]);

    // Sync reset/clear states
    useEffect(() => {
        if (isOpen && editorInstance && data.question_text === '') {
            if (editorInstance.getData() !== '') {
                editorInstance.setData('');
            }
        }
    }, [data.question_text, isOpen, editorInstance]);

    const handleOptionImageChange = (index: number, file: File | null) => {
        setOptionImages(prev => {
            const next = [...prev];
            next[index] = file;
            return next;
        });
        setClearOptionImages(prev => {
            const next = [...prev];
            next[index] = false;
            return next;
        });
    };

    const handleClearOptionImage = (index: number) => {
        setOptionImages(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
        if (isEdit) {
            setClearOptionImages(prev => {
                const next = [...prev];
                next[index] = true;
                return next;
            });
        }
    };

    // Initialize/sync form state when modal opens or editingQuestion changes
    useEffect(() => {
        if (!isOpen) return;

        if (editingQuestion) {
            setData({
                category_id: editingQuestion.category_id || editingQuestion.category?.id || '',
                type: editingQuestion.type,
                difficulty: editingQuestion.difficulty,
                points: editingQuestion.points,
                bloom_level: editingQuestion.bloom_level || 'C3',
                question_text: editingQuestion.question_text,
                explanation: editingQuestion.explanation || '',
                is_active: editingQuestion.is_active,
                options: [] // handle options locally first
            });
            const qOpts = editingQuestion.options || [];
            setOpts(qOpts);
            setOptionImages(new Array(qOpts.length).fill(null));
            setClearOptionImages(new Array(qOpts.length).fill(false));
            setQuestionImage(null);
            setClearQuestionImage(false);
        } else {
            setData({
                category_id: categories.filter(c => c.parent_id).map(c => c.id)[0] || categories[0]?.id || '',
                type: 'pg',
                difficulty: 'Sedang',
                points: 5,
                bloom_level: 'C3',
                question_text: '',
                explanation: '',
                is_active: true,
                options: []
            });
            // Default choices for PG
            setOpts([
                { option_text: '', is_correct: true, order_column: 0 },
                { option_text: '', is_correct: false, order_column: 1 },
                { option_text: '', is_correct: false, order_column: 2 },
                { option_text: '', is_correct: false, order_column: 3 }
            ]);
            setOptionImages(new Array(4).fill(null));
            setClearOptionImages(new Array(4).fill(false));
            setQuestionImage(null);
            setClearQuestionImage(false);
        }
    }, [isOpen, editingQuestion, categories]);

    // Handle question type switching to setup default options structure
    const handleTypeChange = (newType: string) => {
        setData('type', newType);

        let defaultOpts: QuestionOption[] = [];
        if (newType === 'tf') {
            defaultOpts = [
                { option_text: 'Benar', is_correct: true, order_column: 0 },
                { option_text: 'Salah', is_correct: false, order_column: 1 }
            ];
        } else if (newType === 'isian') {
            defaultOpts = [
                { option_text: '', is_correct: true, order_column: 0 }
            ];
        } else if (newType === 'jodoh') {
            defaultOpts = [
                { option_text: '', pair_text: '', is_correct: true, order_column: 0 },
                { option_text: '', pair_text: '', is_correct: true, order_column: 1 }
            ];
        } else if (newType === 'urutan') {
            defaultOpts = [
                { option_text: '', is_correct: true, order_column: 0 },
                { option_text: '', is_correct: true, order_column: 1 }
            ];
        } else if (newType === 'essay') {
            defaultOpts = [];
        } else {
            // pg or pgk
            defaultOpts = [
                { option_text: '', is_correct: true, order_column: 0 },
                { option_text: '', is_correct: false, order_column: 1 },
                { option_text: '', is_correct: false, order_column: 2 },
                { option_text: '', is_correct: false, order_column: 3 }
            ];
        }
        setOpts(defaultOpts);
        setOptionImages(new Array(defaultOpts.length).fill(null));
        setClearOptionImages(new Array(defaultOpts.length).fill(false));
    };

    // Option editors
    const handleOptionTextChange = (index: number, text: string) => {
        setOpts(prev => prev.map((o, idx) => idx === index ? { ...o, option_text: text } : o));
    };

    const handlePairTextChange = (index: number, pairText: string) => {
        setOpts(prev => prev.map((o, idx) => idx === index ? { ...o, pair_text: pairText } : o));
    };

    const setCorrectOption = (index: number) => {
        if (data.type === 'pg' || data.type === 'tf') {
            setOpts(prev => prev.map((o, idx) => ({ ...o, is_correct: idx === index })));
        } else if (data.type === 'pgk') {
            setOpts(prev => prev.map((o, idx) => idx === index ? { ...o, is_correct: !o.is_correct } : o));
        }
    };

    const addOptionRow = () => {
        if (data.type === 'jodoh') {
            setOpts(prev => [...prev, { option_text: '', pair_text: '', is_correct: true, order_column: prev.length }]);
            setOptionImages(prev => [...prev, null]);
            setClearOptionImages(prev => [...prev, false]);
        } else if (data.type === 'urutan') {
            setOpts(prev => [...prev, { option_text: '', is_correct: true, order_column: prev.length }]);
            setOptionImages(prev => [...prev, null]);
            setClearOptionImages(prev => [...prev, false]);
        } else {
            if (opts.length >= 5) return;
            setOpts(prev => [...prev, { option_text: '', is_correct: false, order_column: prev.length }]);
            setOptionImages(prev => [...prev, null]);
            setClearOptionImages(prev => [...prev, false]);
        }
    };

    const deleteOptionRow = (index: number) => {
        const minRows = data.type === 'jodoh' || data.type === 'urutan' || data.type === 'tf' ? 2 : 2;
        if (opts.length <= minRows) return;
        
        setOpts(prev => {
            const filtered = prev.filter((_, idx) => idx !== index);
            // Re-order order_columns
            const reordered = filtered.map((o, idx) => ({ ...o, order_column: idx }));
            // Ensure at least one correct option exists if pg or tf
            if ((data.type === 'pg' || data.type === 'tf') && !reordered.some(o => o.is_correct)) {
                if (reordered[0]) reordered[0].is_correct = true;
            }
            return reordered;
        });
        setOptionImages(prev => prev.filter((_, idx) => idx !== index));
        setClearOptionImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Perform final options mapping before sending
        const payload: any = {
            ...data,
            options: opts
        };

        if (questionImage) {
            payload.question_image = questionImage;
        }
        if (clearQuestionImage) {
            payload.clear_question_image = true;
        }

        // Attach option images dynamically
        optionImages.forEach((img, idx) => {
            if (img) {
                payload[`option_image_${idx}`] = img;
            }
        });

        clearOptionImages.forEach((clear, idx) => {
            if (clear) {
                payload[`clear_option_image_${idx}`] = true;
            }
        });

        if (isEdit && editingQuestion) {
            router.post(route('bank-soal.update', { id: editingQuestion.id }), {
                ...payload,
                _method: 'PUT'
            }, {
                onSuccess: () => {
                    setIsSubmitting(false);
                    reset();
                    setQuestionImage(null);
                    setClearQuestionImage(false);
                    setOptionImages([]);
                    setClearOptionImages([]);
                    showToast('Soal berhasil diperbarui', 'success');
                    onClose();
                },
                onError: (err) => {
                    setIsSubmitting(false);
                    console.error(err);
                    showToast('Gagal memperbarui soal. Periksa kembali inputan Anda.', 'error');
                }
            });
        } else {
            router.post(route('bank-soal.store'), payload, {
                onSuccess: () => {
                    setIsSubmitting(false);
                    reset();
                    setQuestionImage(null);
                    setClearQuestionImage(false);
                    setOptionImages([]);
                    setClearOptionImages([]);
                    showToast('Soal berhasil ditambahkan', 'success');
                    onClose();
                },
                onError: (err) => {
                    setIsSubmitting(false);
                    console.error(err);
                    showToast('Gagal membuat soal baru. Periksa kembali inputan Anda.', 'error');
                }
            });
        }
    };

    if (!isOpen) return null;

    // Filter categories to show subcategories first
    const subCategories = categories.filter(c => c.parent_id);
    const parentCategories = categories.filter(c => !c.parent_id);

    const categoryOptions = subCategories.map(cat => {
        const parent = parentCategories.find(p => p.id === cat.parent_id);
        return {
            id: cat.id,
            label: parent ? `${parent.name} → ${cat.name}` : cat.name
        };
    });
    if (categoryOptions.length === 0) {
        parentCategories.forEach(cat => {
            categoryOptions.push({
                id: cat.id,
                label: cat.name
            });
        });
    }

    const selectedOption = categoryOptions.find(o => o.id === data.category_id);
    const filteredOptions = categoryOptions.filter(o =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return createPortal(
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <style>{`
                .ck-editor__editable_inline {
                    min-height: 160px;
                    color: var(--ink);
                    background: var(--surface) !important;
                }
                .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused) {
                    border-color: var(--border) !important;
                }
                .ck.ck-editor__main>.ck-editor__editable.ck-focused {
                    border-color: var(--indigo) !important;
                }
                .ck.ck-toolbar {
                    background: var(--surface-2) !important;
                    border-color: var(--border) !important;
                }
                .ck.ck-button {
                    color: var(--ink) !important;
                }
                .ck.ck-button:hover {
                    background: var(--surface-3) !important;
                }
                .ck.ck-button.ck-on {
                    background: var(--surface-3) !important;
                }
                .ck.ck-dropdown__panel {
                    background: var(--surface) !important;
                    border-color: var(--border) !important;
                }
                .ck.ck-list__item .ck-button:hover {
                    background: var(--surface-2) !important;
                }
            `}</style>
            <div className="modal-card" style={{ maxWidth: '1000px', width: '100%', textAlign: 'left', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-2)', flexShrink: 0 }}>
                    <h3 className="modal-title" style={{ margin: 0 }}>
                        {isEdit ? 'Edit Soal Ujian' : 'Buat Soal Ujian Baru'}
                    </h3>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="modal-body" style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
                        <div className="form-grid">
                            <div className="form-grid fg-2">
                                <div className="form-field">
                                    <label className="form-label">Kategori Soal <span className="req">*</span></label>
                                    <div className="custom-select-container" ref={dropdownRef} style={{ position: 'relative' }}>
                                        <div 
                                            className="form-select" 
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between', 
                                                cursor: 'pointer',
                                                background: 'var(--surface)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 'var(--r-sm)',
                                                padding: '10px 14px',
                                                fontSize: '13px',
                                                minHeight: '41px'
                                            }}
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            <span style={{ color: selectedOption ? 'var(--ink)' : 'var(--ink-4)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {selectedOption ? selectedOption.label : 'Pilih Kategori'}
                                            </span>
                                            <span style={{ color: 'var(--ink-4)', fontSize: '11px', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                ▼
                                            </span>
                                        </div>

                                        {isDropdownOpen && (
                                            <div 
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: 'calc(100% + 4px)', 
                                                    left: 0, 
                                                    right: 0, 
                                                    zIndex: 1000, 
                                                    background: 'var(--surface)', 
                                                    border: '1px solid var(--border)', 
                                                    borderRadius: 'var(--r-sm)', 
                                                    boxShadow: 'var(--shadow-lg)', 
                                                    maxHeight: '260px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-2)', background: 'var(--surface-2)' }}>
                                                    <input 
                                                        type="text" 
                                                        className="form-input" 
                                                        placeholder="Cari kategori..." 
                                                        value={searchQuery}
                                                        onChange={e => setSearchQuery(e.target.value)}
                                                        style={{ width: '100%', fontSize: '12.5px', padding: '6px 10px', height: '32px' }}
                                                        autoFocus
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                                                    {filteredOptions.length === 0 ? (
                                                        <div style={{ padding: '8px 12px', fontSize: '12.5px', color: 'var(--ink-4)', textAlign: 'center' }}>
                                                            Kategori tidak ditemukan
                                                        </div>
                                                    ) : (
                                                        filteredOptions.map(o => {
                                                            const isHovered = hoveredOptionId === o.id;
                                                            const isSelected = data.category_id === o.id;
                                                            return (
                                                                <div 
                                                                    key={o.id} 
                                                                    onMouseEnter={() => setHoveredOptionId(o.id)}
                                                                    onMouseLeave={() => setHoveredOptionId(null)}
                                                                    onClick={() => {
                                                                        setData('category_id', o.id);
                                                                        setIsDropdownOpen(false);
                                                                        setSearchQuery('');
                                                                    }}
                                                                    style={{ 
                                                                        padding: '8px 14px', 
                                                                        fontSize: '13px', 
                                                                        color: isSelected ? 'var(--indigo)' : 'var(--ink)', 
                                                                        cursor: 'pointer',
                                                                        background: isSelected ? 'var(--indigo-s)' : (isHovered ? 'var(--surface-2)' : 'transparent'),
                                                                        fontWeight: isSelected ? 600 : 400
                                                                    }}
                                                                >
                                                                    {o.label}
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        <input type="hidden" name="category_id" value={data.category_id} required />
                                    </div>
                                    {errors.category_id && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.category_id}</span>}
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Tipe Soal <span className="req">*</span></label>
                                    <select
                                        className="form-select"
                                        value={data.type}
                                        onChange={e => handleTypeChange(e.target.value)}
                                        required
                                        disabled={isEdit} // Prevent switching types when editing
                                    >
                                        <option value="pg">Pilihan Ganda (Single Answer)</option>
                                        <option value="pgk">Pilihan Ganda Kompleks (Multi Answer)</option>
                                        <option value="essay">Essay / Uraian</option>
                                        <option value="tf">Benar / Salah (True/False)</option>
                                        <option value="isian">Isian Singkat</option>
                                        <option value="jodoh">Menjodohkan (Matching)</option>
                                        <option value="urutan">Urutan (Ordering)</option>
                                    </select>
                                    {errors.type && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.type}</span>}
                                </div>
                            </div>

                            <div className="form-grid fg-3">
                                <div className="form-field">
                                    <label className="form-label">Tingkat Kesukaran <span className="req">*</span></label>
                                    <select
                                        className="form-select"
                                        value={data.difficulty}
                                        onChange={e => setData('difficulty', e.target.value)}
                                        required
                                    >
                                        <option value="Mudah">Mudah</option>
                                        <option value="Sedang">Sedang</option>
                                        <option value="Sulit">Sulit</option>
                                    </select>
                                    {errors.difficulty && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.difficulty}</span>}
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Poin Default Soal <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min="0"
                                        max="100"
                                        value={data.points}
                                        onChange={e => setData('points', parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.points && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.points}</span>}
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Taksonomi Bloom</label>
                                    <select
                                        className="form-select"
                                        value={data.bloom_level}
                                        onChange={e => setData('bloom_level', e.target.value)}
                                    >
                                        <option value="C1">C1 - Mengingat</option>
                                        <option value="C2">C2 - Memahami</option>
                                        <option value="C3">C3 - Menerapkan</option>
                                        <option value="C4">C4 - Menganalisis</option>
                                        <option value="C5">C5 - Mengevaluasi</option>
                                        <option value="C6">C6 - Menciptakan</option>
                                    </select>
                                    {errors.bloom_level && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.bloom_level}</span>}
                                </div>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Pertanyaan Soal <span className="req">*</span></label>
                                <textarea
                                    ref={textareaRef}
                                    className="form-input form-textarea"
                                    placeholder="Tuliskan pertanyaan lengkap di sini..."
                                    value={data.question_text}
                                    onChange={e => setData('question_text', e.target.value)}
                                />
                                {errors.question_text && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.question_text}</span>}

                                {/* Question Image Upload */}
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-3)' }}>Media Pendukung Soal (Gambar)</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {((editingQuestion?.image_url && !clearQuestionImage) || questionImage) ? (
                                            <div style={{ position: 'relative', border: '1px solid var(--border-2)', borderRadius: 'var(--r-sm)', padding: '6px', background: 'var(--surface-2)', display: 'inline-flex' }}>
                                                <img 
                                                    src={questionImage ? URL.createObjectURL(questionImage) : editingQuestion?.image_url} 
                                                    alt="Preview Soal" 
                                                    style={{ maxHeight: '120px', maxWidth: '240px', objectFit: 'contain', borderRadius: 'var(--r-xs)' }} 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setQuestionImage(null);
                                                        if (isEdit) setClearQuestionImage(true);
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        background: 'var(--rose)',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '22px',
                                                        height: '22px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '11px',
                                                        boxShadow: 'var(--shadow-sm)'
                                                    }}
                                                    title="Hapus Gambar"
                                                >
                                                     ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <label 
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    border: '1px dashed var(--border)',
                                                    padding: '8px 16px',
                                                    borderRadius: 'var(--r-sm)',
                                                    cursor: 'pointer',
                                                    fontSize: '12.5px',
                                                    fontWeight: 500,
                                                    color: 'var(--ink-2)',
                                                    background: 'var(--surface-2)',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                className="hover:border-indigo"
                                            >
                                                <span>📷 Unggah Gambar Soal</span>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    style={{ display: 'none' }} 
                                                    onChange={e => {
                                                        const file = e.target.files?.[0] || null;
                                                        setQuestionImage(file);
                                                        setClearQuestionImage(false);
                                                    }}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Options Editor block */}
                            {data.type !== 'essay' && (
                                <div id="answerBlock" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                                    <div className="form-section-lbl" id="answerLbl">
                                        {data.type === 'pg' && 'Opsi Jawaban (klik label bulat A-D untuk set kunci benar)'}
                                        {data.type === 'pgk' && 'Opsi Jawaban (boleh mencentang lebih dari satu yang benar)'}
                                        {data.type === 'tf' && 'Pilih Jawaban Benar'}
                                        {data.type === 'isian' && 'Kunci Jawaban Singkat'}
                                        {data.type === 'jodoh' && 'Pasangan Jawaban'}
                                        {data.type === 'urutan' && 'Urutan yang Benar (dari atas ke bawah)'}
                                    </div>

                                    <div className="opt-list" id="optList">
                                        {data.type === 'tf' && opts.map((opt, idx) => (
                                            <div key={idx} className="opt-row">
                                                <button
                                                    type="button"
                                                    className={`opt-label ${opt.is_correct ? 'correct' : ''}`}
                                                    onClick={() => setCorrectOption(idx)}
                                                >
                                                    {opt.option_text[0]}
                                                </button>
                                                <input
                                                    className="opt-input"
                                                    value={opt.option_text}
                                                    readOnly
                                                    style={{ background: 'var(--bg)', color: 'var(--ink-3)' }}
                                                />
                                            </div>
                                        ))}

                                        {data.type === 'isian' && opts.map((opt, idx) => (
                                            <div key={idx} className="form-field" style={{ width: '100%' }}>
                                                <label className="form-label" style={{ fontWeight: 400, fontSize: '11.5px' }}>
                                                    Jawaban yang diterima (tuliskan alternatif jawaban jika ada)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="opt-input"
                                                    placeholder="Contoh: ASN, Aparatur Sipil Negara"
                                                    value={opt.option_text}
                                                    onChange={e => handleOptionTextChange(idx, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        ))}

                                        {data.type === 'jodoh' && opts.map((opt, idx) => (
                                            <div key={idx} className="opt-row">
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', width: '18px', textAlign: 'center' }}>
                                                    {idx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="opt-input"
                                                    placeholder="Item kiri"
                                                    value={opt.option_text}
                                                    onChange={e => handleOptionTextChange(idx, e.target.value)}
                                                    style={{ flex: 1 }}
                                                    required
                                                />
                                                <span style={{ fontSize: '14px', color: 'var(--ink-4)' }}>↔</span>
                                                <input
                                                    type="text"
                                                    className="opt-input"
                                                    placeholder="Pasangan kanan"
                                                    value={opt.pair_text || ''}
                                                    onChange={e => handlePairTextChange(idx, e.target.value)}
                                                    style={{ flex: 1 }}
                                                    required
                                                />
                                                {opts.length > 2 && (
                                                    <button type="button" className="opt-del" onClick={() => deleteOptionRow(idx)}>✕</button>
                                                )}
                                            </div>
                                        ))}

                                        {data.type === 'urutan' && opts.map((opt, idx) => (
                                            <div key={idx} className="opt-row">
                                                <span style={{ fontSize: '16px', color: 'var(--ink-5)', cursor: 'grab' }}>⠿</span>
                                                <span style={{ fontSize: '11px', fontWeight: 700, background: 'var(--bg-2)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {idx + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="opt-input"
                                                    placeholder={`Langkah ke-${idx + 1}`}
                                                    value={opt.option_text}
                                                    onChange={e => handleOptionTextChange(idx, e.target.value)}
                                                    required
                                                />
                                                {opts.length > 2 && (
                                                    <button type="button" className="opt-del" onClick={() => deleteOptionRow(idx)}>✕</button>
                                                )}
                                            </div>
                                        ))}

                                        {(data.type === 'pg' || data.type === 'pgk') && opts.map((opt, idx) => {
                                            const label = OPT_LABELS[idx] || String.fromCharCode(65 + idx);
                                            const hasImage = (opt.image_url && !clearOptionImages[idx]) || optionImages[idx];
                                            return (
                                                <div key={idx} className="opt-row-container" style={{ display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-2)', padding: '10px', borderRadius: 'var(--r-sm)', background: 'var(--surface)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                                        <button
                                                            type="button"
                                                            className={`opt-label ${opt.is_correct ? 'correct' : ''}`}
                                                            onClick={() => setCorrectOption(idx)}
                                                            title={data.type === 'pg' ? 'Set Kunci' : 'Toggle Kunci'}
                                                        >
                                                            {label}
                                                        </button>
                                                        <input
                                                            type="text"
                                                            className="opt-input"
                                                            placeholder={`Teks opsi ${label}...`}
                                                            value={opt.option_text}
                                                            onChange={e => handleOptionTextChange(idx, e.target.value)}
                                                            required={!hasImage}
                                                            style={{ flex: 1 }}
                                                        />
                                                        
                                                        {/* Option Image Upload Trigger */}
                                                        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', border: '1px solid var(--border-2)', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)' }} title="Unggah Gambar Pilihan">
                                                            📷
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                style={{ display: 'none' }} 
                                                                onChange={e => {
                                                                    const file = e.target.files?.[0] || null;
                                                                    handleOptionImageChange(idx, file);
                                                                }}
                                                            />
                                                        </label>

                                                        {opts.length > 2 ? (
                                                            <button type="button" className="opt-del" onClick={() => deleteOptionRow(idx)}>✕</button>
                                                        ) : (
                                                            <span style={{ width: '26px' }}></span>
                                                        )}
                                                    </div>

                                                    {/* Option Image Preview */}
                                                    {hasImage && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '36px' }}>
                                                            <div style={{ position: 'relative', border: '1px solid var(--border-2)', borderRadius: 'var(--r-xs)', padding: '4px', background: 'var(--surface-2)', display: 'inline-flex' }}>
                                                                <img 
                                                                    src={optionImages[idx] ? URL.createObjectURL(optionImages[idx] as File) : opt.image_url} 
                                                                    alt={`Preview Opsi ${label}`} 
                                                                    style={{ maxHeight: '60px', maxWidth: '120px', objectFit: 'contain', borderRadius: 'var(--r-2xs)' }} 
                                                                />
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => handleClearOptionImage(idx)}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '-6px',
                                                                        right: '-6px',
                                                                        background: 'var(--rose)',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: '50%',
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: '9px',
                                                                        boxShadow: 'var(--shadow-2xs)'
                                                                    }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {(data.type === 'pg' || data.type === 'pgk' || data.type === 'jodoh' || data.type === 'urutan') && (
                                        <button
                                            type="button"
                                            className="add-opt-btn"
                                            onClick={addOptionRow}
                                            id="addOptBtn"
                                            style={{ display: data.type === 'pg' || data.type === 'pgk' ? (opts.length < 5 ? 'flex' : 'none') : 'flex' }}
                                        >
                                            + Tambah Baris Jawaban
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="form-field" style={{ marginTop: '8px' }}>
                                <label className="form-label">Pembahasan & Penjelasan Soal</label>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Tuliskan pembahasan jawaban untuk dipelajari peserta setelah ujian..."
                                    value={data.explanation}
                                    onChange={e => setData('explanation', e.target.value)}
                                />
                                {errors.explanation && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.explanation}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="cb"
                                        style={{ width: '17px', height: '17px' }}
                                    />
                                    <span>Publikasikan soal ini (set Status = Aktif)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="modal-foot" style={{ padding: '16px 24px', flexShrink: 0 }}>
                        <button type="button" className="btn-modal cancel" onClick={onClose} style={{ flex: 'none', width: 'auto' }}>
                            Batal
                        </button>
                        <button type="submit" className="btn-modal confirm" disabled={isSubmitting} style={{ flex: 'none', width: 'auto', background: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" style={{ marginRight: '8px' }}></span>
                                    Sedang Proses...
                                </>
                            ) : (
                                isEdit ? 'Simpan Perubahan' : 'Buat Soal Baru'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
