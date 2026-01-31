import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/layout/Navbar';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Initial Reveal
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            tl.from('.hero-word', {
                y: 120,
                opacity: 0,
                duration: 1.4,
                stagger: 0.15,
                skewY: 5,
                delay: 0.2
            })
                .from('.hero-sub', {
                    y: 20,
                    opacity: 0,
                    duration: 1
                }, '-=1')
                .from('.hero-cta', {
                    y: 20,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8
                }, '-=0.8');

            // 2. Animated Background Grid using Canvas or simple div lines
            gsap.to(gridRef.current, {
                backgroundPosition: '0px 100px',
                duration: 20,
                ease: 'none',
                repeat: -1
            });

            // 3. Scroll Features
            const cards = gsap.utils.toArray('.feature-card');
            cards.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.1
                });
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            label: 'INGESTION',
            title: 'High-Velocity CSV Parsing',
            desc: 'Process heavy datasets with sub-millisecond latency. Automated type inference and error handling included.',
            mono: 'Pandas Engine v2.1'
        },
        {
            label: 'VISUALIZATION',
            title: 'Reactive Charting Engine',
            desc: 'Interactive, GPU-accelerated plotting for flow rates, pressure dynamics, and thermal gradients.',
            mono: '60 FPS Rendering'
        },
        {
            label: 'REPORTING',
            title: 'Automated PDF Generation',
            desc: 'Generate compliance-ready technical reports with one click. Vector-perfect output.',
            mono: 'PDF/A-3 Standard'
        }
    ];

    return (
        <div className="bg-app min-h-screen text-primary overflow-hidden" ref={heroRef}>
            <Navbar />

            {/* BACKGROUND GRID */}
            <div ref={gridRef} style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px),
                         linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                opacity: 0.4
            }} />

            {/* HERO SECTION */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '80px',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="container">
                    <div className="overflow-hidden">
                        <h1 className="hero-word" style={{
                            fontSize: 'clamp(3rem, 7vw, 6rem)',
                            lineHeight: 1,
                            marginBottom: '1rem',
                            fontWeight: 600
                        }}>
                            Industrial Grade
                        </h1>
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="hero-word text-secondary" style={{
                            fontSize: 'clamp(3rem, 7vw, 6rem)',
                            lineHeight: 1,
                            fontWeight: 600
                        }}>
                            Parameter Analytics
                        </h1>
                    </div>

                    <p className="hero-sub text-secondary" style={{
                        maxWidth: '600px',
                        marginTop: '2rem',
                        fontSize: '1.125rem',
                        lineHeight: 1.6
                    }}>
                        Advanced visualization platform for chemical equipment monitoring.
                        Real-time data ingestion, precision charting, and automated compliance reporting.
                    </p>

                    <div className="flex gap-4" style={{ marginTop: '3rem' }}>
                        <button
                            className="hero-cta btn-tech btn-primary"
                            onClick={() => navigate('/register')}
                        >
                            Start Console
                        </button>
                        <button
                            className="hero-cta btn-tech btn-secondary"
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                        >
                            System Specs
                        </button>
                    </div>

                    {/* METRICS STRIP */}
                    <div className="hero-cta flex gap-12 border-tech glass-panel" style={{
                        marginTop: '5rem',
                        padding: '1.5rem 2rem',
                        borderRadius: 'var(--radius-lg)',
                        display: 'inline-flex'
                    }}>
                        {[
                            { label: 'Latency', val: '< 12ms' },
                            { label: 'Uptime', val: '99.9%' },
                            { label: 'Security', val: 'AES-256' }
                        ].map((m, i) => (
                            <div key={i}>
                                <div className="text-label" style={{ marginBottom: '4px' }}>{m.label}</div>
                                <div className="text-mono" style={{ fontSize: '1.1rem', color: 'var(--color-accent)' }}>{m.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" style={{ padding: '8rem 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div className="grid-cols-3">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="feature-card surface-card"
                                style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <div className="text-label mb-4" style={{ color: 'var(--color-accent)' }}>0{i + 1} // {f.label}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: 1.3 }}>{f.title}</h3>
                                <p className="text-secondary" style={{ flexGrow: 1, marginBottom: '2rem' }}>{f.desc}</p>
                                <div className="text-mono text-xs" style={{
                                    padding: '8px 12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                    color: 'var(--color-text-tertiary)'
                                }}>
                                    {f.mono}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ padding: '6rem 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready to deploy?</h2>
                    <button
                        className="btn-tech btn-primary"
                        style={{ padding: '0 40px', height: '56px', fontSize: '1.1rem' }}
                        onClick={() => navigate('/register')}
                    >
                        Initialize Workspace
                    </button>
                </div>
            </section>
        </div>
    );
}
