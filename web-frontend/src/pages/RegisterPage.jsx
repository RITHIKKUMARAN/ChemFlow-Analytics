import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import Scene from '../components/canvas/Scene';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    useGSAP(() => {
        gsap.from('.register-card', {
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
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            gsap.fromTo('.error-msg', { x: -10 }, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
            return;
        }
        try {
            await authAPI.register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            const serverError = err.response?.data?.username?.[0] ||
                err.response?.data?.password?.[0] ||
                err.response?.data?.email?.[0] ||
                'Registration failed';
            setError(serverError);
            gsap.fromTo('.error-msg', { x: -10 }, { x: 10, repeat: 3, yoyo: true, duration: 0.1 });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <Scene />

            <div className="card register-card w-full max-w-md p-10 relative z-10 mx-4">
                <div className="text-center mb-8 form-element">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                    <p className="text-muted">Initialize your profile</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <div className="error-msg bg-error/10 border border-error/20 text-error p-3 rounded-lg text-center text-sm font-medium">{error}</div>}

                    <div className="input-group form-element">
                        <label className="input-label">Username</label>
                        <input className="form-input" type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Choose a username" />
                    </div>

                    <div className="input-group form-element">
                        <label className="input-label">Email</label>
                        <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@company.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 form-element">
                        <div className="input-group mb-0">
                            <label className="input-label">Password</label>
                            <input className="form-input" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                        </div>
                        <div className="input-group mb-0">
                            <label className="input-label">Confirm</label>
                            <input className="form-input" type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary full-width form-element mt-2">Register Access</button>
                </form>

                <div className="mt-8 text-center border-t border-white/10 pt-6 form-element">
                    <p className="text-sm text-muted">
                        Already have an account? <Link to="/login" className="text-accent font-bold hover:text-accent/80 transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
