import { useState } from 'react';

export default function QuestionTypes() {
    const [activeTab, setActiveTab] = useState<'pg' | 'essay' | 'matching' | 'ordering'>('pg');
    const [selectedPg, setSelectedPg] = useState<string>('A');

    return (
        <section className="qtypes-section" id="tipe-soal">
            <div className="container">
                <div className="qtypes-inner">
                    <div className="qtypes-text reveal visible">
                        <div className="section-label">Ragam Soal</div>
                        <h2 className="section-title">9 tipe soal untuk semua kebutuhan asesmen</h2>
                        <p className="section-desc" style={{ marginBottom: 32 }}>
                            Tidak terbatas pada pilihan ganda biasa. CAT System mendukung soal interaktif, media-rich,
                            hingga essay dengan penilaian manual oleh pengajar.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <span style={{ color: '#34D399', fontSize: 16 }}>✓</span> Soal audio & video untuk ujian bahasa
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <span style={{ color: '#34D399', fontSize: 16 }}>✓</span> Essay dengan penilaian manual & catatan penilai
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <span style={{ color: '#34D399', fontSize: 16 }}>✓</span> Soal menjodohkan drag-and-drop interaktif
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <span style={{ color: '#34D399', fontSize: 16 }}>✓</span> Puzzle urutan / ordering untuk logika prosedural
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <span style={{ color: '#34D399', fontSize: 16 }}>✓</span> Poin per soal dapat dikustomisasi
                            </div>
                        </div>
                    </div>

                    <div className="qtypes-demo reveal visible">
                        <div className="qtype-tab-bar">
                            <button
                                className={`qtype-tab ${activeTab === 'pg' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pg')}
                            >
                                Pilihan Ganda
                            </button>
                            <button
                                className={`qtype-tab ${activeTab === 'essay' ? 'active' : ''}`}
                                onClick={() => setActiveTab('essay')}
                            >
                                Essay
                            </button>
                            <button
                                className={`qtype-tab ${activeTab === 'matching' ? 'active' : ''}`}
                                onClick={() => setActiveTab('matching')}
                            >
                                Menjodohkan
                            </button>
                            <button
                                className={`qtype-tab ${activeTab === 'ordering' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ordering')}
                            >
                                Urutan
                            </button>
                        </div>
                        <div className="qtype-content">
                            {/* PG */}
                            {activeTab === 'pg' && (
                                <div className="qtype-panel active" id="panel-pg">
                                    <div className="qtype-soal">Manakah dari berikut yang BUKAN termasuk unsur-unsur Negara menurut teori Konvensional?</div>
                                    <div className="pg-options">
                                        {[
                                            { key: 'A', text: 'Rakyat' },
                                            { key: 'B', text: 'Wilayah' },
                                            { key: 'C', text: 'Pemerintah yang Berdaulat' },
                                            { key: 'D', text: 'Kemakmuran Ekonomi' },
                                        ].map((opt) => (
                                            <div
                                                key={opt.key}
                                                className={`pg-option ${selectedPg === opt.key ? 'sel' : ''}`}
                                                onClick={() => setSelectedPg(opt.key)}
                                            >
                                                <div className="pg-letter">{opt.key}</div> {opt.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Essay */}
                            {activeTab === 'essay' && (
                                <div className="qtype-panel active" id="panel-essay">
                                    <div className="qtype-soal">Jelaskan peran teknologi informasi dalam meningkatkan efisiensi pelayanan publik di era digital. Berikan minimal 3 contoh nyata!</div>
                                    <textarea
                                        className="essay-area"
                                        defaultValue="Teknologi informasi telah berperan besar dalam transformasi pelayanan publik. Pertama, sistem e-government memungkinkan masyarakat mengakses layanan tanpa..."
                                        placeholder="Tuliskan jawaban Anda di sini..."
                                    />
                                    <div className="essay-meta">
                                        <span>Min. 200 kata</span>
                                        <span>147 / 500 kata</span>
                                    </div>
                                    <div style={{ marginTop: 10, padding: 10, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 12, color: '#FCD34D' }}>
                                        📝 Soal ini akan dinilai secara manual oleh pengajar
                                    </div>
                                </div>
                            )}

                            {/* Matching */}
                            {activeTab === 'matching' && (
                                <div className="qtype-panel active" id="panel-matching">
                                    <div className="qtype-soal">Jodohkan istilah berikut dengan definisinya yang tepat!</div>
                                    <div className="match-grid">
                                        <div>
                                            <div className="match-col-label">Istilah</div>
                                            <div className="match-item">Demokrasi</div>
                                            <div className="match-item matched">Legislatif</div>
                                            <div className="match-item">Yudikatif</div>
                                            <div className="match-item">Federalisme</div>
                                        </div>
                                        <div>
                                            <div className="match-col-label">Definisi</div>
                                            <div className="match-item">Lembaga pembuat undang-undang</div>
                                            <div className="match-item matched">Kedaulatan rakyat</div>
                                            <div className="match-item">Sistem pemerintahan negara bagian</div>
                                            <div className="match-item">Lembaga penegak hukum</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Ordering */}
                            {activeTab === 'ordering' && (
                                <div className="qtype-panel active" id="panel-ordering">
                                    <div className="qtype-soal">Urutkan tahapan proses legislasi berikut dari awal hingga akhir!</div>
                                    <div className="order-list">
                                        <div className="order-item">
                                            <span className="order-handle">⠿</span>
                                            <div className="order-num">1</div>
                                            <span>Pengajuan Rancangan Undang-Undang (RUU)</span>
                                        </div>
                                        <div className="order-item">
                                            <span className="order-handle">⠿</span>
                                            <div className="order-num">2</div>
                                            <span>Pembahasan di DPR bersama Pemerintah</span>
                                        </div>
                                        <div className="order-item">
                                            <span className="order-handle">⠿</span>
                                            <div className="order-num">3</div>
                                            <span>Persetujuan dan Pengesahan oleh Presiden</span>
                                        </div>
                                        <div className="order-item">
                                            <span className="order-handle">⠿</span>
                                            <div className="order-num">4</div>
                                            <span>Pengundangan dalam Lembaran Negara</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
