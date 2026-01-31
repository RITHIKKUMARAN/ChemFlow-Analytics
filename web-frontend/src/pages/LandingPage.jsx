/**
 * ChemFlow Analytics - Modern Landing Page
 * Heavy GSAP integration for premium feel
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const contentRef = useRef(null);
    const cursorRef = useRef(null);

    useEffect(() => {
        // Custom Cursor Logic
        const moveCursor = (e) => {
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2,
                ease: 'power2.out'
            });
        };
        window.addEventListener('mousemove', moveCursor);

        // Hero Entrance Animation
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.from('.hero-badge', {
            y: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        })
            .from('.hero-title-line', {
                y: 100,
                opacity: 0,
                stagger: 0.15,
                duration: 1.2,
                skewY: 5
            }, '-=0.5')
            .from('.hero-desc', {
                y: 30,
                opacity: 0,
                duration: 1
            }, '-=0.8')
            .from('.hero-btn', {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8
            }, '-=0.6')
            .from('.visual-element', {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: 'back.out(1.7)'
            }, '-=1');

        // Scroll Animations for Feature System
        const cards = gsap.utils.toArray('.feature-box');
        cards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1
            });
        });

        // Parallax Background
        gsap.to('.hero-bg-glow', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 200,
            opacity: 0
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const features = [
        { icon: '📊', title: 'Data Visualization', desc: 'Transform raw numbers into stunning interactive charts.' },
        { icon: '⚡', title: 'Real-time Analytics', desc: 'Instant parameter processing with sub-millisecond latency.' },
        { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade JWT encryption for your sensitive data.' },
        { icon: '📄', title: 'Smart Reporting', desc: 'Automated PDF generation with deep insights.' },
        { icon: '🌍', title: 'Hybrid Architecture', desc: 'Seamlessly sync between Web and Desktop apps.' },
        { icon: '🎨', title: 'Modern UI/UX', desc: 'Designed for clarity, efficiency, and aesthetics.' }
    ];

    return (
        <div className="landing-wrapper" ref={contentRef} style={{ overflowX: 'hidden' }}>
            {/* Custom Cursor */}
            <div ref={cursorRef} style={{
                position: 'fixed',
                width: '20px',
                height: '20px',
                background: 'var(--primary)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(4px)'
            }} />

            {/* Navbar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: '20px 40px',
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(3, 0, 20, 0.5)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>⚗️</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px' }}>ChemFlow</span>
                </div>
                <button
                    className="btn-modern btn-secondary"
                    onClick={() => navigate('/login')}
                >
                    Login Portal
                </button>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" ref={heroRef} style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '80px',
                zIndex: 1
            }}>
                {/* Background FX - Pushed clearly to back */}
                <div className="hero-bg-glow glow-orb" style={{ position: 'absolute', top: '-20%', left: '20%', zIndex: -1 }} />
                <div className="hero-bg-glow glow-orb" style={{ position: 'absolute', bottom: '-20%', right: '10%', background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)', zIndex: -1 }} />

                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>

                    <div className="hero-badge" style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '30px',
                        marginBottom: '30px',
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        letterSpacing: '1px'
                    }}>
                        ✨ NEXT GENERATION ANALYTICS
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '24px' }}>
                        <div className="hero-title-line">Master Your</div>
                        <div className="hero-title-line text-gradient">Equipment Data</div>
                    </h1>

                    <p className="hero-desc" style={{
                        maxWidth: '600px',
                        margin: '0 auto 40px',
                        fontSize: '1.2rem',
                        color: '#a0a0b0'
                    }}>
                        Upload, analyze, and visualize chemical parameters with an interface designed for the future of engineering.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <button
                            className="hero-btn btn-modern btn-primary"
                            onClick={() => navigate('/register')}
                        >
                            Get Started Free
                        </button>
                        <button
                            className="hero-btn btn-modern btn-secondary"
                            onClick={() => {
                                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Explore Features
                        </button>
                    </div>

                    {/* Floating Visual Element */}
                    <div className="visual-element float" style={{
                        marginTop: '80px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px',
                        padding: '20px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        maxWidth: '800px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                        </div>
                        <div style={{
                            height: '200px',
                            background: 'url("https://www.chartjs.org/img/chartjs-logo.svg") no-repeat center center',
                            opacity: 0.5,
                            filter: 'grayscale(100%)'
                        }} />
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section id="features" style={{ padding: '100px 0', position: 'relative' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '60px' }}>
                        Designed for <span className="text-gradient">Performance</span>
                    </h2>

                    <div className="grid-3">
                        {features.map((item, idx) => (
                            <div key={idx} className="feature-box glass-card" style={{ padding: '40px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{item.icon}</div>
                                <h3 style={{ marginBottom: '10px', fontSize: '1.5rem' }}>{item.title}</h3>
                                <p style={{ color: '#a0a0b0' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: '#020010',
                padding: '60px 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{ marginBottom: '20px', fontFamily: 'var(--font-display)' }}>ChemFlow Analytics</h2>
                    <p style={{ color: '#666' }}>&copy; 2026 ChemFlow Analytics. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
