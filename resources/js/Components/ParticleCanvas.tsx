import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        let animationFrameId: number;
        const COLORS = [
            'rgba(79,70,229,',
            'rgba(13,148,136,',
            'rgba(124,58,237,',
            'rgba(217,119,6,',
        ];

        const mouse = { x: -9999, y: -9999 };

        const handleResize = () => {
            if (!canvas) return;
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -9999;
            mouse.y = -9999;
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        class Particle {
            x!: number;
            y!: number;
            vx!: number;
            vy!: number;
            r!: number;
            a!: number;
            col!: string;

            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.r = Math.random() * 2 + 0.5;
                this.a = Math.random() * 0.25 + 0.05;
                this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    this.vx -= (dx / dist) * force * 0.8;
                    this.vy -= (dy / dist) * force * 0.8;
                }
                this.vx *= 0.99;
                this.vy *= 0.99;
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = W;
                if (this.x > W) this.x = 0;
                if (this.y < 0) this.y = H;
                if (this.y > H) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.col + this.a + ')';
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(79,70,229,${0.06 * (1 - d / 100)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        };

        const loop = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            drawConnections();
            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="particle-canvas" />;
}
