import React, { useState, useRef } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleClick = () => {
        // Play celestial sound effect
        if (audioRef.current) {
            audioRef.current.play().catch((err) => {
                console.log('Audio play failed:', err);
            });
        }
        
        setIsExiting(true);
        // Wait for fade animation to finish before unmounting
        setTimeout(() => {
            onComplete();
        }, 1200); // Match CSS transition duration (1.2s)
    };

    return (
        <div className={`loading-screen ${isExiting ? 'slide-up-exit' : ''}`}>
            <img 
                src="/loading_screen_image.png" 
                alt="Loading Background" 
                className="loading-screen-bg"
            />
            <div className="loading-content">
                <button 
                    className="ascend-button"
                    onClick={handleClick}
                    aria-label="Click to Ascend"
                >
                    <img 
                        src="/ChatGPT Image Jan 17, 2026, 05_11_16 AM.png" 
                        alt="Ascend" 
                        className="ascend-button-image"
                    />
                </button>
            </div>
            <audio ref={audioRef} preload="auto">
                <source src="/celestial_sound.mp3" type="audio/mpeg" />
                <source src="/celestial_sound.ogg" type="audio/ogg" />
                <source src="/celestial_sound.wav" type="audio/wav" />
            </audio>
        </div>
    );
};

export default LoadingScreen;
