import React, { useState, useRef, useEffect } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

interface FloatingChar {
    id: number;
    charIndex: number;
    left: number;
    delay: number;
    duration: number;
    horizontalDrift: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [floatingChars, setFloatingChars] = useState<FloatingChar[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const charIdCounter = useRef(0);
    const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const characters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Character indices

    // Prevent scrolling when loading screen is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Spawn floating characters at random intervals
    useEffect(() => {
        if (isExiting) {
            // Stop spawning when exiting
            if (spawnTimeoutRef.current) {
                clearTimeout(spawnTimeoutRef.current);
            }
            return;
        }

        const spawnChar = () => {
            // Keep only 2-3 characters visible
            setFloatingChars(prev => {
                if (prev.length >= 3) {
                    return prev; // Don't spawn if we already have 3
                }

                // Fully random positions across screen width
                const randomPosition = 5 + Math.random() * 90; // Random between 5% and 95% (avoid edges)
                
                const duration = 8 + Math.random() * 4; // 8-12 seconds (varied speeds)
                
                const newChar: FloatingChar = {
                    id: charIdCounter.current++,
                    charIndex: characters[Math.floor(Math.random() * characters.length)],
                    left: randomPosition, // Fully random position
                    delay: Math.random() * 0.5, // Random start delay (0-0.5s) for staggered appearance
                    duration: duration,
                    horizontalDrift: (Math.random() - 0.5) * 20, // More horizontal drift (-10% to +10%)
                };

                // Remove character after animation completes (duration + delay + buffer)
                setTimeout(() => {
                    setFloatingChars(prev => prev.filter(char => char.id !== newChar.id));
                }, (duration + newChar.delay + 1) * 1000); // Add buffer to ensure complete exit

                return [...prev, newChar];
            });

            // Random interval between spawns (2-5 seconds)
            const nextSpawnDelay = 2000 + Math.random() * 3000;
            spawnTimeoutRef.current = setTimeout(spawnChar, nextSpawnDelay);
        };

        // Start spawning after initial delay
        spawnTimeoutRef.current = setTimeout(spawnChar, 1000);

        return () => {
            if (spawnTimeoutRef.current) {
                clearTimeout(spawnTimeoutRef.current);
            }
        };
    }, [isExiting]);

    const handleClick = () => {
        // Play celestial sound effect
        if (audioRef.current) {
            audioRef.current.play().catch((err) => {
                console.log('Audio play failed:', err);
            });
        }
        
        setIsExiting(true);
        // Clear all floating chars
        setFloatingChars([]);
        if (spawnTimeoutRef.current) {
            clearTimeout(spawnTimeoutRef.current);
        }
        
        // Wait for fade animation to finish before unmounting
        setTimeout(() => {
            document.body.style.overflow = '';
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
            
            {/* Floating ascending characters */}
            {floatingChars.map((char) => (
                <img
                    key={char.id}
                    src={`/${char.charIndex}.png`}
                    alt=""
                    className="loading-floating-char"
                    style={{
                        left: `${char.left}%`,
                        animationDuration: `${char.duration}s`,
                        animationDelay: `${char.delay}s`,
                        '--drift': `${char.horizontalDrift}%`,
                    } as React.CSSProperties}
                />
            ))}
            
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
