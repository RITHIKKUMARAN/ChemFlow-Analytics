import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            // Correctly pass username and password as separate arguments
            await authAPI.login(username, password);

            // Success animation
            gsap.to(cardRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => navigate('/dashboard')
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');

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

            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-md"
            >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-2xl opacity-30 animate-glow" />

                {/* Card */}
                <div className="relative glass-panel rounded-2xl p-8 border border-white/10">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                            <span className="text-3xl">👋</span>
                        </div>
                        <h1 className="text-3xl font-['Space_Grotesk'] font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400">
                            Sign in to access your analytics dashboard
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-glass w-full"
                                placeholder="johndoe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-glass w-full"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
