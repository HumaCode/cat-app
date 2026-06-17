/**
 * Shared Bootstrap icon list for Kategori icon pickers.
 */
export const BOOTSTRAP_ICONS = [
    { class: 'bi-folder',           name: 'Folder' },
    { class: 'bi-book',             name: 'Buku' },
    { class: 'bi-journal-text',     name: 'Jurnal' },
    { class: 'bi-brain',            name: 'Otak / Logika' },
    { class: 'bi-calculator',       name: 'Kalkulator' },
    { class: 'bi-award',            name: 'Penghargaan' },
    { class: 'bi-file-earmark-text',name: 'Dokumen' },
    { class: 'bi-stars',            name: 'Bintang' },
    { class: 'bi-translate',        name: 'Bahasa' },
    { class: 'bi-person-badge',     name: 'Profil' },
    { class: 'bi-gear',             name: 'Pengaturan' },
    { class: 'bi-chat-left-text',   name: 'Obrolan' },
    { class: 'bi-mortarboard',      name: 'Pendidikan' },
    { class: 'bi-heart',            name: 'Kesehatan' },
    { class: 'bi-puzzle',           name: 'Teka-Teki' },
    { class: 'bi-compass',          name: 'Kompas' },
    { class: 'bi-calendar-event',   name: 'Kalender' },
    { class: 'bi-geo-alt',          name: 'Lokasi' },
    { class: 'bi-globe',            name: 'Dunia' },
    { class: 'bi-shield-check',     name: 'Keamanan' },
    { class: 'bi-bank',             name: 'Bank / Pemda' },
    { class: 'bi-clock',            name: 'Waktu' },
    { class: 'bi-flag',             name: 'Bendera' },
    { class: 'bi-lightbulb',        name: 'Ide' },
    { class: 'bi-trophy',           name: 'Juara' },
    { class: 'bi-graph-up',         name: 'Analisis' },
    { class: 'bi-pencil',           name: 'Tulis' },
    { class: 'bi-laptop',           name: 'Laptop / TI' },
    { class: 'bi-activity',         name: 'Aktivitas' },
    { class: 'bi-palette',          name: 'Seni' },
    { class: 'bi-tags',             name: 'Tag / Label' },
    { class: 'bi-layers',           name: 'Kategori' },
    { class: 'bi-collection',       name: 'Koleksi' },
    { class: 'bi-grid',             name: 'Grid / Modul' },
];

/**
 * Render a category icon string:
 * - If it starts with 'bi-' or 'bi ', render as Bootstrap Icon class.
 * - Otherwise render raw (emoji, text, etc.)
 */
export function renderCategoryIcon(
    iconStr: string | undefined,
    defaultEmoji = '📁',
    style: React.CSSProperties = {}
): React.ReactNode {
    if (!iconStr) return <span className="tree-icon">{defaultEmoji}</span>;
    if (iconStr.startsWith('bi-') || iconStr.startsWith('bi ')) {
        return (
            <i
                className={`bi ${iconStr}`}
                style={{ fontSize: '14px', color: 'var(--indigo)', flexShrink: 0, ...style }}
            />
        );
    }
    return <span style={{ flexShrink: 0, ...style }}>{iconStr}</span>;
}
