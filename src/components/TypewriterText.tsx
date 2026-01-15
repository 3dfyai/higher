import React, { useState, useEffect, useRef, useMemo } from 'react';

interface TypewriterTextProps {
    text: string;
    highlightWord?: string;
    speed?: number;
    className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    highlightWord = "Ascend",
    speed = 20,
    className = ''
}) => {
    const [charIndex, setCharIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // Tokenize text into segments: [ {text: "...", isHighlight: true/false}, ... ]
    const tokens = useMemo(() => {
        if (!highlightWord) return [{ text, isHighlight: false }];

        const regex = new RegExp(`(${highlightWord})`, 'gi');
        const parts = text.split(regex);
        return parts.map(part => ({
            text: part,
            isHighlight: part.toLowerCase() === highlightWord.toLowerCase()
        }));
    }, [text, highlightWord]);

    // Flatten text length for index calculation
    const fullTextLength = text.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        if (charIndex >= fullTextLength) return;

        const interval = setInterval(() => {
            setCharIndex(prev => {
                if (prev >= fullTextLength) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [started, charIndex, fullTextLength, speed]);

    // Render Logic
    let currentGlobalIndex = 0;

    return (
        <div ref={elementRef} className={`typewriter-container ${className}`}>
            {tokens.map((token, i) => {
                const start = currentGlobalIndex;
                const end = start + token.text.length;
                currentGlobalIndex = end;

                // Determine state of this token relative to typewriter cursor
                // 1. Fully revealed
                if (charIndex >= end) {
                    return (
                        <span key={i} className={token.isHighlight ? 'text-highlight' : ''}>
                            {token.text}
                        </span>
                    );
                }
                // 2. Not revealed at all (Redacted)
                else if (charIndex <= start) {
                    return (
                        <span key={i} className="text-redacted">
                            {token.text}
                        </span>
                    );
                }
                // 3. Partially revealed (Currently being typed)
                else {
                    const revealedSlice = token.text.slice(0, charIndex - start);
                    const redactedSlice = token.text.slice(charIndex - start);
                    return (
                        <span key={i}>
                            <span className={token.isHighlight ? 'text-highlight' : ''}>
                                {revealedSlice}
                            </span>
                            <span className="typewriter-cursor">█</span>
                            <span className="text-redacted">
                                {redactedSlice}
                            </span>
                        </span>
                    );
                }
            })}
        </div>
    );
};

export default TypewriterText;
