/**
 * Landing Page with GSAP Animations
 * Features: Timeline animations, ScrollTrigger, 3D hover effects
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        // Hero section entrance animation
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1,
        })
            .from('.hero-subtitle', {
                y: 50,
                opacity: 0,
                duration: 0.8,
            }, '-=0.5')
            .from('.hero-buttons', {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, '-=0.4')
            .from('.hero-particles', {
                scale: 0,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
            }, '-=0.6');

        // Feature cards scroll animation
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse',
                },
                y: 100,
                opacity: 0,
                duration: 1,
                delay: index * 0.2,
            });

            // 3D hover effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.5,
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.5,
                });
            });
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const features = [
        {
            icon: '📊',
            title: 'Interactive Charts',
            description: 'Visualize equipment data with dynamic, animated charts powered by Chart.js'
        },
        {
            icon: '📤',
            title: 'CSV Upload',
            description: 'Easily upload CSV files with drag-and-drop and real-time progress tracking'
        },
        {
            icon: '📈',
            title: 'Real-time Analytics',
            description: 'Get instant statistics on flowrate, pressure, and temperature parameters'
        },
        {
            icon: '📄',
            title: 'PDF Reports',
            description: 'Generate professional PDF reports with comprehensive equipment analysis'
        },
        {
            icon: '🔄',
            title: 'History Management',
            description: 'Access your last 5 dataset uploads with complete historical data'
        },
        {
            icon: '🔐',
            title: 'Secure Authentication',
            description: 'JWT-based authentication ensures your data remains private and secure'
        },
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero" ref={heroRef} style={styles.hero}>
                <div className="container" style={styles.heroContainer}>
                    {/* Animated particles background */}
                    <div style={styles.particlesContainer}>
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="hero-particles"
                                style={{
                                    ...styles.particle,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                }}
                            />
                        ))}
                    </div>

                    <h1 className="hero-title text-gradient" style={styles.heroTitle}>
                        Chemical Equipment<br />Parameter Visualizer
                    </h1>

                    <p className="hero-subtitle" style={styles.heroSubtitle}>
                        Upload, analyze, and visualize chemical equipment data with cutting-edge
                        animations and interactive charts. Transform your data into actionable insights.
                    </p>

                    <div className="hero-buttons" style={styles.heroButtons}>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/register')}
                            style={styles.btnLarge}
                        >
                            Get Started
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/login')}
                            style={styles.btnLarge}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features section" ref={featuresRef} style={styles.featuresSection}>
                <div className="container">
                    <h2 className="text-center" style={styles.featuresTitle}>
                        Powerful Features
                    </h2>
                    <p className="text-center" style={styles.featuresSubtitle}>
                        Everything you need to analyze and visualize equipment parameters
                    </p>

                    <div style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card glass glass-hover card-3d"
                                style={styles.featureCard}
                            >
                                <div style={styles.featureIcon}>{feature.icon}</div>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                                <p style={styles.featureDescription}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta section" style={styles.ctaSection}>
                <div className="container text-center">
                    <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
                    <p style={styles.ctaDescription}>
                        Join us today and transform your equipment data analysis workflow
                    </p>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate('/register')}
                        style={styles.btnLarge}
                    >
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div className="container text-center">
                    <p style={styles.footerText}>
                        © 2026 Chemical Equipment Visualizer | Hybrid Application
                    </p>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    hero: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    heroContainer: {
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
    },
    particlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
    },
    particle: {
        position: 'absolute',
        width: '4px',
        height: '4px',
        background: 'rgba(59, 130, 246, 0.6)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)',
    },
    heroTitle: {
        fontSize: '4rem',
        marginBottom: '1.5rem',
        fontWeight: 900,
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        maxWidth: '700px',
        margin: '0 auto 2.5rem',
        color: '#d1d5db',
        lineHeight: 1.8,
    },
    heroButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    btnLarge: {
        padding: '1rem 2.5rem',
        fontSize: '1.125rem',
    },
    featuresSection: {
        background: 'var(--color-bg-primary)',
    },
    featuresTitle: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    featuresSubtitle: {
        fontSize: '1.125rem',
        color: 'var(--color-text-muted)',
        marginBottom: '3rem',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '3rem',
    },
    featureCard: {
        padding: '2.5rem',
        textAlign: 'center',
        transformStyle: 'preserve-3d',
    },
    featureIcon: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    featureTitle: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: 'var(--color-text-primary)',
    },
    featureDescription: {
        color: 'var(--color-text-muted)',
        lineHeight: 1.6,
    },
    ctaSection: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '5rem 0',
    },
    ctaTitle: {
        fontSize: '3rem',
        marginBottom: '1rem',
        color: 'white',
    },
    ctaDescription: {
        fontSize: '1.25rem',
        marginBottom: '2rem',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    footer: {
        padding: '2rem 0',
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
    },
};

export default LandingPage;
