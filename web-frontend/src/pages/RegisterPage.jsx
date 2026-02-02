import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import Scene from '../components/canvas/Scene';
import FloatingNav from '../components/layout/FloatingNav';

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
            gsap.from(cardRef.current, {
                opacity: 0,
                y: 40,
                scale: 0.95,
                duration: 1,
                ease: 'power3.out'
            });
        }, cardRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authAPI.register(formData);

            // Success animation
            gsap.to(cardRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => navigate('/dashboard')
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');

            // Error shake
            gsap.to(cardRef.current, {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4
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
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h1 className="text-3xl font-['Space_Grotesk'] font-bold text-white mb-2">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
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
