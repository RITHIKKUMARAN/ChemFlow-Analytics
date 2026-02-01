import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Reusable GSAP hook for safe React animation
 * Handles cleanup of Context automatically
 */
export const useGSAP = (animation, dependencies = []) => {
    const scope = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(animation, scope);
        return () => ctx.revert();
    }, dependencies);

    return scope;
};
