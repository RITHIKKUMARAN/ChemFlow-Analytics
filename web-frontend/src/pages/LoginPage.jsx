import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Scene from '../components/canvas/Scene';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    useGSAP(() => {
        gsap.from('.login-card', {
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
        gsap.from('.form-element', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out"
        });
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
            gsap.fromTo('.error-msg', { x: -10 }, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <Scene />

            <div className="card login-card w-full max-w-md p-10 relative z-10 mx-4">
                <div className="text-center mb-8 form-element">
                    <div className="text-5xl mb-4 animate-float">⚗️</div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-muted">Sign in to access your terminal</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="error-msg bg-error/10 border border-error/20 text-error p-3 rounded-lg text-center text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="input-group form-element">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Enter your ID"
                        />
                    </div>

                    <div className="input-group form-element">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary full-width form-element mt-2">
                        Initialize Session
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6 form-element">
                    <p className="text-sm text-muted">
                        New Operator? <Link to="/register" className="text-accent font-bold hover:text-accent/80 transition-colors">Register Access</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
