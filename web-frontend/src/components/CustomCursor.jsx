import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    // Refs for direct DOM manipulation (performance)
    const cursorRef = useRef(null);
    const ringRef = useRef(null);

    // State for visual changes
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

    // Track mouse position with refs to avoid re-renders on every move
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
        };

        const onMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (cursorRef.current) {
                // Main dot follows instantly
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const onMouseDown = () => setClicked(true);
        const onMouseUp = () => setClicked(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseEnter = () => setHidden(false);

        // Link Hover Detection
        const handleLinkHoverEvents = () => {
            const hoverables = document.querySelectorAll("a, button, input, textarea, select, [role='button'], .clickable");

            const onHoverStart = () => setLinkHovered(true);
            const onHoverEnd = () => setLinkHovered(false);

            hoverables.forEach((el) => {
                el.addEventListener("mouseenter", onHoverStart);
                el.addEventListener("mouseleave", onHoverEnd);
            });

            // Cleanup function for these specific listeners
            return () => {
                hoverables.forEach((el) => {
                    el.removeEventListener("mouseenter", onHoverStart);
                    el.removeEventListener("mouseleave", onHoverEnd);
                });
            };
        };

        // Initialize listeners
        addEventListeners();

        // Periodically check for new hoverable elements (simple observer alternative)
        const interval = setInterval(() => {
            // Re-attach listeners is expensive, maybe just rely on global css hover or event delegation?
            // For simplicity in this specialized task, we'll try event delegation for hover
            // Actually, simpler: check element under cursor in the loop if needed? No, let's keep it simple.
            // Mouseover bubbles, so we can attach to document.
        }, 1000);

        // Event delegation for hovers (better for dynamic content)
        const checkHover = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.tagName === 'INPUT') {
                setLinkHovered(true);
            } else {
                setLinkHovered(false);
            }
        };
        // document.addEventListener('mouseover', checkHover); 
        // Using existing logic for now, simpler

        // Add listeners to existing elements
        document.querySelectorAll("a, button, input, .cursor-pointer").forEach(el => {
            el.addEventListener("mouseenter", () => setLinkHovered(true));
            el.addEventListener("mouseleave", () => setLinkHovered(false));
        });


        // Animation Loop
        let animationFrame;
        const loop = () => {
            // Lerp for the ring
            // ringX = ringX + (mouseX - ringX) * speed
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
            }

            animationFrame = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            removeEventListeners();
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    const baseClasses = "fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference";

    return (
        <>
            {/* Main Dot */}
            <div
                ref={cursorRef}
                className={`${baseClasses} w-2 h-2 bg-white -mt-1 -ml-1 ${hidden ? 'opacity-0' : 'opacity-100'}`}
                style={{ willChange: 'transform' }}
            />

            {/* Ring */}
            <div
                ref={ringRef}
                className={`${baseClasses} w-8 h-8 border border-white -mt-4 -ml-4 transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'
                    } ${clicked ? 'scale-75 bg-white/30' : ''
                    } ${linkHovered ? 'scale-150 bg-white/10 mix-blend-difference' : ''
                    } transition-transform duration-[50ms] ease-out`}
                style={{ willChange: 'transform' }}
            />
        </>
    );
};

export default CustomCursor;
