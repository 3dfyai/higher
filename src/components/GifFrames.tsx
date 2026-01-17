import React, { useState, useEffect } from 'react';

// Static image paths
const IMAGE_PATHS = [
    '/alon.png',
    '/Bandit.png',
    '/cented.png',
    '/clukz.png',
    '/cupsey.png',
    '/daumen.png',
    '/duvall.png',
    '/gake.png',
    '/jijo2.png',
    '/joji.png',
    '/mitch.png'
];

interface ImageFrameProps {
    className: string;
    style: React.CSSProperties;
    imageIndex: number;
    onImageClick: (imagePath: string) => void;
}

const ImageFrame: React.FC<ImageFrameProps> = ({ className, style, imageIndex, onImageClick }) => {
    const [isVisible, setIsVisible] = useState(false);
    const frameRef = React.useRef<HTMLDivElement>(null);
    const imagePath = IMAGE_PATHS[imageIndex % IMAGE_PATHS.length];

    // Lazy load images only when they're about to be visible
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

    const handleClick = () => {
        if (isVisible) {
            onImageClick(imagePath);
        }
    };

    return (
        <div ref={frameRef} className={`gif-frame ${className}`} style={style}>
            <div className="gif-frame-content" onClick={handleClick}>
                {!isVisible ? (
                    <span className="gif-loading">LOADING...</span>
                ) : (
                    <img src={imagePath} alt="Character" loading="lazy" className="clickable-image" />
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        // Calculate all positions once (6 rows for 11 images)
        const offsets = [
            startOffset,
            startOffset + rowSpacing,
            startOffset + rowSpacing * 2,
            startOffset + rowSpacing * 3,
            startOffset + rowSpacing * 4,
            startOffset + rowSpacing * 5,
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

    const handleImageClick = (imagePath: string) => {
        setSelectedImage(imagePath);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedImage) {
                handleCloseModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [selectedImage]);

    return (
        <>
            {/* === BELOW MANIFESTO (using static images) === */}
            <ImageFrame className="gif-frame-1" style={{ top: getPosition(0), left: '5%' }} imageIndex={0} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-2" style={{ top: getPosition(0), right: '5%' }} imageIndex={1} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-3" style={{ top: getPosition(1), left: '15%' }} imageIndex={2} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-4" style={{ top: getPosition(1), right: '15%' }} imageIndex={3} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-5" style={{ top: getPosition(2), left: '3%' }} imageIndex={4} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-6" style={{ top: getPosition(2), right: '3%' }} imageIndex={5} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-7" style={{ top: getPosition(3), left: '10%' }} imageIndex={6} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-8" style={{ top: getPosition(3), right: '10%' }} imageIndex={7} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-9" style={{ top: getPosition(4), left: '2%' }} imageIndex={8} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-10" style={{ top: getPosition(4), right: '2%' }} imageIndex={9} onImageClick={handleImageClick} />
            <ImageFrame className="gif-frame-11 gif-frame-center" style={{ top: getPosition(5), left: '50%' }} imageIndex={10} onImageClick={handleImageClick} />

            {/* Image Modal/Lightbox */}
            {selectedImage && (
                <div className="image-modal-overlay" onClick={handleCloseModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal-close" onClick={handleCloseModal} aria-label="Close">
                            ×
                        </button>
                        <img src={selectedImage} alt="Character" className="image-modal-image" />
                    </div>
                </div>
            )}
        </>
    );
};

export default GifFrames;
