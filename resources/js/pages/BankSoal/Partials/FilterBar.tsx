import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface FilterBarProps {
    filters: {
        type?: string;
        difficulty?: string;
        search?: string;
    };
    viewMode: 'list' | 'grid';
    setViewMode: (mode: 'list' | 'grid') => void;
    onImportClick: () => void;
    onAddClick: () => void;
}

export default function FilterBar({
    filters,
    viewMode,
    setViewMode,
    onImportClick,
    onAddClick
}: FilterBarProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Synchronize local search term with filter prop
    useEffect(() => {
        setSearchTerm(filters.search || '');
    }, [filters.search]);

    const handleFilterChange = (key: string, value: string | null) => {
        const queryParams: Record<string, any> = {};
        const urlParams = new URLSearchParams(window.location.search);
        
        // Preserve other filters
        urlParams.forEach((val, k) => {
            if (k !== 'page') {
                queryParams[k] = val;
            }
        });

        if (value && value !== 'Semua' && value !== 'Semua level') {
            queryParams[key] = value;
        } else {
            delete queryParams[key];
        }

        router.get(route('bank-soal.index'), queryParams, {
            preserveState: true,
            replace: true
        });
    };

    // Debounce typing in the search bar
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleFilterChange('search', searchTerm);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchTerm);
    };

    return (
        <div className="filter-bar anim-in d1">
            <div className="tab-pills">
                <button
                    type="button"
                    className={`tab-pill ${!filters.type || filters.type === 'Semua' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', null)}
                >
                    Semua
                </button>
                <button
                    type="button"
                    className={`tab-pill ${filters.type === 'pg' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', 'pg')}
                >
                    Pilihan Ganda
                </button>
                <button
                    type="button"
                    className={`tab-pill ${filters.type === 'essay' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', 'essay')}
                >
                    Essay
                </button>
                <button
                    type="button"
                    className={`tab-pill ${filters.type === 'lainnya' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', 'lainnya')}
                >
                    Lainnya
                </button>
            </div>

            <div className="filter-divider"></div>

            <select
                className="filter-select"
                value={filters.difficulty || 'Semua level'}
                onChange={e => handleFilterChange('difficulty', e.target.value)}
            >
                <option value="Semua level">Semua level</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
            </select>

            <div className="filter-spacer"></div>

            <form onSubmit={handleSearchSubmit} className="filter-search">
                <input
                    type="text"
                    placeholder="Cari teks soal..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    🔍
                </button>
            </form>

            <div className="view-toggle">
                <button
                    type="button"
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                >
                    ☰
                </button>
                <button
                    type="button"
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                >
                    田
                </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginLeft: '4px', flexShrink: 0 }}>
                <button
                    type="button"
                    className="btn-modal cancel"
                    onClick={onImportClick}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        padding: '0 12px',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        height: '32px',
                        borderRadius: 'var(--r-xs)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    📥 Import
                </button>
                <button
                    type="button"
                    className="btn-modal confirm"
                    onClick={onAddClick}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'var(--indigo)',
                        color: '#fff',
                        border: 'none',
                        padding: '0 12px',
                        fontWeight: 600,
                        fontSize: '12.5px',
                        height: '32px',
                        borderRadius: 'var(--r-xs)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    + Buat Soal
                </button>
            </div>
        </div>
    );
}
