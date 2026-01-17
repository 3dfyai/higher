import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [lineStates, setLineStates] = useState<Map<number, string>>(new Map());
    const [currentTypingLine, setCurrentTypingLine] = useState<number>(-1);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const tokenInfoRef = useRef<HTMLDivElement>(null);
    const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const startedTypingRef = useRef<Set<number>>(new Set());

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
        // Prevent retyping if already started
        if (startedTypingRef.current.has(lineIndex)) {
            return;
        }
        
        // Check if previous line is completed (unless it's the first line)
        if (lineIndex > 0) {
            const prevLineText = lineStates.get(lineIndex - 1) || '';
            const prevLineFull = lines[lineIndex - 1];
            if (prevLineText.length < prevLineFull.length) {
                // Previous line not complete, don't start typing yet
                return;
            }
        }
        
        startedTypingRef.current.add(lineIndex);
        
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
                    // Line complete
                    timeoutRefs.current.delete(lineIndex);
                    setCurrentTypingLine(-1);
                    
                    // Check if all lines are complete
                    if (lineIndex === lines.length - 1) {
                        setIsTypingComplete(true);
                    }
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

    // Use IntersectionObserver to trigger typing for each line on scroll
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        lineRefs.current.forEach((lineRef, index) => {
            if (!lineRef) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Only start typing if:
                            // 1. Not already typing another line
                            // 2. Not already started this line
                            // 3. It's the first line (index 0), OR previous line is completed
                            if (currentTypingLine !== -1 || startedTypingRef.current.has(index)) {
                                return;
                            }
                            
                            const canStart = index === 0 || (() => {
                                const prevLineText = lineStates.get(index - 1) || '';
                                const prevLineFull = lines[index - 1];
                                return prevLineText.length === prevLineFull.length;
                            })();

                            if (canStart) {
                                setCurrentTypingLine(index);
                            }
                        }
                    });
                },
                {
                    rootMargin: '0px 0px -30% 0px', // Trigger when line is 30% from bottom of viewport
                    threshold: 0.3
                }
            );

            observer.observe(lineRef);
            observers.push(observer);
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, [lineStates, currentTypingLine]);

    // Scroll-triggered reveals for elements below text (after typing completes)
    useEffect(() => {
        if (!isTypingComplete) return;

        const elements = [
            { ref: imageRef, id: 'image' },
            { ref: tokenInfoRef, id: 'tokenInfo' }
        ];

        const observers: IntersectionObserver[] = [];

        elements.forEach(({ ref, id }) => {
            if (!ref.current) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleElements(prev => {
                                const updated = new Set(prev);
                                updated.add(id);
                                return updated;
                            });
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '0px 0px 50% 0px', // Trigger when element is 50% above viewport
                    threshold: 0.01 // Trigger as soon as any part is visible
                }
            );

            observer.observe(ref.current);
            observers.push(observer);
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, [isTypingComplete]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Cleanup all timeouts
            timeoutRefs.current.forEach((timeout) => {
                clearTimeout(timeout);
            });
            timeoutRefs.current.clear();
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
                    const displayText = isCompleted ? line : typedText;

                    return (
                        <div
                            key={index}
                            ref={(el) => {
                                lineRefs.current[index] = el;
                            }}
                            className={`manifesto-line manifesto-line-${index} manifesto-line-visible ${isCompleted ? 'manifesto-line-completed' : ''} ${isTyping ? 'manifesto-line-typing' : ''}`}
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
            <div 
                ref={imageRef}
                className={`ascended-image-container ${visibleElements.has('image') ? 'element-visible' : 'element-hidden'}`}
            >
                <img 
                    src="/Add a heading (30).png" 
                    alt="Ascended" 
                    className="ascended-image"
                />
            </div>
            <div 
                ref={tokenInfoRef}
                className={`token-info-section ${visibleElements.has('tokenInfo') ? 'element-visible' : 'element-hidden'}`}
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
