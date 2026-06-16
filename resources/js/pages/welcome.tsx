import { Head } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useRef, useState } from 'react';
import Navbar from './Welcome/Partials/Navbar';
import Hero from './Welcome/Partials/Hero';
import Features from './Welcome/Partials/Features';
import QuestionTypes from './Welcome/Partials/QuestionTypes';
import Stats from './Welcome/Partials/Stats';
import Workflow from './Welcome/Partials/Workflow';
import Pricing from './Welcome/Partials/Pricing';
import Testimonials from './Welcome/Partials/Testimonials';
import CTA from './Welcome/Partials/CTA';
import Footer from './Welcome/Partials/Footer';
import useWelcomeEffects from './Welcome/useWelcomeEffects';
import '../../css/welcome.css';

export default function Welcome({ auth }: PageProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    // Run interactive effects (particle canvas and scrolled navbar)
    useWelcomeEffects(canvasRef, setActiveSection);

    return (
        <>
            <Head title="CAT System — Platform Ujian Online Modern" />

            <div className="welcome-page-body">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
                <canvas ref={canvasRef} id="canvas-bg"></canvas>

                <Navbar auth={auth} menuOpen={menuOpen} setMenuOpen={setMenuOpen} activeSection={activeSection} />
                <Hero auth={auth} />
                <Features />
                <QuestionTypes />
                <Stats />
                <Workflow />
                <Pricing auth={auth} />
                <Testimonials />
                <CTA auth={auth} />
                <Footer />
            </div>
        </>
    );
}
