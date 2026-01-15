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
            const randomOffset = offset + Math.floor(Math.random() * 100);
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
        const interval = setInterval(fetchGif, 12000);
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
            {/* === HERO AREA (50-100vh) === */}
            <GifFrame className="gif-frame-1" style={{ top: '55vh', right: '3%' }} offset={0} />
            <GifFrame className="gif-frame-2" style={{ top: '65vh', left: '2%' }} offset={5} />
            <GifFrame className="gif-frame-3" style={{ top: '85vh', right: '5%' }} offset={10} />
            <GifFrame className="gif-frame-4" style={{ top: '95vh', left: '4%' }} offset={15} />

            {/* === BEFORE DICTIONARY (100-150vh) === */}
            <GifFrame className="gif-frame-5" style={{ top: '110vh', right: '2%' }} offset={20} />
            <GifFrame className="gif-frame-6" style={{ top: '120vh', left: '3%' }} offset={25} />
            <GifFrame className="gif-frame-7" style={{ top: '135vh', right: '6%' }} offset={30} />
            <GifFrame className="gif-frame-8" style={{ top: '145vh', left: '2%' }} offset={35} />

            {/* === AROUND MANIFESTO SIDES (170-320vh) === */}
            <GifFrame className="gif-frame-9" style={{ top: '175vh', right: '2%' }} offset={40} />
            <GifFrame className="gif-frame-10" style={{ top: '190vh', left: '2%' }} offset={45} />
            <GifFrame className="gif-frame-1" style={{ top: '220vh', right: '3%' }} offset={50} />
            <GifFrame className="gif-frame-2" style={{ top: '250vh', left: '3%' }} offset={55} />
            <GifFrame className="gif-frame-3" style={{ top: '280vh', right: '2%' }} offset={60} />
            <GifFrame className="gif-frame-4" style={{ top: '310vh', left: '2%' }} offset={65} />

            {/* === AFTER MANIFESTO (340-500vh) - DENSE FILL === */}
            <GifFrame className="gif-frame-5" style={{ top: '340vh', left: '5%' }} offset={70} />
            <GifFrame className="gif-frame-6" style={{ top: '340vh', right: '5%' }} offset={75} />
            <GifFrame className="gif-frame-7" style={{ top: '370vh', left: '15%' }} offset={80} />
            <GifFrame className="gif-frame-8" style={{ top: '370vh', right: '15%' }} offset={85} />
            <GifFrame className="gif-frame-9" style={{ top: '400vh', left: '3%' }} offset={90} />
            <GifFrame className="gif-frame-10" style={{ top: '400vh', right: '3%' }} offset={95} />
            <GifFrame className="gif-frame-1" style={{ top: '430vh', left: '10%' }} offset={100} />
            <GifFrame className="gif-frame-2" style={{ top: '430vh', right: '10%' }} offset={105} />
            <GifFrame className="gif-frame-3" style={{ top: '460vh', left: '2%' }} offset={110} />
            <GifFrame className="gif-frame-4" style={{ top: '460vh', right: '2%' }} offset={115} />
            <GifFrame className="gif-frame-5" style={{ top: '460vh', left: '35%' }} offset={120} />
        </>
    );
};

export default GifFrames;
