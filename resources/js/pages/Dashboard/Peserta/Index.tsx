import PesertaLayout from '@/Layouts/PesertaLayout';
import HeroBanner from './Partials/HeroBanner';
import StatsStrip from './Partials/StatsStrip';
import MotivationBanner from './Partials/MotivationBanner';
import OngoingExamCard from './Partials/OngoingExamCard';
import AvailableExamCard from './Partials/AvailableExamCard';
import ScheduleWidget from './Partials/ScheduleWidget';
import ScoreWidget from './Partials/ScoreWidget';
import HistoryTable from './Partials/HistoryTable';

interface PesertaDashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
        instansi?: string;
        jabatan?: string;
    };
    stats: {
        total_selesai: number;
        total_lulus: number;
        skor_tertinggi: number;
        ranking: string;
        avg_score: number;
    };
    ongoingExam: any;
    availableExams: any[];
    schedule: any[];
    categoryScores: any[];
    achievements: any[];
    history: any[];
    isRegistered: boolean;
}

export default function PesertaDashboard({
    user,
    stats,
    ongoingExam,
    availableExams,
    schedule,
    categoryScores,
    achievements,
    history,
    isRegistered,
}: PesertaDashboardProps) {
    // Get user initials
    const nameParts = user.name.split(' ');
    const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
        : user.name.slice(0, 2).toUpperCase();

    return (
        <PesertaLayout 
            title="Dashboard Peserta"
            userName={user.name}
            userInitials={initials}
        >
            {/* Hero banner section */}
            <HeroBanner 
                name={user.name}
                instansi={user.instansi}
                batch={user.jabatan}
                sisaUjian={availableExams.length}
                avgScore={stats.avg_score}
            />

            {/* Quick stats strip */}
            <StatsStrip stats={stats} />

            {/* Content wrap */}
            <div className="content-wrap">
                
                {/* Motivation banner */}
                {isRegistered && (
                    <MotivationBanner 
                        ranking={stats.ranking}
                        ujianTersisa={availableExams.length}
                    />
                )}

                {/* Main grid */}
                <div className="main-grid">
                    
                    {/* Left Column: Exams */}
                    <div>
                        {isRegistered ? (
                            <>
                                {/* Ongoing Section */}
                                {ongoingExam && (
                                    <>
                                        <div className="sec-head">
                                            <div className="sec-title">
                                                <span 
                                                    className="sec-title-dot" 
                                                    style={{ 
                                                        background: 'var(--rose)',
                                                        boxShadow: '0 0 6px rgba(190,18,60,0.5)'
                                                    }}
                                                ></span>
                                                Sedang Berlangsung
                                            </div>
                                        </div>
                                        <OngoingExamCard exam={ongoingExam} />
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="peserta-empty-state">
                                <div className="peserta-empty-icon">📋</div>
                                <h3 className="peserta-empty-title">Belum Terdaftar pada Ujian</h3>
                                <p className="peserta-empty-desc">
                                    Anda saat ini belum terdaftar pada ujian apapun. Silakan hubungi administrator atau panitia penyelenggara untuk mendaftarkan Anda ke ujian yang tersedia.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="right-col">
                        <ScheduleWidget schedule={schedule} />
                        <ScoreWidget scores={categoryScores} />
                    </div>

                </div>

                {/* Available Exams Section (Full Width) */}
                {isRegistered && availableExams && availableExams.length > 0 && (
                    <div>
                        <div className="sec-head" style={{ marginTop: '12px' }}>
                            <div className="sec-title">
                                <span className="sec-title-dot" style={{ background: 'var(--indigo)' }}></span>
                                Ujian Tersedia
                            </div>
                            <a className="sec-link">Lihat semua →</a>
                        </div>
                        <AvailableExamCard exams={availableExams} />
                    </div>
                )}

                {/* Bottom Row: History Table */}
                <HistoryTable history={history} />

            </div>
        </PesertaLayout>
    );
}
