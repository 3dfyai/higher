import { useState, useEffect } from 'react';

const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Public beta key

// Varied search terms to avoid too many pudgy penguins
const SEARCH_TERMS = ['to the moon', 'rocket launch', 'success celebration', 'winning', 'victory dance', 'level up', 'going up', 'rise up', 'flying high', 'soaring', 'blast off', 'celebrate'];

interface GifFrameProps {
    className: string;
    style: React.CSSProperties;
    offset?: number;
    searchIndex?: number;
}

const GifFrame: React.FC<GifFrameProps> = ({ className, style, offset = 0, searchIndex = 0 }) => {
    const [gifUrl, setGifUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchGif = async () => {
        try {
            const term = SEARCH_TERMS[searchIndex % SEARCH_TERMS.length];
            const randomOffset = offset + Math.floor(Math.random() * 30);
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(term)}&limit=1&offset=${randomOffset}&rating=g`
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
        const interval = setInterval(fetchGif, 12000);
        return () => clearInterval(interval);
    }, [offset, searchIndex]);

    return (
        <div className={`gif-frame ${className}`} style={style}>
            <div className="tape tape-tl"></div>
            <div className="tape tape-tr"></div>
            <div className="gif-frame-content">
                {isLoading ? (
                    <span className="gif-loading">LOADING...</span>
                ) : (
                    <img src={gifUrl} alt="Higher GIF" />
                )}
            </div>
        </div>
    );
};

const GifFrames: React.FC = () => {
    return (
        <>
            {/* === AROUND MANIFESTO SIDES (170-320vh) === */}
            <GifFrame className="gif-frame-9" style={{ top: '175vh', right: '2%' }} offset={0} searchIndex={0} />
            <GifFrame className="gif-frame-10" style={{ top: '190vh', left: '2%' }} offset={5} searchIndex={1} />
            <GifFrame className="gif-frame-1" style={{ top: '220vh', right: '3%' }} offset={10} searchIndex={2} />
            <GifFrame className="gif-frame-2" style={{ top: '250vh', left: '3%' }} offset={15} searchIndex={3} />
            <GifFrame className="gif-frame-3" style={{ top: '280vh', right: '2%' }} offset={20} searchIndex={4} />
            <GifFrame className="gif-frame-4" style={{ top: '310vh', left: '2%' }} offset={25} searchIndex={5} />

            {/* === AFTER MANIFESTO (340-500vh) - DENSE FILL === */}
            <GifFrame className="gif-frame-5" style={{ top: '340vh', left: '5%' }} offset={30} searchIndex={6} />
            <GifFrame className="gif-frame-6" style={{ top: '340vh', right: '5%' }} offset={35} searchIndex={7} />
            <GifFrame className="gif-frame-7" style={{ top: '370vh', left: '15%' }} offset={40} searchIndex={8} />
            <GifFrame className="gif-frame-8" style={{ top: '370vh', right: '15%' }} offset={45} searchIndex={9} />
            <GifFrame className="gif-frame-9" style={{ top: '400vh', left: '3%' }} offset={50} searchIndex={10} />
            <GifFrame className="gif-frame-10" style={{ top: '400vh', right: '3%' }} offset={55} searchIndex={11} />
            <GifFrame className="gif-frame-1" style={{ top: '430vh', left: '10%' }} offset={60} searchIndex={0} />
            <GifFrame className="gif-frame-2" style={{ top: '430vh', right: '10%' }} offset={65} searchIndex={1} />
            <GifFrame className="gif-frame-3" style={{ top: '460vh', left: '2%' }} offset={70} searchIndex={2} />
            <GifFrame className="gif-frame-4" style={{ top: '460vh', right: '2%' }} offset={75} searchIndex={3} />
            <GifFrame className="gif-frame-5" style={{ top: '460vh', left: '35%' }} offset={80} searchIndex={4} />
        </>
    );
};

export default GifFrames;
