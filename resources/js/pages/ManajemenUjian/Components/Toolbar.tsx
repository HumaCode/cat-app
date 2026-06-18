import React from 'react';

interface ToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    currentTab: string;
    onTabChange: (tab: string) => void;
    typeFilter: string;
    onTypeChange: (val: string) => void;
    currentView: 'table' | 'grid';
    onViewChange: (view: 'table' | 'grid') => void;
    stats: {
        total: number;
        aktif: number;
        terjadwal: number;
        draft: number;
        selesai: number;
    };
}

export default function Toolbar({
    search,
    onSearchChange,
    currentTab,
    onTabChange,
    typeFilter,
    onTypeChange,
    currentView,
    onViewChange,
    stats,
}: ToolbarProps) {
    return (
        <div className="toolbar" style={{ marginBottom: '14px' }}>
            {/* Status Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${currentTab === 'semua' ? 'active' : ''}`}
                    onClick={() => onTabChange('semua')}
                >
                    Semua <span className="tab-count">{stats.total}</span>
                </button>
                <button
                    className={`filter-tab ${currentTab === 'aktif' ? 'active' : ''}`}
                    onClick={() => onTabChange('aktif')}
                >
                    Aktif <span className="tab-count">{stats.aktif}</span>
                </button>
                <button
                    className={`filter-tab ${currentTab === 'terjadwal' ? 'active' : ''}`}
                    onClick={() => onTabChange('terjadwal')}
                >
                    Terjadwal <span className="tab-count">{stats.terjadwal}</span>
                </button>
                <button
                    className={`filter-tab ${currentTab === 'draft' ? 'active' : ''}`}
                    onClick={() => onTabChange('draft')}
                >
                    Draft <span className="tab-count">{stats.draft}</span>
                </button>
                <button
                    className={`filter-tab ${currentTab === 'selesai' ? 'active' : ''}`}
                    onClick={() => onTabChange('selesai')}
                >
                    Selesai <span className="tab-count">{stats.selesai}</span>
                </button>
            </div>

            {/* Right-aligned actions (Type filter + View switcher) */}
            <div className="toolbar-right">
                <select
                    className="select-filter"
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                >
                    <option value="">Semua Tipe</option>
                    <option value="Simulasi">Simulasi</option>
                    <option value="Latihan">Latihan</option>
                    <option value="Resmi">Resmi</option>
                </select>

                <div className="view-toggle">
                    <button
                        className={`view-btn ${currentView === 'table' ? 'active' : ''}`}
                        onClick={() => onViewChange('table')}
                        title="Tampilan tabel"
                    >
                        ☰
                    </button>
                    <button
                        className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
                        onClick={() => onViewChange('grid')}
                        title="Tampilan kartu"
                    >
                        ⊞
                    </button>
                </div>
            </div>
        </div>
    );
}
