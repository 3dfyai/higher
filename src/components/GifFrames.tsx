import { useState, useEffect } from 'react';

const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Public beta key
const SEARCH_TERMS = ['higher', 'up', 'moon', 'rocket', 'success', 'winning', 'celebration', 'money'];

interface GifFrameProps {
    className: string;
    style: React.CSSProperties;
    searchIndex?: number;
}

const GifFrame: React.FC<GifFrameProps> = ({ className, style, searchIndex = 0 }) => {
    const [gifUrl, setGifUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchGif = async () => {
        try {
            const term = SEARCH_TERMS[searchIndex % SEARCH_TERMS.length];
            const offset = Math.floor(Math.random() * 20);
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${term}&limit=1&offset=${offset}&rating=g`
            );
            const data = await response.json();
            if (data.data && data.data[0]) {
                setGifUrl(data.data[0].images.fixed_height.url);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching GIF:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGif();
        // Change GIF every 8 seconds
        const interval = setInterval(fetchGif, 8000);
        return () => clearInterval(interval);
    }, [searchIndex]);

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
            {/* Frame near hero - right side */}
            <GifFrame
                className="gif-frame-1"
                style={{ top: '80vh', right: '8%' }}
                searchIndex={0}
            />

            {/* Frame left side - mid page */}
            <GifFrame
                className="gif-frame-2"
                style={{ top: '160vh', left: '5%' }}
                searchIndex={1}
            />

            {/* Frame right side */}
            <GifFrame
                className="gif-frame-3"
                style={{ top: '220vh', right: '10%' }}
                searchIndex={2}
            />

            {/* Frame left side - lower */}
            <GifFrame
                className="gif-frame-4"
                style={{ top: '300vh', left: '8%' }}
                searchIndex={3}
            />

            {/* Frame right side - near bottom */}
            <GifFrame
                className="gif-frame-5"
                style={{ top: '380vh', right: '5%' }}
                searchIndex={4}
            />
        </>
    );
};

export default GifFrames;
