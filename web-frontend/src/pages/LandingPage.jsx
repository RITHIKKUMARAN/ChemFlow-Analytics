import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const heroRef = useRef();
    const titleRef = useRef();
    const subtitleRef = useRef();
    const ctaRef = useRef();
    const statsRef = useRef();

    useEffect(() => {
        setIsAuthenticated(authAPI.isAuthenticated());

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // Title letter animation
            if (titleRef.current) {
                const text = titleRef.current.textContent || "ChemFlow";
                const letters = text.split('');
                titleRef.current.innerHTML = '';

                letters.forEach((letter) => {
                    const span = document.createElement('span');
                    span.textContent = letter === ' ' ? '\u00A0' : letter;
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(40px) rotate(-5deg)';
                    titleRef.current.appendChild(span);
                });

                tl.to(titleRef.current.children, {
                    opacity: 1,
                    y: 0,
                    rotation: 0,
                    stagger: 0.03,
                    duration: 0.8
                });
            }

            // Subtitle
            tl.fromTo(subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
                '-=0.4'
            );

            // CTAs
            if (ctaRef.current?.children) {
                tl.fromTo(ctaRef.current.children,
                    { opacity: 0, y: 20, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
                    '-=0.5'
                );
            }

            // Stats
            if (statsRef.current?.children) {
                tl.fromTo(statsRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
                    '-=0.3'
                );
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Scene />
            <FloatingNav />

            {/* Hero Section */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center px-6 perspective-1200"
            >
                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel mb-8 animate-float">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-glow shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                        <span className="text-sm font-medium text-cyan-200 tracking-wider uppercase font-['JetBrains_Mono']">
                            Next-Gen Chemical Analytics
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="mb-6">
                        <div
                            ref={titleRef}
                            className="font-['Space_Grotesk'] font-bold text-7xl sm:text-8xmlg:text-9xl tracking-tight text-white mb-2"
                            style={{
                                textShadow: '0 4px 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
                            }}
                        >
                            ChemFlow
                        </div>
                        <div className="font-['Space_Grotesk'] font-bold text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
                            Real-time Analytics
                        </div>
                    </h1>

                    {/* Subtitle */}
                    <p
                        ref={subtitleRef}
                        className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        Monitor, analyze, and optimize chemical processes with{' '}
                        <span className="text-cyan-400 font-medium">AI-powered insights</span>{' '}
                        and predictive intelligence
                    </p>

                    {/* CTAs */}
                    <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center mb-16">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-primary text-base px-10 py-4 flex items-center gap-3 group text-lg shadow-[0_0_30px_rgba(124,58,237,0.5)]"
                            >
                                <span>🚀 Enter Mission Control</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn-primary text-base px-8 py-4 flex items-center gap-3 group"
                                >
                                    <span>🔐 Login to Dashboard</span>
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => navigate('/register')}
                                    className="glass-panel text-white px-8 py-4 rounded-xl border border-white/10 font-semibold hover:border-purple-500/50 transition-all hover:bg-white/5"
                                >
                                    ✨ Create Account
                                </button>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex flex-wrap gap-8 sm:gap-12 justify-center">
                        {[
                            { value: '99.9%', label: 'Uptime', color: '#a78bfa' },
                            { value: '<1ms', label: 'Response', color: '#22d3ee' },
                            { value: 'AI', label: 'Powered', color: '#34d399' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div
                                    className="text-4xl sm:text-5xl font-bold font-['JetBrains_Mono'] mb-2"
                                    style={{
                                        color: stat.color,
                                        textShadow: `0 0 20px ${stat.color}60`
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-['JetBrains_Mono']">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
