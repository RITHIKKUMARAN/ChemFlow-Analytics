import { NavLink, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function FloatingNav() {
    const navigate = useNavigate();
    const navRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const isAuthenticated = authAPI.isAuthenticated();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        let ctx = gsap.context(() => {
            if (navRef.current) {
                gsap.killTweensOf(navRef.current); // Kill any existing animations
                gsap.fromTo(navRef.current,
                    { y: -100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        clearProps: 'transform' // Clear transform after animation to allow CSS to handle sticking
                    }
                );
            }
        }, navRef);
        return () => ctx.revert();
    }, []);

    const handleSignOut = () => {
        authAPI.logout();
        navigate('/');
    };

    const navItems = isAuthenticated
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: '🎯' },
            { to: '/', label: 'Home', icon: '🏠' }
        ]
        : [
            { to: '/', label: 'Home', icon: '🏠' },
            { to: '/login', label: 'Login', icon: '🔐' },
            { to: '/register', label: 'Sign Up', icon: '✨' }
        ];

    return (
        <nav
            ref={navRef}
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'top-2 scale-[0.98]' : 'top-6 scale-100'
                }`}
            style={{ width: 'calc(100% - 2rem)', maxWidth: '800px' }}
        >
            <div className="glass-panel rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
                        C
                    </div>
                    <span className="hidden sm:block font-['Space_Grotesk'] font-bold text-lg tracking-tight">
                        <span className="text-white">Chem</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Flow</span>
                    </span>
                </div>

                {/* Nav Items */}
                <div className="flex items-center gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'text-white bg-white/10'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className="mr-2">{item.icon}</span>
                                    <span className="hidden sm:inline">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {isAuthenticated && (
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-300"
                        >
                            <span className="mr-2">🚪</span>
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
