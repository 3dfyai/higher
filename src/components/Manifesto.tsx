import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    const lines = [
        "Ascend is not merely a direction—it is a continuous state of being.",
        "It represents the unwavering conviction that limits are artificial constructs.",
        "Not everyone was meant to survive the trenches.",
        "Failure was the filter.",
        "Pressure was the path.",
        "Elevation was inevitable."
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;

            // Start showing text when section enters viewport (earlier trigger)
            const sectionStart = sectionTop - windowHeight * 0.7; // Start earlier
            const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.1;
            const sectionRange = sectionEnd - sectionStart;

            if (scrollY >= sectionStart && scrollY <= sectionEnd) {
                const progress = Math.max(0, Math.min(1, (scrollY - sectionStart) / sectionRange));
                const totalLines = lines.length;
                
                const newVisibleLines = new Set<number>();
                
                // Each line appears earlier - spread across the scroll range
                lineRefs.current.forEach((lineRef, index) => {
                    if (!lineRef) return;
                    
                    // Adjusted thresholds for earlier appearance, especially for lines 3 and 4
                    const thresholds = [
                        0.05,  // Line 0: appears at 5%
                        0.20,  // Line 1: appears at 20%
                        0.35,  // Line 2: appears at 35%
                        0.45,  // Line 3: appears at 45% (was 55%)
                        0.60,  // Line 4: appears at 60% (was 71.6%)
                        0.75   // Line 5: appears at 75% (was 88.3%)
                    ];
                    
                    const lineThreshold = thresholds[index] || (index + 0.1) / totalLines;
                    
                    if (progress >= lineThreshold) {
                        newVisibleLines.add(index);
                    }
                });

                setVisibleLines(newVisibleLines);
            } else if (scrollY < sectionStart) {
                setVisibleLines(new Set());
            } else if (scrollY > sectionEnd) {
                // All lines visible after section
                setVisibleLines(new Set(lines.map((_, i) => i)));
            }
        };

        // Optimized scroll handler with debouncing
        let rafId: number | null = null;
        const throttledScroll = () => {
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    handleScroll();
                    rafId = null;
                });
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [lines.length]);

    // Calculate and report the bottom position of the manifesto section
    useEffect(() => {
        if (!onHeightChange) return;

        const updateBottomPosition = () => {
            if (!sectionRef.current) return;
            
            const rect = sectionRef.current.getBoundingClientRect();
            const scrollY = window.scrollY;
            const bottomPosition = rect.bottom + scrollY;
            
            onHeightChange(bottomPosition);
        };

        // Initial calculation
        updateBottomPosition();

        // Use ResizeObserver only
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateBottomPosition);
        });

        if (sectionRef.current) {
            resizeObserver.observe(sectionRef.current);
        }

        let resizeTimeout: NodeJS.Timeout;
        const throttledResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateBottomPosition, 200);
        };

        window.addEventListener('resize', throttledResize, { passive: true });

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', throttledResize);
            clearTimeout(resizeTimeout);
        };
    }, [onHeightChange, lines.length]);

    return (
        <section ref={sectionRef} className="manifesto-section-cinematic">
            <div className="manifesto-lines-container">
                {lines.map((line, index) => {
                    const isVisible = visibleLines.has(index);
                    
                    const highlightWord = (text: string) => {
                        const parts = text.split(/(Ascend|trenches|Failure|Pressure|Elevation)/gi);
                        return parts.map((part, i) => {
                            const lowerPart = part.toLowerCase();
                            if (['ascend', 'trenches', 'failure', 'pressure', 'elevation'].includes(lowerPart)) {
                                return <span key={i} className="manifesto-highlight">{part}</span>;
                            }
                            return part;
                        });
                    };

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                lineRefs.current[index] = el;
                            }}
                            className={`manifesto-line manifesto-line-${index} ${isVisible ? 'manifesto-line-visible' : ''}`}
                        >
                            {highlightWord(line)}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Manifesto;
