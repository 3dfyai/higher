import { useState, useEffect } from 'react';

const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Public beta key

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
            const randomOffset = offset + Math.floor(Math.random() * 50);
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=higher&limit=1&offset=${randomOffset}&rating=g`
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
        // Change GIF every 10 seconds
        const interval = setInterval(fetchGif, 10000);
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
                    <img src={gifUrl} alt="Higher GIF" />
                )}
            </div>
        </div>
    );
};

const GifFrames: React.FC = () => {
    return (
        <>
            {/* Row 1 - Near hero */}
            <GifFrame
                className="gif-frame-1"
                style={{ top: '75vh', right: '5%' }}
                offset={0}
            />
            <GifFrame
                className="gif-frame-2"
                style={{ top: '85vh', left: '3%' }}
                offset={5}
            />

            {/* Row 2 - Early scroll */}
            <GifFrame
                className="gif-frame-3"
                style={{ top: '130vh', right: '8%' }}
                offset={10}
            />
            <GifFrame
                className="gif-frame-4"
                style={{ top: '145vh', left: '5%' }}
                offset={15}
            />

            {/* Row 3 - Mid page */}
            <GifFrame
                className="gif-frame-5"
                style={{ top: '195vh', right: '3%' }}
                offset={20}
            />
            <GifFrame
                className="gif-frame-6"
                style={{ top: '210vh', left: '6%' }}
                offset={25}
            />

            {/* Row 4 - Lower mid */}
            <GifFrame
                className="gif-frame-7"
                style={{ top: '260vh', right: '6%' }}
                offset={30}
            />
            <GifFrame
                className="gif-frame-8"
                style={{ top: '295vh', left: '4%' }}
                offset={35}
            />

            {/* Row 5 - Near bottom */}
            <GifFrame
                className="gif-frame-9"
                style={{ top: '355vh', right: '4%' }}
                offset={40}
            />
            <GifFrame
                className="gif-frame-10"
                style={{ top: '390vh', left: '5%' }}
                offset={45}
            />
        </>
    );
};

export default GifFrames;
