import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        gsap.from(navRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.2
        });
    }, []);

    return (
        <nav ref={navRef} className="glass-panel" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 'var(--header-height)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem'
        }}>
            <div className="container flex justify-between items-center">
                <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--color-accent)',
                        borderRadius: '6px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '18px',
                        color: 'white'
                    }}>⚗️</div>
                    <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        letterSpacing: '-0.01em'
                    }}>
                        ChemFlow
                    </span>
                </div>

                <div className="flex gap-4">
                    <button
                        className="btn-tech btn-secondary"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                    <button
                        className="btn-tech btn-primary"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}
