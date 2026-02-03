import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';
import BuiltBy from '../components/layout/BuiltBy';
import { Rocket, ArrowRight, LayoutDashboard, LogIn, Sparkles, Github, Globe } from 'lucide-react';

import chemflowLogo from '../assets/chemflow-logo.png';

export default function LandingPage() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const heroRef = useRef();
    const titleRef = useRef();
    const subtitleRef = useRef();
    const ctaRef = useRef();
    const statsRef = useRef();
    const logoRef = useRef();

    useEffect(() => {
        setIsAuthenticated(authAPI.isAuthenticated());

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // Logo Animation
            if (logoRef.current) {
                tl.fromTo(logoRef.current,
                    { opacity: 0, scale: 0.5, rotate: -20 },
                    { opacity: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
                );
            }

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
                }, "-=1.0"); // Overlap with logo
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


                    {/* Headline */}
                    <h1 className="mb-6">
                        <div
                            ref={titleRef}
                            className="font-display font-bold text-7xl sm:text-8xl lg:text-9xl tracking-tight text-white mb-2"
                            style={{
                                textShadow: '0 4px 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
                            }}
                        >
                            ChemFlow
                        </div>
                        <div className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
                            Real-time Analytics
                        </div>
                    </h1>

                    {/* Subtitle */}
                    <p
                        ref={subtitleRef}
                        className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed mb-10"
                    >
                        Monitor, analyze and optimize chemical processes with{' '}
                        <span className="text-cyan-400 font-medium">AI-powered insights</span>{' '}
                        and predictive intelligence
                    </p>

                    {/* CTAs */}
                    <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center mb-16">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="group relative inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-[0.98]"
                            >
                                {/* Surround Light/Depth Glow */}
                                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-violet-600/50 via-indigo-500/50 to-purple-600/50 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Button Body - Dark Professional Grading */}
                                <div className="relative px-11 py-5 bg-[#0f111a] rounded-full flex items-center gap-3 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
                                    {/* Cylindrical Highlight (Top) */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

                                    {/* Rim Light (Bottom) */}
                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/70 to-transparent blur-[1px]" />

                                    <div className="relative flex items-center gap-3 z-10">
                                        <div className="p-2 rounded-full bg-white/5 border border-white/10 shadow-inner group-hover:bg-violet-500/20 transition-colors duration-300">
                                            <LayoutDashboard className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-lg font-medium text-slate-200 tracking-wide font-display group-hover:text-white transition-colors shadow-black drop-shadow-md">Enter Mission Control</span>
                                        <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="group relative inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-[0.98]"
                            >
                                {/* Surround Light/Depth Glow */}
                                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-cyan-600/50 via-blue-500/50 to-teal-600/50 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative px-11 py-5 bg-[#0f111a] rounded-full flex items-center gap-3 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

                                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent blur-[1px]" />

                                    <div className="relative flex items-center gap-3 z-10">
                                        <div className="p-2 rounded-full bg-white/5 border border-white/10 shadow-inner group-hover:bg-cyan-500/20 transition-colors duration-300">
                                            <Rocket className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-lg font-medium text-slate-200 tracking-wide font-display group-hover:text-white transition-colors shadow-black drop-shadow-md">Launch Visualizer</span>
                                        <ArrowRight className="w-5 h-5 text-cyan-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div ref={statsRef} className="flex flex-wrap gap-8 sm:gap-12 justify-center">
                        {[
                            { value: '99.9%', label: 'Uptime', color: '#a78bfa' },
                            { value: '<1ms', label: 'Response', color: '#22d3ee' },
                            { value: 'AI', label: 'Powered', color: '#34d399' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div
                                    className="text-5xl sm:text-6xl font-bold font-mono mb-2 group-hover:scale-110 transition-transform duration-300"
                                    style={{
                                        color: stat.color,
                                        textShadow: `0 0 30px ${stat.color}60`
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Developer Credits - Dynamic Depth & Hover Effects */}
                {/* Developer Credits */}
                <BuiltBy />
            </section>
        </div>
    );
}
