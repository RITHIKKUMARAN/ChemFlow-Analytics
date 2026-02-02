import { NavLink, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Home, LayoutDashboard, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import chemflowLogo from '../../assets/chemflow-logo.png';

export default function FloatingNav({ onProfileClick }) {
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
            { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> }
        ]
        : [
            { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { to: '/login', label: 'Login', icon: <LogIn className="w-4 h-4" /> },
            { to: '/register', label: 'Sign Up', icon: <UserPlus className="w-4 h-4" /> }
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
                <div className="flex flex-row items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    {/* 3D Logo Image - Natural Render */}
                    <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <img
                            src={chemflowLogo}
                            alt="ChemFlow Logo"
                            className="relative w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <span className="hidden sm:flex font-display font-bold text-xl tracking-tight whitespace-nowrap items-center">
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
                                `flex items-center gap-2 relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {item.icon}
                                    <span className="hidden sm:inline whitespace-nowrap">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {isAuthenticated && (
                        <button
                            onClick={handleSignOut}
                            className="ml-2 px-5 py-2.5 rounded-full text-sm font-medium text-red-300 hover:text-white bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/40 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline whitespace-nowrap">Sign Out</span>
                        </button>
                    )}

                    {isAuthenticated && onProfileClick && (
                        <button
                            onClick={onProfileClick}
                            className="ml-2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 hover:from-purple-500/40 hover:to-cyan-500/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 flex items-center justify-center group relative overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                            title="Profile Settings"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {localStorage.getItem('username') ? (
                                <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-cyan-300 group-hover:from-white group-hover:to-white transition-all text-md select-none">
                                    {localStorage.getItem('username').charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <User className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
