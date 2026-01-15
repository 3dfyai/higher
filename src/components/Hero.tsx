import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="hero">
            <video
                className="hero-video-bg"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/3cee0909fb201b8799aa231909079974.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>

            <h1 className="headline-vertical">HIGHER</h1>

            <div className="green-candle"></div>

            <a href="#" className="ticker-cta">
                <div className="ticker-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M12 4l-1.41 1.41L12.17 7H2v2h10.17l-1.58 1.59L12 12l4-4-4-4z" /></svg>
                </div>
                <div className="ticker-text">
                    <span>NEW SIGNAL DETECTED</span>
                    <b>BUY ON SOLANA</b>
                </div>
            </a>
        </section>
    );
};

export default Hero;
