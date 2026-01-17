import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [lineStates, setLineStates] = useState<Map<number, string>>(new Map());
    const [currentTypingLine, setCurrentTypingLine] = useState<number>(-1);
    const [hasStarted, setHasStarted] = useState(false);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

    const lines = [
        "Ascend is not merely a direction—it is a continuous state of being.",
        "It represents the unwavering conviction that limits are artificial constructs.",
        "Not everyone was meant to survive the trenches.",
        "Failure was the filter.",
        "Pressure was the path.",
        "Elevation was inevitable."
    ];

    // Type a single line character by character
    const typeLine = (lineIndex: number) => {
        const fullText = lines[lineIndex];
        let charIndex = 0;
        
        const typeNextChar = () => {
            if (charIndex <= fullText.length) {
                setLineStates(prev => {
                    const updated = new Map(prev);
                    updated.set(lineIndex, fullText.substring(0, charIndex));
                    return updated;
                });
                
                if (charIndex < fullText.length) {
                    const char = fullText[charIndex];
                    // Variable delays for cinematic effect
                    let delay = 40; // Base speed
                    
                    if (char === '.') delay = 200; // Dramatic pause at periods
                    else if (char === ',') delay = 120;
                    else if (char === '—' || char === '–') delay = 150;
                    else if (char === ' ') delay = 25;
                    
                    const timeout = setTimeout(typeNextChar, delay);
                    timeoutRefs.current.set(lineIndex, timeout);
                    charIndex++;
                } else {
                    // Line complete - start next line after pause
                    timeoutRefs.current.delete(lineIndex);
                    
                    if (lineIndex < lines.length - 1) {
                        // Dramatic pause before next line
                        const pauseTimeout = setTimeout(() => {
                            setCurrentTypingLine(lineIndex + 1);
                        }, 1000); // 1 second pause between lines
                        timeoutRefs.current.set(-1, pauseTimeout);
                    } else {
                        setCurrentTypingLine(-1); // All done
                    }
                }
            }
        };
        
        // Small delay before starting to type
        const startTimeout = setTimeout(() => {
            typeNextChar();
        }, 400);
        timeoutRefs.current.set(lineIndex, startTimeout);
    };

    // Start typing when current line changes
    useEffect(() => {
        if (currentTypingLine >= 0 && currentTypingLine < lines.length) {
            typeLine(currentTypingLine);
        }
        
        return () => {
            // Cleanup timeouts for this line
            timeoutRefs.current.forEach((timeout, key) => {
                if (key === currentTypingLine || key === -1) {
                    clearTimeout(timeout);
                    timeoutRefs.current.delete(key);
                }
            });
        };
    }, [currentTypingLine]);

    // Trigger start when section comes into view
    useEffect(() => {
        if (!sectionRef.current || hasStarted) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                        // Start cinematic sequence
                        setTimeout(() => {
                            setCurrentTypingLine(0);
                        }, 600);
                    }
                });
            },
            {
                rootMargin: '0px 0px -20% 0px',
                threshold: 0.1
            }
        );

        observer.observe(sectionRef.current);

        return () => {
            observer.disconnect();
            timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
            timeoutRefs.current.clear();
        };
    }, [hasStarted]);

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
                    const typedText = lineStates.get(index) || '';
                    const isTyping = index === currentTypingLine;
                    const isCompleted = typedText.length === line.length && typedText.length > 0;
                    const isVisible = isTyping || isCompleted;
                    const displayText = isCompleted ? line : typedText;

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                lineRefs.current[index] = el;
                            }}
                            className={`manifesto-line manifesto-line-${index} ${isVisible ? 'manifesto-line-visible' : ''} ${isCompleted ? 'manifesto-line-completed' : ''} ${isTyping ? 'manifesto-line-typing' : ''}`}
                        >
                            <span className="manifesto-text">
                                {displayText ? highlightWord(displayText) : '\u00A0'}
                            </span>
                            {isTyping && typedText.length < line.length && (
                                <span className="typewriter-cursor">|</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="ascended-image-container">
                <img 
                    src="/Add a heading (30).png" 
                    alt="Ascended" 
                    className="ascended-image"
                />
            </div>
            <div className="token-info-section">
                <div className="token-symbol">$ASCEND</div>
                <div className="ca-section">
                    <span className="ca-label">CA:</span>
                    <span className="ca-value">CA</span>
                </div>
                <div className="social-links">
                    <a href="#" className="social-link" aria-label="Pumpfun">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </a>
                    <a href="#" className="social-link" aria-label="DexScreener">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 12H21" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 3V21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </a>
                    <a href="#" className="social-link" aria-label="X (Twitter)">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Manifesto;
