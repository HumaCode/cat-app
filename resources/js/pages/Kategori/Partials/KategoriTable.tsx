import { CategoryItem } from './KategoriFormModal';
import { renderCategoryIcon } from '@/lib/categoryIcons';

interface Props {
    categories: CategoryItem[];
    onEdit: (cat: CategoryItem) => void;
    onDelete: (cat: CategoryItem) => void;
    currentUserId: string;
    userRole: string;
    startIndex?: number;
    allCategories?: CategoryItem[];
}

export default function KategoriTable({ categories, onEdit, onDelete, currentUserId, userRole, startIndex = 0, allCategories }: Props) {
    const isDev = userRole === 'dev';

    const canModify = (cat: CategoryItem) =>
        isDev || cat.user_id === null || cat.user_id === currentUserId;

    // Build parent lookup map
    const parentMap: Record<string, string> = {};
    const lookupSource = allCategories || categories;
    lookupSource.forEach(c => { parentMap[c.id] = c.name; });

    if (categories.length === 0) {
        return (
            <div className="kat-empty">
                <div className="kat-empty-icon"><i className="bi bi-tags" /></div>
                <div className="kat-empty-title">Belum ada kategori</div>
                <div className="kat-empty-desc">Klik "Tambah Kategori" untuk membuat kategori baru.</div>
            </div>
        );
    }

    return (
        <table className="kat-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Kategori</th>
                    <th>Induk</th>
                    <th>Icon</th>
                    <th>Soal</th>
                    <th>Pemilik</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((cat, idx) => (
                    <tr key={cat.id}>
                        <td style={{ color: 'var(--ink-4)', width: 40 }}>{startIndex + idx + 1}</td>
                        <td>
                            <div className="kat-name-cell">
                                <div className="kat-icon-preview">
                                    {renderCategoryIcon(cat.icon)}
                                </div>
                                <div>
                                    <div className="kat-name-main">{cat.name}</div>
                                    {cat.parent_id && (
                                        <div className="kat-name-sub">Sub-kategori</div>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td>
                            {cat.parent_id
                                ? <span className="kat-parent-chip"><i className="bi bi-diagram-2" /> {parentMap[cat.parent_id] || '—'}</span>
                                : <span style={{ color: 'var(--ink-4)', fontSize: 12 }}>—</span>
                            }
                        </td>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-4)' }}>
                                {renderCategoryIcon(cat.icon)}
                                <code style={{ fontSize: 10.5, background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 4 }}>
                                    {cat.icon || '—'}
                                </code>
                            </div>
                        </td>
                        <td>
                            <span className={`kat-count-badge ${!cat.questions_count ? 'zero' : ''}`}>
                                {cat.questions_count ?? 0}
                            </span>
                        </td>
                        <td>
                            {cat.user_id
                                ? <span style={{ fontSize: 11.5, color: 'var(--indigo)', background: 'var(--indigo-s)', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>
                                    <i className="bi bi-person-fill" /> Saya
                                  </span>
                                : <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Global</span>
                            }
                        </td>
                        <td>
                            <div className="kat-actions">
                                <button
                                    type="button"
                                    className="kat-btn-icon"
                                    title="Edit"
                                    onClick={() => onEdit(cat)}
                                    disabled={!canModify(cat)}
                                    style={{ opacity: canModify(cat) ? 1 : 0.35, cursor: canModify(cat) ? 'pointer' : 'not-allowed' }}
                                >
                                    <i className="bi bi-pencil-fill" />
                                </button>
                                <button
                                    type="button"
                                    className="kat-btn-icon danger"
                                    title="Hapus"
                                    onClick={() => onDelete(cat)}
                                    disabled={!canModify(cat)}
                                    style={{ opacity: canModify(cat) ? 1 : 0.35, cursor: canModify(cat) ? 'pointer' : 'not-allowed' }}
                                >
                                    <i className="bi bi-trash3-fill" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
