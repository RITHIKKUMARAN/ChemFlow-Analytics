import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        gsap.from(navRef.current, {
            y: -20, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
    }, []);

    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 py-4 border-b border-white/5 bg-background/50 backdrop-blur-md">
            <div className="container mx-auto px-6 h-full flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <div className="text-2xl animate-float">⚗️</div>
                    <span className="font-display font-bold text-lg tracking-tight">
                        ChemFlow<span className="text-accent">Visualizer</span>
                    </span>
                </div>

                <div className="flex gap-4">
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/register')}
                    >
                        Initialize
                    </button>
                </div>
            </div>
        </nav>
    );
}
