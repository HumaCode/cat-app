import { useEffect, RefObject } from 'react';

export default function useWelcomeEffects(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    setActiveSection: (section: string) => void
) {
    useEffect(() => {
        // --- NAVBAR SCROLL EFFECT ---
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 40);
            }
        };
        window.addEventListener('scroll', handleScroll);

        // --- GLOBAL SMOOTH SCROLL FOR ANCHOR LINKS ---
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
                const targetId = anchor.hash.substring(1);
                const element = document.getElementById(targetId);
                if (element) {
                    e.preventDefault();
                    const offset = 80; // height of fixed navbar + safety margin
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                    });
                }
            }
        };
        document.addEventListener('click', handleAnchorClick);

        // --- ACTIVE SECTION TRACKING (INTERSECTION OBSERVER) ---
        const sections = ['home', 'fitur', 'tipe-soal', 'workflow', 'harga', 'testimoni'];
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Triggers when the section is in the upper middle viewport
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        // --- PARTICLE CANVAS ANIMATION ---
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W: number, H: number;
        let particles: Particle[] = [];

        const resize = () => {
            if (!canvas) return;
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            x: number = 0;
            y: number = 0;
            r: number = 0;
            vx: number = 0;
            vy: number = 0;
            alpha: number = 0;
            col: string = '';

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 1.5 + 0.3;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.alpha = Math.random() * 0.4 + 0.05;
                const cols = ['79,70,229', '6,182,212', '16,185,129'];
                this.col = cols[Math.floor(Math.random() * cols.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
                    this.reset();
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.col},${this.alpha})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(79,70,229,${0.06 * (1 - d / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleAnchorClick);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, [canvasRef, setActiveSection]);
}
