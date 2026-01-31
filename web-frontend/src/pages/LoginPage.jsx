/**
 * Login Page Component
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import gsap from 'gsap';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Entrance animation
        gsap.from('.login-container', {
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
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authAPI.login(formData.username, formData.password);

            // Success animation
            gsap.to('.login-container', {
                scale: 0.95,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    navigate('/dashboard');
                },
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
            setLoading(false);

            // Shake animation on error
            gsap.fromTo('.login-container',
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
            );
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div className="login-container glass" style={styles.loginContainer}>
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>⚗️</div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
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
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
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
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>
                            Create one here
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
    loginContainer: {
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

export default LoginPage;
