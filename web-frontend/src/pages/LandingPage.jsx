import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../hooks/useGSAP';
import Navbar from '../components/layout/Navbar';
import Scene from '../components/canvas/Scene';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const navigate = useNavigate();
    const mainRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        // 1. Cinematic Intro
        tl.from('.hero-line', {
            y: 120,
            opacity: 0,
            skewY: 7,
            duration: 1.8,
            stagger: 0.15,
            delay: 0.5
        })
            .from('.hero-meta', { opacity: 0, y: 20, duration: 1 }, '-=1')
            .from('.cta-group', { opacity: 0, scale: 0.9, duration: 1 }, '-=0.8');

        // 2. Scroll-driven Depth
        gsap.to('.hero-container', {
            y: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        // 3. Feature Pinning
        const cards = gsap.utils.toArray('.feature-panel');
        gsap.set(cards, { y: 100, opacity: 0 });

        ScrollTrigger.batch(cards, {
            onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, overwrite: true }),
            start: 'top 85%'
        });

    }, mainRef);

    return (
        <div ref={mainRef} className="relative min-h-screen text-white overflow-x-hidden">
            <Scene /> {/* WebGL Background */}
            <Navbar />

            {/* HERO SECTION */}
            <section className="hero-container relative h-screen flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="overflow-hidden mb-2">
                    <h1 className="hero-line text-[12vh] font-bold leading-none tracking-tighter mix-blend-overlay">
                        INDUSTRIAL
                    </h1>
                </div>
                <div className="overflow-hidden mb-8">
                    <h1 className="hero-line text-[12vh] font-bold leading-none tracking-tighter text-accent mix-blend-screen">
                        INTELLIGENCE
                    </h1>
                </div>

                <div className="hero-meta max-w-xl mx-auto mb-12">
                    <p className="text-lg text-gray-400 font-light leading-relaxed">
                        Next-generation telemetry visualization for chemical processing units.
                        GPU-accelerated <span className="text-white font-medium">real-time analytics</span>.
                    </p>
                </div>

                <div className="cta-group flex gap-6">
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform"
                    >
                        Initialize Console
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors backdrop-blur-md">
                        System Architecture
                    </button>
                </div>
            </section>

            {/* FEATURES SECTION (DEPTH LAYERS) */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { num: '01', title: 'Flow Dynamics', desc: 'Real-time computation of fluid velocity and pressure gradients.' },
                        { num: '02', title: 'Thermal Logic', desc: 'Predictive heat-map generation using historical sensor arrays.' },
                        { num: '03', title: 'Audit Ready', desc: 'Automated generation of ISO-compliant safety documentation.' }
                    ].map((f, i) => (
                        <div key={i} className="feature-panel p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors group">
                            <div className="text-sm font-mono text-gray-500 mb-6 group-hover:text-accent transition-colors">
                                COMPONENT // {f.num}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
