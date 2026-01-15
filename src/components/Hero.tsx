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
                <source src="/hero_background.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>

            <h1 className="headline-vertical">ASCEND</h1>

            <div className="green-candle">
                <div className="ascending-container">
                    <img src="/1.png" className="ascending-char" style={{ animationDelay: '0s' }} alt="" />
                    <img src="/2.png" className="ascending-char" style={{ animationDelay: '8s' }} alt="" />
                    <img src="/3.png" className="ascending-char" style={{ animationDelay: '16s' }} alt="" />
                    <img src="/4.png" className="ascending-char" style={{ animationDelay: '24s' }} alt="" />
                    <img src="/5.png" className="ascending-char" style={{ animationDelay: '32s' }} alt="" />
                </div>
            </div>


        </section>
    );
};

export default Hero;
