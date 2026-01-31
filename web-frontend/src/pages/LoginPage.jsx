import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.login-item', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authAPI.login(formData.username, formData.password);
            gsap.to(containerRef.current, {
                scale: 0.98,
                opacity: 0,
                duration: 0.3,
                onComplete: () => navigate('/dashboard')
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
            setLoading(false);
            gsap.fromTo('.surface-card',
                { x: -5 },
                { x: 5, duration: 0.1, repeat: 3, yoyo: true }
            );
        }
    };

    return (
        <div className="bg-app min-h-screen flex items-center justify-center p-4" ref={containerRef}>
            {/* Ambient Background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                opacity: 0.4,
                zIndex: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a202c 0%, transparent 70%)'
            }} />

            <div className="surface-card p-12 relative z-10 w-full max-w-md login-item" style={{ padding: '3rem' }}>
                <div className="text-center mb-8">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}>⚗️</div>
                    <h1 className="text-2xl mb-2 login-item">Console Access</h1>
                    <p className="text-secondary text-sm login-item">Enter credentials to initialize session</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded mb-4" style={{ background: 'rgba(255, 71, 87, 0.1)', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>
                            <span className="text-mono">ERR: {error}</span>
                        </div>
                    )}

                    <div className="login-item">
                        <label className="text-label mb-2 block">Username ID</label>
                        <input
                            type="text"
                            className="input-tech"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="usr_..."
                        />
                    </div>

                    <div className="login-item">
                        <label className="text-label mb-2 block">Password Key</label>
                        <input
                            type="password"
                            className="input-tech"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-tech btn-primary mt-4 login-item"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'ESTABLISH CONNECTION'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-tech pt-6 login-item" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="text-secondary text-sm">
                        New terminal?{' '}
                        <Link to="/register" className="text-accent hover:underline" style={{ color: 'var(--color-accent)' }}>
                            Register Device
                        </Link>
                    </p>
                    <div className="mt-4">
                        <Link to="/" className="text-label text-xs hover:text-white transition-colors">
                            ← ABORT SEQUENCE
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
