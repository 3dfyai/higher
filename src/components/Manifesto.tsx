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
                    // Faster typing speed
                    let delay = 20; // Base speed - much faster
                    
                    if (char === '.') delay = 80; // Shorter pause at periods
                    else if (char === ',') delay = 50;
                    else if (char === '—' || char === '–') delay = 60;
                    else if (char === ' ') delay = 15;
                    
                    const timeout = setTimeout(typeNextChar, delay);
                    timeoutRefs.current.set(lineIndex, timeout);
                    charIndex++;
                } else {
                    // Line complete - check for next line that's scrolled into view
                    timeoutRefs.current.delete(lineIndex);
                    setCurrentTypingLine(-1);
                    
                    // Check if any line is ready to type (has scrolled into view)
                    const checkNextLine = () => {
                        for (let i = 0; i < lines.length; i++) {
                            const lineRef = lineRefs.current[i];
                            const lineText = lineStates.get(i) || '';
                            const isCompleted = lineText.length === lines[i].length && lineText.length > 0;
                            
                            // If line hasn't been typed yet and is in view
                            if (lineRef && !isCompleted && lineText.length === 0) {
                                const rect = lineRef.getBoundingClientRect();
                                const windowHeight = window.innerHeight;
                                // If line is in viewport
                                if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
                                    setCurrentTypingLine(i);
                                    return;
                                }
                            }
                        }
                    };
                    
                    // Small delay before checking next line
                    const pauseTimeout = setTimeout(checkNextLine, 200);
                    timeoutRefs.current.set(-1, pauseTimeout);
                }
            }
        };
        
        // Small delay before starting to type
        const startTimeout = setTimeout(() => {
            typeNextChar();
        }, 150);
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

    // Show all lines instantly when section comes into view, then type as user scrolls
    useEffect(() => {
        if (!sectionRef.current || hasStarted) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                        // Make all lines visible instantly (but empty)
                        // Lines will type individually as they scroll into view
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
        };
    }, [hasStarted]);

    // Individual line observers - trigger typing as each line scrolls into view
    useEffect(() => {
        if (!hasStarted) return;

        const observers: IntersectionObserver[] = [];
        const startedTyping = new Set<number>();

        lineRefs.current.forEach((lineRef, index) => {
            if (!lineRef) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const lineText = lineStates.get(index) || '';
                            const isCompleted = lineText.length === lines[index].length && lineText.length > 0;
                            
                            // Only start typing if line hasn't been typed yet and isn't currently typing
                            if (!isCompleted && !startedTyping.has(index) && currentTypingLine !== index) {
                                startedTyping.add(index);
                                
                                // If no line is currently typing, start this one
                                if (currentTypingLine === -1) {
                                    setCurrentTypingLine(index);
                                }
                                // Otherwise, it will start when current line finishes
                            }
                        }
                    });
                },
                {
                    rootMargin: '0px 0px -30% 0px',
                    threshold: 0.2
                }
            );

            observer.observe(lineRef);
            observers.push(observer);
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, [hasStarted, currentTypingLine, lineStates, lines]);

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
                    // Show line container immediately when section is visible, but text types on scroll
                    const isVisible = hasStarted; // All lines visible once section is in view
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
