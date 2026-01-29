import React, { useState, useEffect } from 'react';

const SUPABASE_STORAGE = 'https://hmadzkmchhdtnjxilgss.supabase.co/storage/v1/object/public/images';

// WebM character videos from Supabase (8 frames, one per character)
const VIDEO_PATHS = [
    `${SUPABASE_STORAGE}/alon.webm`,
    `${SUPABASE_STORAGE}/cented.webm`,
    `${SUPABASE_STORAGE}/clukz.webm`,
    `${SUPABASE_STORAGE}/cupsey.webm`,
    `${SUPABASE_STORAGE}/daumen.webm`,
    `${SUPABASE_STORAGE}/jijo.webm`,
    `${SUPABASE_STORAGE}/joji.webm`,
    `${SUPABASE_STORAGE}/mitch.webm`,
];

interface ImageFrameProps {
    className: string;
    style: React.CSSProperties;
    imageIndex: number;
    onImageClick: (imagePath: string) => void;
    imagesPreloaded: boolean;
}

const ImageFrame = React.memo<ImageFrameProps>(({ className, style, imageIndex, onImageClick, imagesPreloaded }) => {
    const frameRef = React.useRef<HTMLDivElement>(null);
    const videoPath = VIDEO_PATHS[imageIndex];

    const handleClick = React.useCallback(() => {
        onImageClick(videoPath);
    }, [videoPath, onImageClick]);

    return (
        <div 
            ref={frameRef} 
            className={`gif-frame ${className}`} 
            style={style}
        >
            <div className="gif-frame-content" onClick={handleClick}>
                {imagesPreloaded ? (
                    <video
                        src={videoPath}
                        className="clickable-image gif-frame-video"
                        loop
                        autoPlay
                        muted
                        playsInline
                        aria-label="Character"
                    />
                ) : (
                    <span className="gif-loading">LOADING...</span>
                )}
            </div>
        </div>
    );
});

interface GifFramesProps {
    manifestoBottomPosition?: number;
}

const GifFrames: React.FC<GifFramesProps> = ({ manifestoBottomPosition }) => {
    const [windowHeight, setWindowHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 1080);
    const [gifPositions, setGifPositions] = useState<Record<number, string>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    // Mark videos ready after mount so frames show (videos load and loop on their own)
    useEffect(() => {
        const t = setTimeout(() => setImagesPreloaded(true), 100);
        return () => clearTimeout(t);
    }, []);

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

        const rowSpacing = 38;
        const startOffset = 10;
        const positions: Record<number, string> = {};

        // 4 rows for 8 frames (2 per row)
        const offsets = [
            startOffset,
            startOffset + rowSpacing,
            startOffset + rowSpacing * 2,
            startOffset + rowSpacing * 3,
        ];

        offsets.forEach((offsetVh, index) => {
            const offsetPx = (offsetVh / 100) * windowHeight;
            positions[index] = `${manifestoBottomPosition + offsetPx}px`;
        });

        setGifPositions(positions);
    }, [manifestoBottomPosition, windowHeight]);

    const rowSpacing = 38;
    const startOffset = 10;

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

    const handleImageClick = React.useCallback((imagePath: string) => {
        setSelectedImage(imagePath);
        document.body.style.overflow = 'hidden';
    }, []);

    const handleCloseModal = React.useCallback(() => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    }, []);

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
            {/* 8 character video frames (4 rows × 2) */}
            <ImageFrame className="gif-frame-1" style={{ top: getPosition(0), left: '5%' }} imageIndex={0} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-2" style={{ top: getPosition(0), right: '5%' }} imageIndex={1} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-3" style={{ top: getPosition(1), left: '10%' }} imageIndex={2} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-4" style={{ top: getPosition(1), right: '10%' }} imageIndex={3} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-5" style={{ top: getPosition(2), left: '5%' }} imageIndex={4} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-6" style={{ top: getPosition(2), right: '5%' }} imageIndex={5} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-7 gif-frame-footer-left" style={{ top: getPosition(3), left: '50%' }} imageIndex={6} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />
            <ImageFrame className="gif-frame-8 gif-frame-footer-right" style={{ top: getPosition(3), left: '50%' }} imageIndex={7} onImageClick={handleImageClick} imagesPreloaded={imagesPreloaded} />

            {/* Video Modal/Lightbox */}
            {selectedImage && (
                <div className="image-modal-overlay" onClick={handleCloseModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal-close" onClick={handleCloseModal} aria-label="Close">
                            ×
                        </button>
                        <video
                            src={selectedImage}
                            className="image-modal-image image-modal-video"
                            loop
                            autoPlay
                            muted
                            playsInline
                            controls
                            aria-label="Character"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default GifFrames;
