import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    const fullManifestoText = `Ascend is not merely a direction—it is a continuous state of being. It represents the unwavering conviction that limits are artificial constructs. In an environment often defined by volatility and skepticism, to Ascend is to embody resilience. It is a refusal to accept stagnation.

We are the architects of our own trajectory. When market sentiment faltered, we remained steadfast. When uncertainty spread, we maintained clarity. We understood a fundamental truth: potential is infinite. Every peak is simply a new baseline. Every correction is an opportunity to recalibrate before the next elevation.

To Ascend is to adopt a mindset of abundance and longevity. It is the philosophy that distinguishes the visionary from the reactionary. When you Ascend, you do not fear the charts; you analyze them with the certainty of the long-term trend. The destination has always been upwards.

This community is forged by those who demand excellence. We are not here for transient gains. We are here because we align with a movement that resonates with our core ambition: growth. Uninhibited growth. Unwavering belief. A definitive stance against mediocrity.

Ascend is the response to every doubt. "What is the strategy?" Ascend. "What is the objective?" Ascend. "Where does it end?" It doesn't. This is not speculation; it is the inevitable result of collective conviction.

Welcome to the ascent. Whether you are new to the journey or a foundational member, you are part of a paradigm shift. There is no regression here. There is only the forward momentum.`;

    // Split text into lines (split by newlines and also by sentence breaks for better effect)
    const lines = fullManifestoText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .flatMap(paragraph => {
            // Split paragraphs into sentences for more granular animation
            const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
            return sentences.length > 0 ? sentences : [paragraph];
        });

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const sectionTop = sectionRef.current.offsetTop;
            const sectionHeight = sectionRef.current.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            // Calculate when section is in viewport
            const sectionStart = sectionTop - windowHeight * 0.6;
            const sectionEnd = sectionTop + sectionHeight - windowHeight * 0.2;

            if (scrollY >= sectionStart && scrollY <= sectionEnd) {
                const progress = Math.max(0, Math.min(1, (scrollY - sectionStart) / (sectionEnd - sectionStart)));
                const totalLines = lines.length;
                
                // Calculate which lines should be visible based on scroll progress
                const newVisibleLines = new Set<number>();
                
                lineRefs.current.forEach((lineRef, index) => {
                    if (!lineRef) return;
                    
                    // Each line appears progressively as we scroll through the section
                    // Spread the reveal across the scroll range
                    const lineThreshold = (index + 1) / totalLines;
                    const adjustedProgress = progress * 1.1; // Slight overlap for smoother transition
                    
                    if (lineThreshold <= adjustedProgress) {
                        newVisibleLines.add(index);
                    }
                });

                setVisibleLines(newVisibleLines);
            } else if (scrollY < sectionStart) {
                // Before section, no lines visible
                setVisibleLines(new Set());
            } else if (scrollY > sectionEnd) {
                // After section, all lines visible
                setVisibleLines(new Set(lines.map((_, i) => i)));
            }
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', throttledScroll);
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

        // Use ResizeObserver only (more efficient than resize events)
        const resizeObserver = new ResizeObserver(() => {
            // Throttle ResizeObserver callbacks
            requestAnimationFrame(updateBottomPosition);
        });

        if (sectionRef.current) {
            resizeObserver.observe(sectionRef.current);
        }

        // Only listen to resize for window size changes, not scroll
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
                        const parts = text.split(/(Ascend)/gi);
                        return parts.map((part, i) => 
                            part.toLowerCase() === 'ascend' ? (
                                <span key={i} className="manifesto-highlight">{part}</span>
                            ) : (
                                part
                            )
                        );
                    };

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                lineRefs.current[index] = el;
                            }}
                            className={`manifesto-line ${isVisible ? 'manifesto-line-visible' : ''}`}
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
