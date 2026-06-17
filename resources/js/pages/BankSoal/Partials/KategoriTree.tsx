import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    icon?: string;
    questions_count?: number;
    children?: Category[];
}

interface KategoriTreeProps {
    categories: Category[];
    selectedCategoryId: string | null;
    onAddCategoryClick: () => void;
}

export default function KategoriTree({
    categories,
    selectedCategoryId,
    onAddCategoryClick
}: KategoriTreeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

    const renderCategoryIcon = (iconStr?: string, defaultEmoji = '📁') => {
        if (!iconStr) return <span className="tree-icon">{defaultEmoji}</span>;
        if (iconStr.startsWith('bi-') || iconStr.startsWith('bi ')) {
            return <i className={`bi ${iconStr}`} style={{ fontSize: '13.5px', marginRight: '6px', color: 'var(--indigo)', flexShrink: 0 }}></i>;
        }
        return <span className="tree-icon">{iconStr}</span>;
    };

    // Build hierarchical tree
    const rootCategories = categories.filter(c => !c.parent_id);
    const getChildren = (parentId: string) => categories.filter(c => c.parent_id === parentId);

    const toggleExpand = (parentId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedParents(prev => ({
            ...prev,
            [parentId]: !prev[parentId]
        }));
    };

    const handleSelectCategory = (categoryId: string | null) => {
        const queryParams: Record<string, any> = {};
        const urlParams = new URLSearchParams(window.location.search);
        
        // Preserve other filters
        urlParams.forEach((value, key) => {
            if (key !== 'page') {
                queryParams[key] = value;
            }
        });

        if (categoryId) {
            queryParams.category_id = categoryId;
        } else {
            delete queryParams.category_id;
        }

        router.get(route('bank-soal.index'), queryParams, {
            preserveState: true,
            replace: true
        });
    };

    // Filter categories by search query
    const matchesSearch = (cat: Category): boolean => {
        if (!searchQuery) return true;
        const selfMatch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (selfMatch) return true;
        
        // Check children
        const children = getChildren(cat.id);
        return children.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    return (
        <div className="tree-card anim-in">
            <div className="tree-head">
                <span className="tree-head-title">Kategori Soal</span>
                <button 
                    type="button" 
                    className="tree-add-btn" 
                    title="Tambah Kategori"
                    onClick={onAddCategoryClick}
                >
                    +
                </button>
            </div>
            
            <div className="tree-search-wrap">
                <span>🔍</span>
                <input 
                    type="text" 
                    placeholder="Cari kategori..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="tree-body">
                <button
                    type="button"
                    className={`tree-item l1 ${!selectedCategoryId ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(null)}
                >
                    <span className="tree-icon">📂</span>
                    <span>Semua Kategori</span>
                    <span className="tree-count">
                        {categories.reduce((acc, cat) => acc + (cat.questions_count || 0), 0)}
                    </span>
                </button>

                {rootCategories.filter(matchesSearch).map(parent => {
                    const children = getChildren(parent.id);
                    const hasChildren = children.length > 0;
                    const isExpanded = !!expandedParents[parent.id];
                    const isSelected = selectedCategoryId === parent.id;

                    return (
                        <div key={parent.id}>
                            <button
                                type="button"
                                className={`tree-item l1 ${isSelected ? 'active' : ''}`}
                                onClick={() => handleSelectCategory(parent.id)}
                            >
                                {hasChildren && (
                                    <span 
                                        className={`tree-chev ${isExpanded ? 'open' : ''}`}
                                        onClick={(e) => toggleExpand(parent.id, e)}
                                        style={{ marginRight: 4, cursor: 'pointer' }}
                                    >
                                        ▶
                                    </span>
                                )}
                                {renderCategoryIcon(parent.icon, '📁')}
                                <span>{parent.name}</span>
                                <span className="tree-count">
                                    {parent.questions_count || 0}
                                </span>
                            </button>

                            {hasChildren && isExpanded && children.map(child => {
                                const isChildSelected = selectedCategoryId === child.id;
                                return (
                                    <button
                                        key={child.id}
                                        type="button"
                                        className={`tree-item l2 ${isChildSelected ? 'active' : ''}`}
                                        onClick={() => handleSelectCategory(child.id)}
                                    >
                                        {renderCategoryIcon(child.icon, '📄')}
                                        <span>{child.name}</span>
                                        <span className="tree-count">{child.questions_count || 0}</span>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
