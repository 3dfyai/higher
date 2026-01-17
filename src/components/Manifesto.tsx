import React, { useState, useEffect, useRef } from 'react';

interface ManifestoProps {
    onHeightChange?: (bottomPosition: number) => void;
}

const Manifesto: React.FC<ManifestoProps> = ({ onHeightChange }) => {
    const [lineStates, setLineStates] = useState<Map<number, string>>(new Map());
    const [currentTypingLine, setCurrentTypingLine] = useState<number>(-1);
    const [hasStarted, setHasStarted] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const tokenInfoRef = useRef<HTMLDivElement>(null);
    const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const autoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollLockPositionRef = useRef<number>(0);
    const isScrollingRef = useRef<boolean>(false);

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
                    // Line complete - auto-scroll and start next line
                    timeoutRefs.current.delete(lineIndex);
                    
                    // Check if all lines are complete
                    const allComplete = lineIndex === lines.length - 1;
                    
                    if (allComplete) {
                        // All typing complete - unlock scrolling
                        setIsTypingComplete(true);
                        setCurrentTypingLine(-1);
                        
                        setTimeout(() => {
                            // Restore scroll position and unlock smoothly
                            const savedScroll = scrollLockPositionRef.current;
                            
                            // Use requestAnimationFrame to ensure smooth transition
                            requestAnimationFrame(() => {
                                // Restore body styles
                                document.body.style.overflow = '';
                                document.body.style.position = '';
                                document.body.style.top = '';
                                document.body.style.left = '';
                                document.body.style.right = '';
                                document.body.style.width = '';
                                document.documentElement.style.scrollBehavior = '';
                                
                                // Restore scroll position without smooth to prevent layout shift
                                window.scrollTo({
                                    top: savedScroll,
                                    behavior: 'auto'
                                });
                            });
                        }, 100);
                    } else {
                        // Auto-scroll to next line and start typing
                        const nextLineIndex = lineIndex + 1;
                        const nextLineRef = lineRefs.current[nextLineIndex];
                        
                        if (nextLineRef) {
                            // Calculate target scroll position
                            const rect = nextLineRef.getBoundingClientRect();
                            const targetOffset = rect.top - (window.innerHeight * 0.4);
                            
                            // Enable smooth scrolling temporarily
                            isScrollingRef.current = true;
                            
                            // Smoothly update scroll position
                            const startPosition = scrollLockPositionRef.current;
                            const distance = targetOffset;
                            const duration = 600; // 600ms smooth scroll
                            const startTime = performance.now();
                            
                            const animateScroll = (currentTime: number) => {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                
                                // Easing function for smooth scroll
                                const ease = 1 - Math.pow(1 - progress, 3);
                                const currentOffset = startPosition + (distance * ease);
                                
                                scrollLockPositionRef.current = currentOffset;
                                document.body.style.top = `-${currentOffset}px`;
                                
                                if (progress < 1) {
                                    requestAnimationFrame(animateScroll);
                                } else {
                                    isScrollingRef.current = false;
                                    // Start typing next line
                                    setCurrentTypingLine(nextLineIndex);
                                }
                            };
                            
                            requestAnimationFrame(animateScroll);
                        } else {
                            setCurrentTypingLine(-1);
                        }
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

    // Prevent scroll events when locked
    useEffect(() => {
        if (!hasStarted || isTypingComplete) return;

        const preventWheel = (e: WheelEvent) => {
            if (!isScrollingRef.current) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const preventTouch = (e: TouchEvent) => {
            if (!isScrollingRef.current) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener('wheel', preventWheel, { passive: false });
        window.addEventListener('touchmove', preventTouch, { passive: false });

        return () => {
            window.removeEventListener('wheel', preventWheel);
            window.removeEventListener('touchmove', preventTouch);
        };
    }, [hasStarted, isTypingComplete]);

    // Show all lines instantly when section comes into view, lock scrolling, and start typing
    useEffect(() => {
        if (!sectionRef.current || hasStarted) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasStarted) {
                        setHasStarted(true);
                        
                        // Save current scroll position
                        scrollLockPositionRef.current = window.scrollY || document.documentElement.scrollTop;
                        
                        // Lock scrolling smoothly
                        document.body.style.overflow = 'hidden';
                        document.body.style.position = 'fixed';
                        document.body.style.top = `-${scrollLockPositionRef.current}px`;
                        document.body.style.left = '0';
                        document.body.style.right = '0';
                        document.body.style.width = '100%';
                        
                        // Start typing first line after a brief delay
                        setTimeout(() => {
                            setCurrentTypingLine(0);
                        }, 300);
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
            // Re-enable scrolling if component unmounts
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            if (autoScrollTimeoutRef.current) {
                clearTimeout(autoScrollTimeoutRef.current);
            }
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
