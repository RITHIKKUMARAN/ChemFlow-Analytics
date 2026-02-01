/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0F14",
                surface: "#141923",
                card: "#1B2230",
                accent: "#4F8CFF",
                success: "#2ED573",
                error: "#FF4757",
                primary: "#E6EAF0",
                muted: "#9AA4B2"
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['Space Grotesk', 'sans-serif']
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(79, 140, 255, 0.3)',
                'glow-strong': '0 4px 20px -5px rgba(79, 140, 255, 0.4)',
                'glow-intense': '0 8px 25px -5px rgba(79, 140, 255, 0.5)'
            }
        },
    },
    plugins: [],
}
