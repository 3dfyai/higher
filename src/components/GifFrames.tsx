import React, { useState, useEffect } from 'react';

// Specific GIF URLs - Space and Psychedelic Black and White
const GIF_URLS = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2xqejRhZzcyZTh4aTRrZ2F1OWQxeHg2ZHgycDhuY2F6Y3p6cGFoOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Xd7QqFPv4IVAz8dnog/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWF3bHJsOXh3anpsZXhsZzB5Znc3cjBhanhyY3MxZjR6b3FsbTBrNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiTno2GL7HupVuz84/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWF3bHJsOXh3anpsZXhsZzB5Znc3cjBhanhyY3MxZjR6b3FsbTBrNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2leAQwrpRXPqUd65ct/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dWF3bHJsOXh3anpsZXhsZzB5Znc3cjBhanhyY3MxZjR6b3FsbTBrNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/HZwwVY3r34sj1kgIix/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2V1NXl4YWVkdmpicDF1MTRubnZyOGFxOHZpMHoydjVwejg4ZjUzbSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1438GQ24SMwUg0/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGhiNDljdGV1c3F5MzZtY3phbXlvaHByazVzMWFndW9xb3N3NDBxeSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fxQWkGoNy5eJPEM6rx/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aWlmc2JyNHdwcHV1aTFtcWEzY3ZyZ3p2ZWNkeTU0Y2Z5ZDdvMWd1MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/nfh0brn7xRvZ2eCcVO/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aWlmc2JyNHdwcHV1aTFtcWEzY3ZyZ3p2ZWNkeTU0Y2Z5ZDdvMWd1MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dZdPipFYim6ORRaVk1/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG9rNXNtc3B4OGY1N2I1bTZ4ejI0bGM5aHBjcnpveGs0cXJmaGEydiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vCVbnPl6tZ30c/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MHhrOGljdTZvcnp5c2hwZWc2bHZxMHFqa2hxZmQwNmJidnVtOGExayZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/PkKzNQjwPy7GvxZbfe/giphy.gif'
];

interface GifFrameProps {
    className: string;
    style: React.CSSProperties;
    gifIndex: number;
}

const GifFrame: React.FC<GifFrameProps> = ({ className, style, gifIndex }) => {
    const [isVisible, setIsVisible] = useState(false);
    const frameRef = React.useRef<HTMLDivElement>(null);
    const gifUrl = GIF_URLS[gifIndex % GIF_URLS.length];

    // Lazy load GIFs only when they're about to be visible
    useEffect(() => {
        if (!frameRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);
                    }
                });
            },
            { rootMargin: '200px' } // Start loading 200px before entering viewport
        );

        observer.observe(frameRef.current);
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <div ref={frameRef} className={`gif-frame ${className}`} style={style}>
            <div className="tape tape-tl"></div>
            <div className="tape tape-tr"></div>
            <div className="gif-frame-content">
                {!isVisible ? (
                    <span className="gif-loading">LOADING...</span>
                ) : (
                    <img src={gifUrl} alt="Ascend GIF" loading="lazy" />
                )}
            </div>
        </div>
    );
};

interface GifFramesProps {
    manifestoBottomPosition?: number;
}

const GifFrames: React.FC<GifFramesProps> = ({ manifestoBottomPosition }) => {
    const [windowHeight, setWindowHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 1080);
    const [gifPositions, setGifPositions] = useState<Record<number, string>>({});

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        // Throttle resize events
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const throttledResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150);
        };

        window.addEventListener('resize', throttledResize, { passive: true });
        return () => {
            window.removeEventListener('resize', throttledResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    // Memoize position calculations
    useEffect(() => {
        if (!manifestoBottomPosition) return;

        const rowSpacing = 30;
        const startOffset = 10;
        const positions: Record<number, string> = {};

        // Calculate all positions once
        const offsets = [
            startOffset,
            startOffset + rowSpacing,
            startOffset + rowSpacing * 2,
            startOffset + rowSpacing * 3,
            startOffset + rowSpacing * 4,
            startOffset + rowSpacing * 5,
            startOffset + rowSpacing * 6,
        ];

        offsets.forEach((offsetVh, index) => {
            const offsetPx = (offsetVh / 100) * windowHeight;
            positions[index] = `${manifestoBottomPosition + offsetPx}px`;
        });

        setGifPositions(positions);
    }, [manifestoBottomPosition, windowHeight]);

    // Spacing between GIF rows (in viewport heights)
    const rowSpacing = 30; // 30vh between rows
    const startOffset = 10; // Start 10vh after manifesto ends

    const getTopPosition = (offsetVh: number) => {
        if (!manifestoBottomPosition) {
            return `calc(460vh + ${offsetVh}px)`;
        }
        const offsetPx = (offsetVh / 100) * windowHeight;
        return `${manifestoBottomPosition + offsetPx}px`;
    };

    // Use memoized positions when available, fallback to calculation
    const getPosition = (rowIndex: number) => {
        if (gifPositions[rowIndex]) {
            return gifPositions[rowIndex];
        }
        return getTopPosition(startOffset + rowSpacing * rowIndex);
    };

    return (
        <>
            {/* === BELOW MANIFESTO (using specific GIF URLs) === */}
            <GifFrame className="gif-frame-1" style={{ top: getPosition(0), left: '5%' }} gifIndex={0} />
            <GifFrame className="gif-frame-2" style={{ top: getPosition(0), right: '5%' }} gifIndex={1} />
            <GifFrame className="gif-frame-3" style={{ top: getPosition(1), left: '15%' }} gifIndex={2} />
            <GifFrame className="gif-frame-4" style={{ top: getPosition(1), right: '15%' }} gifIndex={3} />
            <GifFrame className="gif-frame-5" style={{ top: getPosition(2), left: '3%' }} gifIndex={4} />
            <GifFrame className="gif-frame-6" style={{ top: getPosition(2), right: '3%' }} gifIndex={5} />
            <GifFrame className="gif-frame-7" style={{ top: getPosition(3), left: '10%' }} gifIndex={6} />
            <GifFrame className="gif-frame-8" style={{ top: getPosition(3), right: '10%' }} gifIndex={7} />
            <GifFrame className="gif-frame-9" style={{ top: getPosition(4), left: '2%' }} gifIndex={8} />
            <GifFrame className="gif-frame-10" style={{ top: getPosition(4), right: '2%' }} gifIndex={9} />
        </>
    );
};

export default GifFrames;
