import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';
import { Atom } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const cardRef = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'transform'
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Fix: Pass arguments individually to match api.js signature
            await authAPI.register(formData.username, formData.email, formData.password);

            // Success animation
            gsap.to(cardRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => navigate('/dashboard')
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || err.response?.data?.password?.[0] || 'Registration failed');

            // Error shake
            gsap.to(cardRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                clearProps: 'x'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
            <Scene />
            <FloatingNav />

            <div ref={cardRef} className="relative z-10 w-full max-w-md">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-2xl opacity-30 animate-glow" />

                {/* Card */}
                <div className="relative glass-panel rounded-2xl p-8 border border-white/10">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <Atom className="w-8 h-8 text-cyan-400" />
                            <span className="text-xl font-bold font-display tracking-tight text-white">ChemFlow</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-slate-400">
                            Join and start optimizing your chemical processes
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="input-glass w-full"
                                placeholder="johndoe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-glass w-full"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-glass w-full"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Minimum 6 characters
                            </p>
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative px-10 py-3 rounded-full font-bold text-white text-sm tracking-wide transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_10px_20px_-5px_rgba(16,185,129,0.5)]"
                            >
                                {/* Vibrant Deep Gradient Background (No Grey) */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-full" />

                                {/* Inner Bevel/Depth Highlight */}
                                <div className="absolute inset-0 box-border border-t border-white/30 rounded-full opacity-50" />

                                {/* Electric Glow Underneath */}
                                <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-emerald-400 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10" />

                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <svg
                                                className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-all duration-300"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
