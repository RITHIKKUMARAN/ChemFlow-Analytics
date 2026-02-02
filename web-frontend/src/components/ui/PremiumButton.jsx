import { forwardRef } from 'react';

const PremiumButton = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    className = '',
    ...props
}, ref) => {
    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const variants = {
        primary: 'btn-primary',
        secondary: 'glass-panel border border-white/10 text-white hover:border-purple-500/50',
        ghost: 'text-slate-300 hover:text-white hover:bg-white/5'
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                rounded-xl font-semibold transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                inline-flex items-center justify-center gap-2
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
});

PremiumButton.displayName = 'PremiumButton';

export default PremiumButton;
