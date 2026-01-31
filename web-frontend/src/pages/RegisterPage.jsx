/**
 * Register Page Component
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Entrance animation
        gsap.from('.register-container', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            gsap.fromTo('.register-container',
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true }
            );
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            gsap.fromTo('.register-container',
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true }
            );
            return;
        }

        try {
            await authAPI.register(formData.username, formData.email, formData.password);

            // Success animation
            gsap.to('.register-container', {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    navigate('/dashboard');
                },
            });
        } catch (err) {
            const errorMessage = err.response?.data?.username
                ? 'Username already exists'
                : err.response?.data?.email
                    ? 'Email already exists'
                    : 'Registration failed. Please try again.';

            setError(errorMessage);
            setLoading(false);

            gsap.fromTo('.register-container',
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true }
            );
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div className="register-container glass" style={styles.registerContainer}>
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>⚗️</div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join us to start analyzing your equipment data</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && (
                        <div style={styles.errorAlert}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={styles.loadingText}>
                                <div className="spinner" style={styles.spinner}></div>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div style={styles.backLink}>
                    <Link to="/" style={styles.link}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    },
    registerContainer: {
        width: '100%',
        maxWidth: '450px',
        padding: '3rem',
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logo: {
        fontSize: '4rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--color-text-muted)',
        fontSize: '1rem',
    },
    form: {
        marginBottom: '1.5rem',
    },
    errorAlert: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.5rem',
        color: '#fca5a5',
        fontSize: '0.875rem',
    },
    submitBtn: {
        width: '100%',
        marginTop: '1rem',
    },
    loadingText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    spinner: {
        width: '20px',
        height: '20px',
        borderWidth: '2px',
    },
    footer: {
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    footerText: {
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
    },
    link: {
        color: 'var(--color-accent-primary)',
        fontWeight: 600,
        transition: 'color var(--transition-fast)',
    },
    backLink: {
        textAlign: 'center',
        marginTop: '1rem',
    },
};

export default RegisterPage;
