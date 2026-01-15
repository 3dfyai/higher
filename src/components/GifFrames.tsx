import { useState, useEffect } from 'react';

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

    useEffect(() => {
        fetchGif();
        // Change GIF every 3 seconds
        const interval = setInterval(fetchGif, 3000);
        return () => clearInterval(interval);
    }, [offset]);

    return (
        <div className={`gif-frame ${className}`} style={style}>
            <div className="tape tape-tl"></div>
            <div className="tape tape-tr"></div>
            <div className="gif-frame-content">
                {isLoading ? (
                    <span className="gif-loading">LOADING...</span>
                ) : (
                    <img src={gifUrl} alt="Ascend GIF" />
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

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate starting position relative to manifesto end
    // Add spacing (e.g., 10vh) after manifesto ends
    const getTopPosition = (offsetVh: number) => {
        if (!manifestoBottomPosition) {
            // Fallback to static position if manifesto position not available
            return `calc(460vh + ${offsetVh}px)`;
        }
        // Convert offsetVh (in viewport heights) to pixels and add to manifesto bottom
        const offsetPx = (offsetVh / 100) * windowHeight;
        return `${manifestoBottomPosition + offsetPx}px`;
    };

    // Spacing between GIF rows (in viewport heights)
    const rowSpacing = 30; // 30vh between rows
    const startOffset = 10; // Start 10vh after manifesto ends

    return (
        <>
            {/* === BELOW MANIFESTO (dynamically positioned) === */}
            <GifFrame className="gif-frame-1" style={{ top: getTopPosition(startOffset), left: '5%' }} offset={0} />
            <GifFrame className="gif-frame-2" style={{ top: getTopPosition(startOffset), right: '5%' }} offset={5} />
            <GifFrame className="gif-frame-3" style={{ top: getTopPosition(startOffset + rowSpacing), left: '15%' }} offset={10} />
            <GifFrame className="gif-frame-4" style={{ top: getTopPosition(startOffset + rowSpacing), right: '15%' }} offset={15} />
            <GifFrame className="gif-frame-5" style={{ top: getTopPosition(startOffset + rowSpacing * 2), left: '3%' }} offset={20} />
            <GifFrame className="gif-frame-6" style={{ top: getTopPosition(startOffset + rowSpacing * 2), right: '3%' }} offset={25} />
            <GifFrame className="gif-frame-7" style={{ top: getTopPosition(startOffset + rowSpacing * 3), left: '10%' }} offset={30} />
            <GifFrame className="gif-frame-8" style={{ top: getTopPosition(startOffset + rowSpacing * 3), right: '10%' }} offset={35} />
            <GifFrame className="gif-frame-9" style={{ top: getTopPosition(startOffset + rowSpacing * 4), left: '2%' }} offset={40} />
            <GifFrame className="gif-frame-10" style={{ top: getTopPosition(startOffset + rowSpacing * 4), right: '2%' }} offset={45} />
            <GifFrame className="gif-frame-1" style={{ top: getTopPosition(startOffset + rowSpacing * 4), left: '35%' }} offset={50} />
            <GifFrame className="gif-frame-2" style={{ top: getTopPosition(startOffset + rowSpacing * 5), left: '8%' }} offset={55} />
            <GifFrame className="gif-frame-3" style={{ top: getTopPosition(startOffset + rowSpacing * 5), right: '8%' }} offset={60} />
            <GifFrame className="gif-frame-4" style={{ top: getTopPosition(startOffset + rowSpacing * 6), left: '5%' }} offset={65} />
            <GifFrame className="gif-frame-5" style={{ top: getTopPosition(startOffset + rowSpacing * 6), right: '5%' }} offset={70} />
        </>
    );
};

export default GifFrames;
