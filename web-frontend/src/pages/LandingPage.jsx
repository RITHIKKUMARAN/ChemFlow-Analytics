import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';
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
                        Monitor, analyze, and optimize chemical processes with{' '}
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
                            <>
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
                                                <LogIn className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors" />
                                            </div>
                                            <span className="text-lg font-medium text-slate-200 tracking-wide font-display group-hover:text-white transition-colors shadow-black drop-shadow-md">Login to Dashboard</span>
                                            <ArrowRight className="w-5 h-5 text-cyan-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-10 py-4 rounded-xl border border-white/10 hover:border-purple-500/50 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300 backdrop-blur-md flex items-center gap-3 group"
                                >
                                    <Sparkles className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span>Create Account</span>
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
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6 animate-fade-in-up z-50">
                    <div className="group relative hover:scale-105 transition-transform duration-500 ease-out cursor-default">
                        {/* Dynamic Floating Animation */}
                        <div className="animate-float">
                            {/* Dynamic Ambient Glow (Pulses on Hover) */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/0 via-violet-600/40 to-cyan-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 w-full mx-auto" />

                            {/* Rotating Gradient Border */}
                            <div className="relative p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/50 transition-colors duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400/30 to-transparent translate-x-[-100%] group-hover:animate-[gradient_3s_linear_infinite]" />

                                {/* Main Content Pill */}
                                <div className="relative flex items-center gap-4 p-2 pr-6 rounded-full bg-[#0a0a12]/90 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50 group-hover:shadow-[0_10px_40px_-5px_rgba(124,58,237,0.3)] transition-all duration-500">

                                    {/* Inner Shine Effect */}
                                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-40" />

                                    <span className="pl-3 text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
                                        Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-bold group-hover:from-violet-300 group-hover:to-cyan-300 group-hover:drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all duration-300">Rithik Kumaran K</span>
                                    </span>

                                    <div className="h-4 w-[1px] bg-white/10 group-hover:bg-white/30 transition-colors" />

                                    <div className="flex gap-2">
                                        <a
                                            href="https://github.com/RITHIKKUMARAN"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-white/5 hover:bg-black border border-white/5 hover:border-white/30 transition-all duration-300 group/icon relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
                                            aria-label="GitHub Profile"
                                        >
                                            <Github className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors relative z-10" />
                                        </a>

                                        <a
                                            href="https://rithikkumarank-portfolio.vercel.app/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-white/5 hover:bg-violet-600 border border-white/5 hover:border-white/30 transition-all duration-300 group/icon relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/20"
                                            aria-label="Portfolio"
                                        >
                                            <Globe className="w-4 h-4 text-slate-400 group-hover/icon:text-white transition-colors relative z-10" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
