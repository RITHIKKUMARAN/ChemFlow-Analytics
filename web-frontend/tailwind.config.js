/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light Premium Theme
                void: '#f8fafc',           // Soft white
                midnight: '#ffffff',       // Pure white
                slate: {
                    950: '#f1f5f9',
                    900: '#e2e8f0',
                    850: '#cbd5e1',
                    800: '#94a3b8',
                },
                // Vibrant Accents
                purple: {
                    500: '#8b5cf6',
                    400: '#a78bfa',
                },
                cyan: {
                    500: '#06b6d4',
                    400: '#22d3ee',
                },
                // Accents
                accent: '#8b5cf6',         // Vibrant Purple
                'accent-cyan': '#06b6d4',  // Vibrant Cyan
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                // Text
                primary: '#1e293b',        // Dark slate for text
                secondary: '#475569',
                muted: '#64748b',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-fog': 'linear-gradient(135deg, #fdf4ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
                'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            },
            fontFamily: {
                sans: ['Manrope', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 30px rgba(139, 92, 246, 0.15)',
                'glow-lg': '0 0 60px rgba(139, 92, 246, 0.2)',
                'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.15)',
                'inner-glow': 'inset 0 0 20px rgba(139, 92, 246, 0.1)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'gradient': 'gradient 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
        },
    },
    plugins: [],
}
