import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from '@inertiajs/react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { ExamItem, CategoryItem } from './types';

const renderSeksiIcon = (iconStr: string) => {
    if (iconStr && iconStr.startsWith('bi ')) {
        return <i className={iconStr}></i>;
    }
    return <span>{iconStr || '📝'}</span>;
};

const formatToLocal = (dateInput?: string | null) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

function CategorySearchableSelect({
    categories,
    value,
    onChange,
    placeholder = 'Pilih Kategori Soal...'
}: {
    categories: CategoryItem[];
    value: string;
    onChange: (id: string, name: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCategory = categories.find(c => c.id === value);
    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div
                onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
                style={{
                    height: '38px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xs)',
                    background: 'var(--surface)',
                    color: value ? 'var(--ink)' : 'var(--ink-4)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginRight: '8px' }}>
                    {selectedCategory ? selectedCategory.name : placeholder}
                </span>
                <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '11px', color: 'var(--ink-4)' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-xs)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 1000,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <div className="filter-search" style={{ height: '32px', width: '100%', padding: '0 8px', border: '1px solid var(--border-2)', borderRadius: 'var(--r-xs)', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                            style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', fontSize: '12.5px', width: '100%' }}
                        />
                        <i className="bi bi-search" style={{ fontSize: '12px', color: 'var(--ink-4)' }} />
                    </div>

                    <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'block' }}>
                        {filteredCategories.length === 0 ? (
                            <div style={{ padding: '8px 10px', fontSize: '12.5px', color: 'var(--ink-4)', textAlign: 'center' }}>
                                Kategori tidak ditemukan
                            </div>
                        ) : (
                            filteredCategories.map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => {
                                        onChange(cat.id, cat.name);
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        padding: '8px 10px',
                                        fontSize: '12.5px',
                                        color: value === cat.id ? 'var(--indigo)' : 'var(--ink)',
                                        background: value === cat.id ? 'var(--indigo-s)' : 'transparent',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    className="select-option-item"
                                >
                                    <span>{cat.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface ExamFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: ExamItem | null;
    categories: CategoryItem[];
    onSuccess: (msg: string) => void;
    onError?: (msg: string) => void;
}

export default function ExamFormModal({
    isOpen,
    onClose,
    exam,
    categories,
    onSuccess,
    onError,
}: ExamFormModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [showAddSeksiForm, setShowAddSeksiForm] = useState(false);
    const [newSeksiTitle, setNewSeksiTitle] = useState('');
    const [newSeksiCategoryId, setNewSeksiCategoryId] = useState('');
    const [newSeksiIcon, setNewSeksiIcon] = useState('bi bi-journal-text');
    const [newSeksiSoalCount, setNewSeksiSoalCount] = useState(30);
    const [newSeksiDuration, setNewSeksiDuration] = useState(30);
    const [newSeksiCorrectPoints, setNewSeksiCorrectPoints] = useState(5);
    const [newSeksiIncorrectPoints, setNewSeksiIncorrectPoints] = useState(0);
    const [newSeksiPassingGrade, setNewSeksiPassingGrade] = useState(0);

    // Initializing Inertia form state
    const { data, setData, post, put, transform, processing, errors, reset } = useForm({
        title: '',
        type: '',
        duration: 0,
        passing_grade: 65,
        category_id: '',
        start_time: '',
        end_time: '',
        instructions: '',
        settings: {
            show_results: true,
            show_answers: false,
            shuffle_questions: true,
            shuffle_options: true,
            lockdown_mode: true,
            activity_logging: true,
            attempts_limit: 1,
            access_type: 'Hanya peserta terdaftar',
            passing_grade_type: 'total',
            participant_method: 'Pilih dari daftar pengguna',
            filter_institution: 'Semua institusi',
            quota: 0,
            seksi: [] as Array<{
                title: string;
                category_id?: string;
                icon: string;
                soal_count: number;
                duration: number;
                correct_points: number;
                incorrect_points: number;
                passing_grade?: number;
                status: string;
            }>,
            participants: [] as string[]
        },
        status: 'draft'
    });

    // Load existing exam details if in edit mode
    useEffect(() => {
        if (exam) {
            setData({
                title: exam.title || '',
                type: exam.type || '',
                duration: exam.duration || 0,
                passing_grade: exam.passing_grade || 65,
                category_id: exam.category_id || '',
                start_time: formatToLocal(exam.start_time),
                end_time: formatToLocal(exam.end_time),
                instructions: exam.instructions || '',
                settings: {
                    show_results: exam.settings?.show_results ?? true,
                    show_answers: exam.settings?.show_answers ?? false,
                    shuffle_questions: exam.settings?.shuffle_questions ?? true,
                    shuffle_options: exam.settings?.shuffle_options ?? true,
                    lockdown_mode: exam.settings?.lockdown_mode ?? true,
                    activity_logging: exam.settings?.activity_logging ?? true,
                    attempts_limit: exam.settings?.attempts_limit ?? 1,
                    access_type: exam.settings?.access_type ?? 'Hanya peserta terdaftar',
                    passing_grade_type: exam.settings?.passing_grade_type ?? 'total',
                    participant_method: exam.settings?.participant_method ?? 'Pilih dari daftar pengguna',
                    filter_institution: exam.settings?.filter_institution ?? 'Semua institusi',
                    quota: exam.settings?.quota ?? 0,
                    seksi: exam.settings?.seksi ?? [] as Array<{
                        title: string;
                        icon: string;
                        soal_count: number;
                        duration: number;
                        correct_points: number;
                        incorrect_points: number;
                        passing_grade: number;
                        status: string;
                    }>,
                    participants: exam.settings?.participants ?? []
                },
                status: exam.status || 'draft'
            });
        } else {
            reset();
        }
        setCurrentStep(1);
    }, [exam, isOpen]);

    const totalSeksiDuration = data.settings.seksi.reduce((sum, s) => sum + (s.duration || 0), 0);

    useEffect(() => {
        if (data.duration !== totalSeksiDuration) {
            setData('duration', totalSeksiDuration);
        }
    }, [totalSeksiDuration]);

    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        let startPicker: any;
        let endPicker: any;

        const timer = setTimeout(() => {
            if (startTimeRef.current) {
                const cleanDate = formatToLocal(exam?.start_time);
                if ((startTimeRef.current as any)._flatpickr) {
                    (startTimeRef.current as any)._flatpickr.setDate(cleanDate, false);
                } else {
                    startPicker = flatpickr(startTimeRef.current, {
                        enableTime: true,
                        time_24hr: true,
                        dateFormat: "Y-m-d H:i",
                        defaultDate: cleanDate || undefined,
                        onChange: (selectedDates, dateStr) => {
                            setData('start_time', dateStr);
                        }
                    });
                }
            }

            if (endTimeRef.current) {
                const cleanDate = formatToLocal(exam?.end_time);
                if ((endTimeRef.current as any)._flatpickr) {
                    (endTimeRef.current as any)._flatpickr.setDate(cleanDate, false);
                } else {
                    endPicker = flatpickr(endTimeRef.current, {
                        enableTime: true,
                        time_24hr: true,
                        dateFormat: "Y-m-d H:i",
                        defaultDate: cleanDate || undefined,
                        onChange: (selectedDates, dateStr) => {
                            setData('end_time', dateStr);
                        }
                    });
                }
            }
        }, 50);

        return () => {
            clearTimeout(timer);
            if (startPicker) startPicker.destroy();
            if (endPicker) endPicker.destroy();
        };
    }, [isOpen, currentStep, exam]);

    useEffect(() => {
        if (startTimeRef.current && (startTimeRef.current as any)._flatpickr) {
            (startTimeRef.current as any)._flatpickr.setDate(formatToLocal(data.start_time), false);
        }
    }, [data.start_time]);

    useEffect(() => {
        if (endTimeRef.current && (endTimeRef.current as any)._flatpickr) {
            (endTimeRef.current as any)._flatpickr.setDate(formatToLocal(data.end_time), false);
        }
    }, [data.end_time]);

    if (!isMounted || !isOpen) return null;

    const handleSettingChange = (key: string, value: any) => {
        setData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [key]: value
            }
        }));
    };

    const handleSeksiStatusChange = (index: number) => {
        const updatedSeksi = [...data.settings.seksi];
        updatedSeksi[index] = {
            ...updatedSeksi[index],
            status: updatedSeksi[index].status === 'aktif' ? 'nonaktif' : 'aktif'
        };
        handleSettingChange('seksi', updatedSeksi);
    };

    const handleAddSeksiSubmit = () => {
        if (!newSeksiCategoryId) {
            if (onError) {
                onError('Kategori Soal wajib dipilih!');
            } else {
                onSuccess('Kategori Soal wajib dipilih!');
            }
            return;
        }
        if (!newSeksiTitle.trim()) return;
        const newSeksi = {
            title: newSeksiTitle,
            category_id: newSeksiCategoryId,
            icon: newSeksiIcon,
            soal_count: newSeksiSoalCount,
            duration: newSeksiDuration,
            correct_points: newSeksiCorrectPoints,
            incorrect_points: newSeksiIncorrectPoints,
            passing_grade: data.settings.passing_grade_type === 'seksi' ? newSeksiPassingGrade : 0,
            status: 'aktif'
        };
        const updatedSeksi = [...data.settings.seksi, newSeksi];
        handleSettingChange('seksi', updatedSeksi);

        // Reset form
        setNewSeksiTitle('');
        setNewSeksiCategoryId('');
        setNewSeksiIcon('bi bi-journal-text');
        setNewSeksiSoalCount(30);
        setNewSeksiDuration(30);
        setNewSeksiCorrectPoints(5);
        setNewSeksiIncorrectPoints(0);
        setNewSeksiPassingGrade(0);
        setShowAddSeksiForm(false);
        onSuccess('Seksi baru berhasil ditambahkan!');
    };

    const handleRemoveSeksi = (index: number) => {
        const updatedSeksi = data.settings.seksi.filter((_, idx) => idx !== index);
        handleSettingChange('seksi', updatedSeksi);
        onSuccess('Seksi berhasil dihapus.');
    };

    const handleRemoveParticipant = (idx: number) => {
        // Just mock removal for demonstration
        onSuccess('Peserta berhasil dikeluarkan dari daftar.');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            start_time: data.start_time ? new Date(data.start_time).toISOString() : null,
            end_time: data.end_time ? new Date(data.end_time).toISOString() : null,
        }));

        const options = {
            onSuccess: () => {
                onClose();
                onSuccess(exam ? 'Ujian berhasil diperbarui!' : 'Ujian baru berhasil disimpan!');
            },
            onError: (errors: any) => {
                const errorMsg = Object.values(errors)[0] as string || 'Terjadi kesalahan saat menyimpan ujian.';
                if (onError) {
                    onError(errorMsg);
                } else {
                    onSuccess(errorMsg);
                }
            }
        };

        if (exam) {
            put(route('ujian.update', exam.id), options);
        } else {
            post(route('ujian.store'), options);
        }
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return createPortal(
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '960px', width: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-2)', flexShrink: 0 }}>
                    <div>
                        <h3 className="modal-title" style={{ margin: 0 }}>{exam ? 'Edit Ujian' : 'Buat Ujian Baru'}</h3>
                        <div style={{ fontSize: '12.5px', color: 'var(--ink-4)', marginTop: '2px' }}>
                            {currentStep === 1 && 'Lengkapi informasi dasar ujian'}
                            {currentStep === 2 && 'Atur aturan pengerjaan dan keamanan'}
                            {currentStep === 3 && 'Kelola sub-tes atau seksi ujian'}
                            {currentStep === 4 && 'Daftarkan peserta ujian'}
                        </div>
                    </div>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Step Navigation Tabs */}
                <div className="steps">
                    <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'done' : ''}`} onClick={() => setCurrentStep(1)}>
                        <div className="step-num">1</div> Info Ujian
                    </div>
                    <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'done' : ''}`} onClick={() => setCurrentStep(2)}>
                        <div className="step-num">2</div> Pengaturan
                    </div>
                    <div className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'done' : ''}`} onClick={() => setCurrentStep(3)}>
                        <div className="step-num">3</div> Soal & Seksi
                    </div>
                    <div className={`step-item ${currentStep === 4 ? 'active' : ''}`} onClick={() => setCurrentStep(4)}>
                        <div className="step-num">4</div> Peserta
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                    <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>

                        {/* Step 1: Info Ujian */}
                        {currentStep === 1 && (
                            <div className="form-grid" style={{ gap: '16px' }}>
                                <div className="form-field">
                                    <label className="form-label">Judul Ujian <span className="req">*</span></label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        placeholder="contoh: SKD CPNS 2025 — Paket A"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <span style={{ color: 'var(--rose)', fontSize: '11.5px', marginTop: '2px' }}>{errors.title}</span>}
                                </div>
                                <div className="form-grid fg-2" style={{ gap: '16px' }}>
                                    <div className="form-field">
                                        <label className="form-label">Tipe Ujian <span className="req">*</span></label>
                                        <select
                                            className="form-select"
                                            value={data.type}
                                            onChange={e => setData('type', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih tipe...</option>
                                            <option value="Simulasi">Simulasi</option>
                                            <option value="Latihan">Latihan</option>
                                            <option value="Resmi">Resmi</option>
                                        </select>
                                        {errors.type && <span style={{ color: 'var(--rose)', fontSize: '11.5px', marginTop: '2px' }}>{errors.type}</span>}
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Jenis Passing Grade</label>
                                        <select
                                            className="form-select"
                                            value={data.settings.passing_grade_type || 'total'}
                                            onChange={e => handleSettingChange('passing_grade_type', e.target.value)}
                                        >
                                            <option value="total">Total Seluruh Ujian (%)</option>
                                            <option value="seksi">Per Seksi / Sub-tes (Poin)</option>
                                        </select>
                                    </div>
                                </div>
                                {data.settings.passing_grade_type === 'total' && (
                                    <div className="form-grid fg-2" style={{ gap: '16px' }}>
                                        <div className="form-field">
                                            <label className="form-label">Passing Grade (%) <span className="req">*</span></label>
                                            <input
                                                className="form-input"
                                                type="number"
                                                placeholder="65"
                                                value={data.passing_grade}
                                                onChange={e => setData('passing_grade', parseInt(e.target.value) || 0)}
                                                min="0"
                                                max="100"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="form-grid fg-2" style={{ gap: '16px' }}>
                                    <div className="form-field">
                                        <label className="form-label">Tanggal Mulai</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                ref={startTimeRef}
                                                className="form-input"
                                                type="text"
                                                placeholder="Pilih tanggal & waktu..."
                                                style={{ paddingRight: '36px' }}
                                            />
                                            <i className="bi bi-calendar-event" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', pointerEvents: 'none' }}></i>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Tanggal Selesai</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                ref={endTimeRef}
                                                className="form-input"
                                                type="text"
                                                placeholder="Pilih tanggal & waktu..."
                                                style={{ paddingRight: '36px' }}
                                            />
                                            <i className="bi bi-calendar-event" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', pointerEvents: 'none' }}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Status Ujian <span className="req">*</span></label>
                                    <style>{`
                                        .status-radio-grid {
                                            display: grid;
                                            grid-template-columns: repeat(2, 1fr);
                                            gap: 10px;
                                        }
                                        .status-radio-card {
                                            position: relative;
                                            cursor: pointer;
                                            border-radius: 10px;
                                            overflow: hidden;
                                            transition: transform 0.18s ease, box-shadow 0.18s ease;
                                        }
                                        .status-radio-card:hover {
                                            transform: translateY(-2px);
                                        }
                                        .status-radio-card input[type="radio"] {
                                            position: absolute;
                                            opacity: 0;
                                            width: 0; height: 0;
                                        }
                                        .status-radio-inner {
                                            display: flex;
                                            align-items: center;
                                            gap: 10px;
                                            padding: 11px 14px;
                                            border: 2px solid var(--border-2);
                                            border-radius: 10px;
                                            background: var(--surface);
                                            transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                                            position: relative;
                                            overflow: hidden;
                                        }
                                        .status-radio-inner::before {
                                            content: '';
                                            position: absolute;
                                            inset: 0;
                                            opacity: 0;
                                            transition: opacity 0.2s;
                                        }
                                        .status-radio-card:hover .status-radio-inner {
                                            border-color: var(--border);
                                            box-shadow: 0 2px 12px rgba(0,0,0,0.07);
                                        }
                                        .status-radio-card input:checked ~ .status-radio-inner {
                                            box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 15%, transparent);
                                        }
                                        .status-radio-card.s-draft input:checked ~ .status-radio-inner {
                                            border-color: #94a3b8;
                                            background: #f8fafc;
                                            box-shadow: 0 0 0 3px rgba(148,163,184,0.18), 0 4px 16px rgba(148,163,184,0.15);
                                        }
                                        .status-radio-card.s-terjadwal input:checked ~ .status-radio-inner {
                                            border-color: var(--indigo);
                                            background: var(--indigo-s);
                                            box-shadow: 0 0 0 3px rgba(99,102,241,0.18), 0 4px 16px rgba(99,102,241,0.15);
                                        }
                                        .status-radio-card.s-aktif input:checked ~ .status-radio-inner {
                                            border-color: var(--emerald);
                                            background: var(--emerald-s);
                                            box-shadow: 0 0 0 3px rgba(16,185,129,0.18), 0 4px 16px rgba(16,185,129,0.15);
                                        }
                                        .status-radio-card.s-selesai input:checked ~ .status-radio-inner {
                                            border-color: var(--teal);
                                            background: color-mix(in srgb, var(--teal) 8%, transparent);
                                            box-shadow: 0 0 0 3px rgba(20,184,166,0.18), 0 4px 16px rgba(20,184,166,0.15);
                                        }
                                        .status-radio-icon {
                                            font-size: 20px;
                                            line-height: 1;
                                            flex-shrink: 0;
                                            width: 32px; height: 32px;
                                            display: flex; align-items: center; justify-content: center;
                                            border-radius: 8px;
                                            transition: transform 0.2s;
                                        }
                                        .status-radio-card:hover .status-radio-icon {
                                            transform: scale(1.12);
                                        }
                                        .status-radio-card input:checked ~ .status-radio-inner .status-radio-icon {
                                            transform: scale(1.18);
                                        }
                                        .status-radio-text { flex: 1; min-width: 0; }
                                        .status-radio-label {
                                            font-size: 12.5px;
                                            font-weight: 700;
                                            color: var(--ink);
                                            line-height: 1.2;
                                        }
                                        .status-radio-desc {
                                            font-size: 10.5px;
                                            color: var(--ink-4);
                                            margin-top: 2px;
                                            line-height: 1.3;
                                        }
                                        .status-radio-check {
                                            width: 18px; height: 18px;
                                            border-radius: 50%;
                                            border: 2px solid var(--border-2);
                                            background: var(--surface);
                                            display: flex; align-items: center; justify-content: center;
                                            flex-shrink: 0;
                                            transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
                                            position: relative;
                                        }
                                        .status-radio-check::after {
                                            content: '';
                                            width: 8px; height: 8px;
                                            border-radius: 50%;
                                            background: currentColor;
                                            opacity: 0;
                                            transform: scale(0);
                                            transition: opacity 0.18s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
                                        }
                                        .status-radio-card.s-draft input:checked ~ .status-radio-inner .status-radio-check {
                                            border-color: #94a3b8; color: #94a3b8;
                                        }
                                        .status-radio-card.s-terjadwal input:checked ~ .status-radio-inner .status-radio-check {
                                            border-color: var(--indigo); color: var(--indigo);
                                        }
                                        .status-radio-card.s-aktif input:checked ~ .status-radio-inner .status-radio-check {
                                            border-color: var(--emerald); color: var(--emerald);
                                        }
                                        .status-radio-card.s-selesai input:checked ~ .status-radio-inner .status-radio-check {
                                            border-color: var(--teal); color: var(--teal);
                                        }
                                        .status-radio-card input:checked ~ .status-radio-inner .status-radio-check::after {
                                            opacity: 1;
                                            transform: scale(1);
                                        }
                                    `}</style>
                                    <div className="status-radio-grid">
                                        {[
                                            { value: 'draft',     cls: 's-draft',     emoji: '📝', label: 'Draft',     desc: 'Belum dipublikasikan' },
                                            { value: 'terjadwal', cls: 's-terjadwal', emoji: '🗓️', label: 'Terjadwal', desc: 'Aktif saat waktu mulai' },
                                            { value: 'aktif',     cls: 's-aktif',     emoji: '🟢', label: 'Aktif',     desc: 'Sedang berlangsung' },
                                            { value: 'selesai',   cls: 's-selesai',   emoji: '✅', label: 'Selesai',   desc: 'Ujian telah berakhir' },
                                        ].map(opt => (
                                            <label key={opt.value} className={`status-radio-card ${opt.cls}`}>
                                                <input
                                                    type="radio"
                                                    name="exam-status"
                                                    value={opt.value}
                                                    checked={data.status === opt.value}
                                                    onChange={() => setData('status', opt.value)}
                                                />
                                                <div className="status-radio-inner">
                                                    <div className="status-radio-icon">{opt.emoji}</div>
                                                    <div className="status-radio-text">
                                                        <div className="status-radio-label">{opt.label}</div>
                                                        <div className="status-radio-desc">{opt.desc}</div>
                                                    </div>
                                                    <div className="status-radio-check" />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '6px', display: 'block' }}>
                                        Pilih <strong>Terjadwal</strong> agar status otomatis berubah saat waktu mulai tiba.
                                    </span>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Instruksi Ujian</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        placeholder="Tuliskan instruksi pengerjaan..."
                                        value={data.instructions}
                                        onChange={e => setData('instructions', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pengaturan */}
                        {currentStep === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <div className="form-label" style={{ marginBottom: '10px' }}>Tampilan Hasil</div>
                                    <div className="toggle-group">
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Tampilkan hasil setelah submit</div>
                                                <div className="toggle-desc">Peserta bisa melihat nilai langsung</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.show_results}
                                                    onChange={e => handleSettingChange('show_results', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Tampilkan kunci jawaban & pembahasan</div>
                                                <div className="toggle-desc">Aktif setelah semua peserta selesai</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.show_answers}
                                                    onChange={e => handleSettingChange('show_answers', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="form-label" style={{ marginBottom: '10px' }}>Keamanan & Anti-cheat</div>
                                    <div className="toggle-group">
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Acak urutan soal</div>
                                                <div className="toggle-desc">Setiap peserta mendapat urutan soal berbeda</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.shuffle_questions}
                                                    onChange={e => handleSettingChange('shuffle_questions', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Acak urutan opsi jawaban</div>
                                                <div className="toggle-desc">Posisi pilihan A–E diacak per peserta</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.shuffle_options}
                                                    onChange={e => handleSettingChange('shuffle_options', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Mode fullscreen wajib</div>
                                                <div className="toggle-desc">Ujian hanya bisa dikerjakan fullscreen</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.lockdown_mode}
                                                    onChange={e => handleSettingChange('lockdown_mode', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                        <div className="toggle-item">
                                            <div className="toggle-info">
                                                <div className="toggle-label">Log aktivitas peserta</div>
                                                <div className="toggle-desc">Rekam tab blur, copy-paste, dll.</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={data.settings.activity_logging}
                                                    onChange={e => handleSettingChange('activity_logging', e.target.checked)}
                                                />
                                                <span className="toggle-track"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-grid fg-2" style={{ gap: '16px' }}>
                                    <div className="form-field">
                                        <label className="form-label">Batas Percobaan</label>
                                        <select
                                            className="form-select"
                                            value={data.settings.attempts_limit}
                                            onChange={e => handleSettingChange('attempts_limit', parseInt(e.target.value) || 1)}
                                        >
                                            <option value="1">1 kali</option>
                                            <option value="2">2 kali</option>
                                            <option value="3">3 kali</option>
                                            <option value="999">Tidak terbatas</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Akses Ujian</label>
                                        <select
                                            className="form-select"
                                            value={data.settings.access_type}
                                            onChange={e => handleSettingChange('access_type', e.target.value)}
                                        >
                                            <option value="Hanya peserta terdaftar">Hanya peserta terdaftar</option>
                                            <option value="Siapa saja (publik)">Siapa saja (publik)</option>
                                            <option value="Dengan kode akses">Dengan kode akses</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Soal & Seksi */}
                        {currentStep === 3 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="form-label">Seksi / Sub-tes</div>
                                        <div className="form-hint" style={{ marginTop: '2px' }}>Kelola seksi sub-tes dari ujian</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-modal confirm"
                                        style={{ flex: 'none', width: 'auto', padding: '8px 14px', background: 'var(--indigo)' }}
                                        onClick={() => setShowAddSeksiForm(true)}
                                    >
                                        ＋ Tambah Seksi
                                    </button>
                                </div>

                                {showAddSeksiForm && (
                                    <div style={{ border: '1px solid var(--indigo)', borderRadius: 'var(--r-sm)', padding: '18px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: 'var(--shadow-sm)' }}>
                                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>Tambah Seksi Baru</div>

                                        <div className="form-grid fg-3" style={{ gap: '12px', gridTemplateColumns: '1.2fr 1.2fr 0.8fr' }}>
                                            <div className="form-field">
                                                <label className="form-label">Kategori Soal <span className="req">*</span></label>
                                                <CategorySearchableSelect
                                                    categories={categories}
                                                    value={newSeksiCategoryId}
                                                    onChange={(id, name) => {
                                                        setNewSeksiCategoryId(id);
                                                        setNewSeksiTitle(name);
                                                        
                                                        const nameLower = name.toLowerCase();
                                                        if (nameLower.includes('tiu') || nameLower.includes('numerik') || nameLower.includes('hitung') || nameLower.includes('matematika')) {
                                                            setNewSeksiIcon('bi bi-calculator');
                                                        } else if (nameLower.includes('logis') || nameLower.includes('spasial') || nameLower.includes('logika')) {
                                                            setNewSeksiIcon('bi bi-cpu');
                                                        } else if (nameLower.includes('twk') || nameLower.includes('nasionalisme') || nameLower.includes('negara') || nameLower.includes('uud') || nameLower.includes('pancasila') || nameLower.includes('sejarah')) {
                                                            setNewSeksiIcon('bi bi-book');
                                                        } else if (nameLower.includes('tkp') || nameLower.includes('karakter') || nameLower.includes('pribadi') || nameLower.includes('pelayanan') || nameLower.includes('sosial')) {
                                                            setNewSeksiIcon('bi bi-person-badge');
                                                        } else {
                                                            setNewSeksiIcon('bi bi-journal-text');
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Nama Seksi <span className="req">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Contoh: Tes Kemampuan Dasar"
                                                    value={newSeksiTitle}
                                                    onChange={e => setNewSeksiTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Icon</label>
                                                <select
                                                    className="form-select"
                                                    value={newSeksiIcon}
                                                    onChange={e => setNewSeksiIcon(e.target.value)}
                                                >
                                                    <option value="bi bi-journal-text">📝 Ujian Tulis (Journal)</option>
                                                    <option value="bi bi-book">📚 Pengetahuan (Book)</option>
                                                    <option value="bi bi-calculator">🔢 Numerik (Calculator)</option>
                                                    <option value="bi bi-cpu">🧠 Logika (CPU)</option>
                                                    <option value="bi bi-person-badge">❤️ Karakter (Person Badge)</option>
                                                    <option value="bi bi-chat-left-text">💬 Bahasa (Chat)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-grid fg-2" style={{ gap: '12px' }}>
                                            <div className="form-field">
                                                <label className="form-label">Jumlah Soal <span className="req">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newSeksiSoalCount}
                                                    onChange={e => setNewSeksiSoalCount(parseInt(e.target.value) || 0)}
                                                    min="1"
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Durasi (menit) <span className="req">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newSeksiDuration}
                                                    onChange={e => setNewSeksiDuration(parseInt(e.target.value) || 0)}
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-grid fg-3" style={{ gap: '12px' }}>
                                            <div className="form-field">
                                                <label className="form-label">Poin Benar <span className="req">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newSeksiCorrectPoints}
                                                    onChange={e => setNewSeksiCorrectPoints(parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">Poin Salah <span className="req">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={newSeksiIncorrectPoints}
                                                    onChange={e => setNewSeksiIncorrectPoints(parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label className="form-label">
                                                    Passing Grade (Poin) {data.settings.passing_grade_type === 'seksi' && <span className="req">*</span>}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    placeholder="contoh: 65"
                                                    value={newSeksiPassingGrade}
                                                    onChange={e => setNewSeksiPassingGrade(parseInt(e.target.value) || 0)}
                                                    disabled={data.settings.passing_grade_type !== 'seksi'}
                                                    style={data.settings.passing_grade_type !== 'seksi' ? { background: 'var(--surface-2)', cursor: 'not-allowed', color: 'var(--ink-4)' } : {}}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                                            <button
                                                type="button"
                                                className="btn-modal cancel"
                                                style={{ flex: 'none', width: 'auto', padding: '8px 14px' }}
                                                onClick={() => setShowAddSeksiForm(false)}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-modal confirm"
                                                style={{ flex: 'none', width: 'auto', padding: '8px 14px', background: 'var(--indigo)' }}
                                                onClick={handleAddSeksiSubmit}
                                            >
                                                Simpan Seksi
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {data.settings.seksi.length === 0 ? (
                                        <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', color: 'var(--ink-4)', fontSize: '13px' }}>
                                            <i className="bi bi-folder-plus" style={{ fontSize: '24px', display: 'block', marginBottom: '8px', color: 'var(--ink-3)' }}></i>
                                            Belum ada seksi ditambahkan. Klik tombol <strong>+ Tambah Seksi</strong> untuk menambahkan sub-tes baru.
                                        </div>
                                    ) : (
                                        data.settings.seksi.map((s, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 'var(--r-sm)',
                                                    padding: '14px 16px',
                                                    background: 'var(--surface-2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '14px',
                                                }}
                                            >
                                                <div style={{ fontSize: '18px', color: 'var(--indigo)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--indigo-s)', borderRadius: 'var(--r-xs)', flexShrink: 0 }}>
                                                    {renderSeksiIcon(s.icon)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                                                            {s.title}
                                                        </div>
                                                        {s.category_id && (
                                                            <span style={{ fontSize: '10.5px', background: 'var(--indigo-s)', color: 'var(--indigo)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                                                {categories.find(c => c.id === s.category_id)?.name || 'Kategori'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '11.5px', color: 'var(--ink-4)', fontFamily: 'var(--mono)', marginTop: '2px' }}>
                                                        {s.soal_count} soal · {s.duration} menit · +{s.correct_points} benar / -{s.incorrect_points} salah
                                                        {data.settings.passing_grade_type === 'seksi' && ` · PG: ${s.passing_grade || 0} poin`}
                                                    </div>
                                                </div>
                                                <span className={`status-badge ${s.status === 'aktif' ? 'aktif' : 'ended'}`}>
                                                    {s.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="action-btn edit"
                                                    onClick={() => handleSeksiStatusChange(idx)}
                                                    title="Toggle status aktif"
                                                >
                                                    🔄
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-btn danger"
                                                    onClick={() => handleRemoveSeksi(idx)}
                                                    title="Hapus seksi"
                                                    style={{ marginLeft: '4px' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div style={{ background: 'var(--indigo-s)', border: '1px dashed rgba(79,70,229,0.25)', borderRadius: 'var(--r-sm)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ fontSize: '18px' }}>💡</div>
                                    <div style={{ fontSize: '12px', color: 'var(--indigo)' }}>
                                        Soal dipilih dari Bank Soal setelah ujian disimpan. Klik <strong>Pilih Soal</strong> pada halaman detail ujian untuk mengatur paket soal tiap seksi.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Peserta */}
                        {currentStep === 4 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-grid" style={{ gap: '16px' }}>
                                    <div className="form-field">
                                        <label className="form-label">Cara Tambah Peserta</label>
                                        <select
                                            className="form-select"
                                            value={data.settings.participant_method || 'Pilih dari daftar pengguna'}
                                            onChange={e => handleSettingChange('participant_method', e.target.value)}
                                        >
                                            <option value="Pilih dari daftar pengguna">Pilih dari daftar pengguna</option>
                                            <option value="Import dari Excel">Import dari Excel</option>
                                            <option value="Buka untuk umum (tanpa login)">Buka untuk umum (tanpa login)</option>
                                            <option value="Generate kode akses otomatis">Generate kode akses otomatis</option>
                                        </select>
                                    </div>
                                    <div className="form-grid fg-2" style={{ gap: '16px' }}>
                                        <div className="form-field">
                                            <label className="form-label">Filter Institusi</label>
                                            <select
                                                className="form-select"
                                                value={data.settings.filter_institution || 'Semua institusi'}
                                                onChange={e => handleSettingChange('filter_institution', e.target.value)}
                                            >
                                                <option value="Semua institusi">Semua institusi</option>
                                                <option value="BKPSDM Kota Pekalongan">BKPSDM Kota Pekalongan</option>
                                                <option value="Dinas Pendidikan">Dinas Pendidikan</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Kuota Peserta</label>
                                            <input
                                                className="form-input"
                                                type="number"
                                                placeholder="0 = tidak terbatas"
                                                value={data.settings.quota || ''}
                                                onChange={e => handleSettingChange('quota', parseInt(e.target.value) || 0)}
                                            />
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        )}

                    </div>

                    <div className="modal-foot" style={{ padding: '16px 24px', flexShrink: 0 }}>
                        {currentStep > 1 && (
                            <button key="btn-prev" type="button" className="btn-modal cancel" onClick={prevStep} style={{ flex: 'none', width: 'auto' }}>
                                ← Sebelumnya
                            </button>
                        )}
                        <button key="btn-cancel" type="button" className="btn-modal cancel" onClick={onClose} disabled={processing} style={{ flex: 'none', width: 'auto' }}>
                            Batal
                        </button>
                        {currentStep < 4 ? (
                            <button
                                key="btn-next"
                                type="button"
                                className="btn-modal confirm"
                                onClick={nextStep}
                                style={{ flex: 'none', width: 'auto', background: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                Lanjut →
                            </button>
                        ) : (
                            <button
                                key="btn-submit"
                                type="submit"
                                className="btn-modal confirm"
                                disabled={processing}
                                style={{ flex: 'none', width: 'auto', background: 'var(--indigo)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                {processing ? (
                                    <>
                                        <span className="spinner" style={{ width: 14, height: 14 }} />
                                        Menyimpan...
                                    </>
                                ) : (
                                    exam ? (
                                        <>
                                            <i className="bi bi-check-circle"></i> Perbarui Ujian
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-floppy"></i> Simpan Ujian
                                        </>
                                    )
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
