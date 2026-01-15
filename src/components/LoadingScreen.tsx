import React, { useState } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleVideoEnd = () => {
        setIsExiting(true);
        // Wait for fade animation to finish before unmounting
        setTimeout(() => {
            onComplete();
        }, 1200); // Match CSS transition duration (1.2s)
    };

    return (
        <div className={`loading-screen ${isExiting ? 'slide-up-exit' : ''}`}>
            <video
                className="loading-video"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
            >
                <source src="/loading_screen.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default LoadingScreen;
