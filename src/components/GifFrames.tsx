import React, { useState, useEffect } from 'react';

const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Public beta key

// Hype & Energy Search Terms - Pure Visuals, No Crypto Memes
const SEARCH_TERMS = [
    'futuristic city',
    'cyberpunk aesthetic',
    'neon lights',
    'rocket launch',
    'space travel',
    'anime power up',
    'matrix code',
    'supernova explosion',
    'glitch art',
    'victory podium',
    'gold medal',
    'mountain summit'
];

interface GifFrameProps {
    className: string;
    style: React.CSSProperties;
    offset?: number;
}

const GifFrame: React.FC<GifFrameProps> = ({ className, style, offset = 0 }) => {
    const [gifUrl, setGifUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const frameRef = React.useRef<HTMLDivElement>(null);

    const fetchGif = async () => {
        try {
            // Pick a random term
            const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
            const randomOffset = offset + Math.floor(Math.random() * 50);

            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${term}&limit=1&offset=${randomOffset}&rating=g`
            );
            const data = await response.json();
            if (data.data && data.data[0]) {
                setGifUrl(data.data[0].images.original.url);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching GIF:', error);
            setIsLoading(false);
        }
    };

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

    useEffect(() => {
        if (!isVisible) return;

        fetchGif();
        // Change GIF every 15 seconds (further reduced for performance)
        const interval = setInterval(fetchGif, 15000);
        return () => clearInterval(interval);
    }, [offset, isVisible]);

    return (
        <div ref={frameRef} className={`gif-frame ${className}`} style={style}>
            <div className="tape tape-tl"></div>
            <div className="tape tape-tr"></div>
            <div className="gif-frame-content">
                {!isVisible || isLoading ? (
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
        let resizeTimeout: NodeJS.Timeout;
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
            {/* === BELOW MANIFESTO (dynamically positioned, reduced to 10 GIFs for performance) === */}
            <GifFrame className="gif-frame-1" style={{ top: getPosition(0), left: '5%' }} offset={0} />
            <GifFrame className="gif-frame-2" style={{ top: getPosition(0), right: '5%' }} offset={5} />
            <GifFrame className="gif-frame-3" style={{ top: getPosition(1), left: '15%' }} offset={10} />
            <GifFrame className="gif-frame-4" style={{ top: getPosition(1), right: '15%' }} offset={15} />
            <GifFrame className="gif-frame-5" style={{ top: getPosition(2), left: '3%' }} offset={20} />
            <GifFrame className="gif-frame-6" style={{ top: getPosition(2), right: '3%' }} offset={25} />
            <GifFrame className="gif-frame-7" style={{ top: getPosition(3), left: '10%' }} offset={30} />
            <GifFrame className="gif-frame-8" style={{ top: getPosition(3), right: '10%' }} offset={35} />
            <GifFrame className="gif-frame-9" style={{ top: getPosition(4), left: '2%' }} offset={40} />
            <GifFrame className="gif-frame-10" style={{ top: getPosition(4), right: '2%' }} offset={45} />
        </>
    );
};

export default GifFrames;
