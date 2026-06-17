import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    icon?: string;
}

interface KategoriModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

const BOOTSTRAP_ICONS = [
    { class: 'bi-folder', name: 'Folder' },
    { class: 'bi-book', name: 'Buku' },
    { class: 'bi-journal-text', name: 'Jurnal' },
    { class: 'bi-brain', name: 'Otak / Logika' },
    { class: 'bi-calculator', name: 'Kalkulator' },
    { class: 'bi-award', name: 'Penghargaan' },
    { class: 'bi-file-earmark-text', name: 'Dokumen' },
    { class: 'bi-stars', name: 'Bintang' },
    { class: 'bi-translate', name: 'Bahasa' },
    { class: 'bi-person-badge', name: 'Profil' },
    { class: 'bi-gear', name: 'Pengaturan' },
    { class: 'bi-chat-left-text', name: 'Obrolan' },
    { class: 'bi-mortarboard', name: 'Pendidikan' },
    { class: 'bi-heart', name: 'Kesehatan' },
    { class: 'bi-puzzle', name: 'Teka-Teki' },
    { class: 'bi-compass', name: 'Kompas' },
    { class: 'bi-calendar-event', name: 'Kalender' },
    { class: 'bi-geo-alt', name: 'Lokasi' },
    { class: 'bi-globe', name: 'Dunia' },
    { class: 'bi-shield-check', name: 'Keamanan' },
    { class: 'bi-bank', name: 'Bank / Pemda' },
    { class: 'bi-clock', name: 'Waktu' },
    { class: 'bi-flag', name: 'Bendera' },
    { class: 'bi-lightbulb', name: 'Ide' },
    { class: 'bi-trophy', name: 'Juara' },
    { class: 'bi-graph-up', name: 'Analisis' },
    { class: 'bi-pencil', name: 'Tulis' },
    { class: 'bi-laptop', name: 'Laptop / TI' },
    { class: 'bi-activity', name: 'Aktivitas' },
    { class: 'bi-palette', name: 'Seni' }
];

export default function KategoriModal({
    isOpen,
    onClose,
    categories
}: KategoriModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        parent_id: '',
        icon: '📁',
    });

    const [iconSearch, setIconSearch] = useState('');

    useEffect(() => {
        if (!isOpen) {
            reset();
            setIconSearch('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bank-soal.categories.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    // Filter only top level categories as potential parents
    const parentCategories = categories.filter(c => !c.parent_id);

    const filteredIcons = BOOTSTRAP_ICONS.filter(item => 
        item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        item.class.toLowerCase().includes(iconSearch.toLowerCase())
    );

    return createPortal(
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-card" style={{ maxWidth: '460px', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-2)', flexShrink: 0 }}>
                    <h3 className="modal-title" style={{ margin: 0 }}>Tambah Kategori</h3>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="modal-body" style={{ padding: '24px', overflowY: 'auto' }}>
                        <div className="form-grid" style={{ gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label">Nama Kategori <span className="req">*</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Contoh: Nasionalisme, Kemampuan Verbal"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.name}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-label">Kategori Induk (Parent) <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>(Opsional)</span></label>
                                <select
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={e => setData('parent_id', e.target.value)}
                                    {...({} as any)}
                                >
                                    <option value="">-- Tanpa Induk (Kategori Utama) --</option>
                                    {parentCategories.map(cat => {
                                        const isBiIcon = cat.icon && (cat.icon.startsWith('bi-') || cat.icon.startsWith('bi '));
                                        return (
                                            <option key={cat.id} value={cat.id}>
                                                {isBiIcon ? '📁' : (cat.icon || '📁')} {cat.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.parent_id && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.parent_id}</span>}
                            </div>

                            <div className="form-field">
                                <label className="form-label">Emoji / Icon <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>(Opsional)</span></label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: 'var(--r-sm)',
                                        border: '1px solid var(--border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--surface-2)',
                                        fontSize: '18px',
                                        color: 'var(--indigo)',
                                        flexShrink: 0
                                    }}>
                                        {data.icon && (data.icon.startsWith('bi-') || data.icon.startsWith('bi ')) ? (
                                            <i className={`bi ${data.icon}`}></i>
                                        ) : (
                                            data.icon || '📁'
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ketik emoji atau pilih icon di bawah..."
                                        value={data.icon}
                                        onChange={e => setData('icon', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>

                                <div style={{
                                    border: '1px solid var(--border-2)',
                                    borderRadius: 'var(--r-sm)',
                                    padding: '12px',
                                    background: 'var(--bg-2)',
                                    marginTop: '8px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', padding: '4px 8px', borderRadius: '6px', border: '1.5px solid var(--border)', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '12px', opacity: 0.5 }}>🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Cari icon..."
                                            value={iconSearch}
                                            onChange={e => setIconSearch(e.target.value)}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                fontSize: '12px',
                                                color: 'var(--ink)',
                                                outline: 'none',
                                                width: '100%',
                                                padding: '2px 0'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '6px',
                                        maxHeight: '130px',
                                        overflowY: 'auto',
                                        paddingRight: '4px'
                                    }}>
                                        {filteredIcons.map(item => (
                                            <button
                                                key={item.class}
                                                type="button"
                                                onClick={() => setData('icon', item.class)}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '8px 4px',
                                                    borderRadius: '6px',
                                                    border: data.icon === item.class ? '1.5px solid var(--indigo)' : '1px solid var(--border-2)',
                                                    background: data.icon === item.class ? 'rgba(79, 70, 229, 0.08)' : 'var(--surface)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s'
                                                }}
                                            >
                                                <i className={`bi ${item.class}`} style={{ fontSize: '16px', color: data.icon === item.class ? 'var(--indigo)' : 'var(--ink-2)' }}></i>
                                                <span style={{ fontSize: '9px', color: 'var(--ink-4)', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {errors.icon && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.icon}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="modal-foot" style={{ padding: '16px 24px', flexShrink: 0 }}>
                        <button type="button" className="btn-modal cancel" onClick={onClose} style={{ flex: 'none', width: 'auto' }}>
                            Batal
                        </button>
                        <button type="submit" className="btn-modal confirm" disabled={processing} style={{ flex: 'none', width: 'auto', background: 'var(--indigo)' }}>
                            {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
