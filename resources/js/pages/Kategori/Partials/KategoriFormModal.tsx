import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BOOTSTRAP_ICONS } from '@/lib/categoryIcons';

export interface CategoryItem {
    id: string;
    parent_id: string | null;
    user_id: string | null;
    name: string;
    icon?: string;
    questions_count?: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryItem[];
    /** When provided, the modal operates in "edit" mode. */
    editCategory?: CategoryItem | null;
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function KategoriFormModal({ isOpen, onClose, categories, editCategory, showToast }: Props) {
    const isEdit = !!editCategory;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:      editCategory?.name      ?? '',
        parent_id: editCategory?.parent_id ?? '',
        icon:      editCategory?.icon      ?? 'bi-folder',
    });

    const [iconSearch, setIconSearch] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    // Sync form when editCategory changes
    useEffect(() => {
        if (isOpen) {
            setData({
                name:      editCategory?.name      ?? '',
                parent_id: editCategory?.parent_id ?? '',
                icon:      editCategory?.icon      ?? 'bi-folder',
            });
            setIconSearch('');
        } else {
            reset();
            setIconSearch('');
        }
    }, [isOpen, editCategory?.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('kategori.update', { id: editCategory!.id }), {
                onSuccess: () => { 
                    reset(); 
                    onClose(); 
                    showToast('Kategori berhasil diperbarui', 'success');
                },
                onError: () => {
                    showToast('Gagal memperbarui kategori. Periksa kembali inputan Anda.', 'error');
                }
            });
        } else {
            post(route('kategori.store'), {
                onSuccess: () => { 
                    reset(); 
                    onClose(); 
                    showToast('Kategori berhasil ditambahkan', 'success');
                },
                onError: () => {
                    showToast('Gagal menambahkan kategori. Periksa kembali inputan Anda.', 'error');
                }
            });
        }
    };

    if (!isMounted || !isOpen) return null;

    const parentOptions = categories.filter(c => !c.parent_id && c.id !== editCategory?.id);
    const filteredIcons = BOOTSTRAP_ICONS.filter(i =>
        i.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
        i.class.toLowerCase().includes(iconSearch.toLowerCase())
    );

    const isBiIcon = (val?: string) => val && (val.startsWith('bi-') || val.startsWith('bi '));

    return createPortal(
        <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
            <div
                className="modal-card"
                style={{ maxWidth: '480px', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-2)', flexShrink: 0 }}>
                    <h3 className="modal-title" style={{ margin: 0 }}>
                        {isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h3>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="modal-body" style={{ padding: '24px', overflowY: 'auto' }}>
                        <div className="form-grid" style={{ gap: '16px' }}>

                            {/* Name */}
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

                            {/* Parent */}
                            <div className="form-field">
                                <label className="form-label">Kategori Induk <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>(Opsional)</span></label>
                                <select
                                    className="form-select"
                                    value={data.parent_id}
                                    onChange={e => setData('parent_id', e.target.value)}
                                >
                                    <option value="">-- Tanpa Induk (Kategori Utama) --</option>
                                    {parentOptions.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {isBiIcon(cat.icon) ? '📁' : (cat.icon || '📁')} {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.parent_id}</span>}
                            </div>

                            {/* Icon */}
                            <div className="form-field">
                                <label className="form-label">Icon <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>(Opsional)</span></label>

                                {/* Preview + text input */}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 'var(--r-sm)',
                                        border: '1px solid var(--border)', background: 'var(--surface-2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18, color: 'var(--indigo)', flexShrink: 0
                                    }}>
                                        {isBiIcon(data.icon)
                                            ? <i className={`bi ${data.icon}`} />
                                            : (data.icon || '📁')}
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

                                {/* Searchable icon grid */}
                                <div className="kat-icon-picker">
                                    <div className="kat-icon-search">
                                        <i className="bi bi-search" style={{ fontSize: 12, opacity: 0.45 }} />
                                        <input
                                            type="text"
                                            placeholder="Cari icon..."
                                            value={iconSearch}
                                            onChange={e => setIconSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="kat-icon-grid">
                                        {filteredIcons.map(item => (
                                            <button
                                                key={item.class}
                                                type="button"
                                                className={`kat-icon-btn ${data.icon === item.class ? 'selected' : ''}`}
                                                onClick={() => setData('icon', item.class)}
                                            >
                                                <i className={`bi ${item.class}`} />
                                                <span className="kat-icon-label">{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {errors.icon && <span style={{ color: 'var(--rose)', fontSize: '11px' }}>{errors.icon}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-foot" style={{ padding: '16px 24px', flexShrink: 0 }}>
                        <button type="button" className="btn-modal cancel" onClick={onClose} style={{ flex: 'none', width: 'auto' }}>
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="btn-modal confirm" 
                            disabled={processing} 
                            style={{ 
                                flex: 'none', 
                                width: 'auto', 
                                background: 'var(--indigo)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            {processing ? (
                                <>
                                    <span className="spinner" style={{ width: 14, height: 14 }} />
                                    Sedang Proses...
                                </>
                            ) : (
                                isEdit ? 'Simpan Perubahan' : 'Tambah Kategori'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
