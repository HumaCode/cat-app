import { useState, PropsWithChildren, ReactNode } from 'react';
import { Head, router } from '@inertiajs/react';
import ParticleCanvas from '@/Components/ParticleCanvas';
import Sidebar from './Partials/Sidebar';
import Topbar from './Partials/Topbar';
import Footer from './Partials/Footer';
import LogoutConfirmModal from '@/Components/LogoutConfirmModal';
import '../../css/dashboard-global.css';

interface AuthenticatedProps {
    header?: ReactNode;
    title?: string;
}

export default function AuthenticatedLayout({
    children,
    title,
}: PropsWithChildren<AuthenticatedProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutConfirm = () => {
        setIsLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setShowLogoutModal(false);
            }
        });
    };

    return (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
            </Head>

            {/* Background Particle Canvas */}
            <ParticleCanvas />

            {/* Sidebar Navigation */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Application Container */}
            <div className="main-wrap">
                {/* Topbar */}
                <Topbar
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title={title}
                    onTriggerLogout={() => {
                        setIsLoggingOut(false);
                        setShowLogoutModal(true);
                    }}
                />

                {/* Main Content Area */}
                <main className="main-inner">
                    {children}
                </main>

                {/* Reusable Footer */}
                <Footer />
            </div>

            {/* Custom Reusable Logout Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                isLoading={isLoggingOut}
            />
        </div>
    );
}
