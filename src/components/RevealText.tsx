import React, { useRef, useState, useEffect } from 'react';

interface RevealTextProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}

const RevealText: React.FC<RevealTextProps> = ({ children, className = '', threshold = 0.2 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -100px 0px' // Trigger slightly before it leaves the bottom, so it's visible when "scrolling into view" properly
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    return (
        <div ref={ref} className={`reveal-text-wrapper ${isVisible ? 'revealed' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default RevealText;
