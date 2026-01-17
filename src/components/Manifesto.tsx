import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const tokenInfoRef = useRef<HTMLDivElement>(null);

    const lines = [
        "Ascend is not merely a direction—it is a continuous state of being.",
        "It represents the unwavering conviction that limits are artificial constructs.",
        "Not everyone was meant to survive the trenches.",
        "Failure was the filter.",
        "Pressure was the path.",
        "Elevation was inevitable."
    ];

    // Show elements below text immediately
    useEffect(() => {
        if (imageRef.current) {
            imageRef.current.classList.add('element-visible');
        }
        if (tokenInfoRef.current) {
            tokenInfoRef.current.classList.add('element-visible');
        }
    }, []);

    // IntersectionObserver for fade-in lines
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        lineRefs.current.forEach((lineRef, index) => {
            if (!lineRef) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleLines(prev => {
                                const updated = new Set(prev);
                                updated.add(index);
                                return updated;
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '0px 0px -20% 0px',
                    threshold: 0.1
                }
            );

            observer.observe(lineRef);
            observers.push(observer);
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, []);

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

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateBottomPosition);
        });

        if (sectionRef.current) {
            resizeObserver.observe(sectionRef.current);
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
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
        <section ref={sectionRef} className="manifesto-section-cinematic">
            <div className="manifesto-lines-container">
                {lines.map((line, index) => {
                    const isVisible = visibleLines.has(index);

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                lineRefs.current[index] = el;
                            }}
                            className={`manifesto-line manifesto-line-${index} ${isVisible ? 'manifesto-line-visible' : 'manifesto-line-hidden'}`}
                        >
                            <span className="manifesto-text">
                                {highlightWord(line)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div 
                ref={imageRef}
                className="ascended-image-container element-visible"
            >
                <img 
                    src="/Add a heading (30)_converted.webp" 
                    alt="Ascended" 
                    className="ascended-image"
                />
            </div>
            <div 
                ref={tokenInfoRef}
                className="token-info-section element-visible"
            >
                <div className="token-symbol">$ASCEND</div>
                <div className="ca-section">
                    <span className="ca-label">CA:</span>
                    <span className="ca-value">CA</span>
                </div>
                <div className="social-links">
                    <a href="#" className="social-link" aria-label="Pumpfun">
                        <img src="/PUMPFUN.png" alt="Pumpfun" className="social-logo" />
                    </a>
                    <a href="#" className="social-link" aria-label="DexScreener">
                        <img src="/DEXSCREENER.png" alt="DexScreener" className="social-logo" />
                    </a>
                    <a href="#" className="social-link" aria-label="X (Twitter)">
                        <img src="/X.png" alt="X" className="social-logo" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
