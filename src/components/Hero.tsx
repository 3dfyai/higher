import React, { useRef, useState, useEffect } from 'react';

const Hero: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true); // Start muted so autoplay works; unmute on first interaction

    // Unmute video on first user interaction (browsers block autoplay with sound)
    useEffect(() => {
        const unmute = () => {
            setMuted(false);
            videoRef.current?.play().catch(() => {});
        };
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach((e) => window.addEventListener(e, unmute, { once: true }));
        return () => events.forEach((e) => window.removeEventListener(e, unmute));
    }, []);

    return (
        <section className="hero">
            <video
                ref={videoRef}
                className="hero-video-bg"
                autoPlay
                loop
                muted={muted}
                playsInline
            >
                <source src="https://pub-0831e98b478f493081404c7cea6656fb.r2.dev/hero_background_test.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>

            <h1 className="headline-vertical">ASCEND</h1>

            <div className="green-candle">
                <div className="ascending-container">
                    <img src="/1.webp" className="ascending-char" style={{ animationDelay: '0s', '--char-offset': '-15px' } as React.CSSProperties} alt="" />
                    <img src="/2.webp" className="ascending-char" style={{ animationDelay: '7.9s', '--char-offset': '10px' } as React.CSSProperties} alt="" />
                    <img src="/3.webp" className="ascending-char" style={{ animationDelay: '15.8s', '--char-offset': '-8px' } as React.CSSProperties} alt="" />
                    <img src="/4.webp" className="ascending-char" style={{ animationDelay: '23.7s', '--char-offset': '12px' } as React.CSSProperties} alt="" />
                    <img src="/5.webp" className="ascending-char" style={{ animationDelay: '31.6s', '--char-offset': '-10px' } as React.CSSProperties} alt="" />
                    <img src="/6.webp" className="ascending-char" style={{ animationDelay: '39.5s', '--char-offset': '8px' } as React.CSSProperties} alt="" />
                    <img src="/7.webp" className="ascending-char" style={{ animationDelay: '47.4s', '--char-offset': '-12px' } as React.CSSProperties} alt="" />
                    <img src="/8.webp" className="ascending-char" style={{ animationDelay: '55.3s', '--char-offset': '15px' } as React.CSSProperties} alt="" />
                    <img src="/9.webp" className="ascending-char" style={{ animationDelay: '63.2s', '--char-offset': '-5px' } as React.CSSProperties} alt="" />
                    <img src="/10.webp" className="ascending-char" style={{ animationDelay: '71.1s', '--char-offset': '5px' } as React.CSSProperties} alt="" />
                    <img src="/11.webp" className="ascending-char" style={{ animationDelay: '79.0s', '--char-offset': '-18px' } as React.CSSProperties} alt="" />
                </div>
            </div>


        </section>
    );
};

export default Hero;
