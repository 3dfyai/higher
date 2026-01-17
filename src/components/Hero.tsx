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
                    <img src="/1.png" className="ascending-char" style={{ animationDelay: '0s', '--char-offset': '-15px' } as React.CSSProperties} alt="" />
                    <img src="/2.png" className="ascending-char" style={{ animationDelay: '7.9s', '--char-offset': '10px' } as React.CSSProperties} alt="" />
                    <img src="/3.png" className="ascending-char" style={{ animationDelay: '15.8s', '--char-offset': '-8px' } as React.CSSProperties} alt="" />
                    <img src="/4.png" className="ascending-char" style={{ animationDelay: '23.7s', '--char-offset': '12px' } as React.CSSProperties} alt="" />
                    <img src="/5.png" className="ascending-char" style={{ animationDelay: '31.6s', '--char-offset': '-10px' } as React.CSSProperties} alt="" />
                    <img src="/6.png" className="ascending-char" style={{ animationDelay: '39.5s', '--char-offset': '8px' } as React.CSSProperties} alt="" />
                    <img src="/7.png" className="ascending-char" style={{ animationDelay: '47.4s', '--char-offset': '-12px' } as React.CSSProperties} alt="" />
                    <img src="/8.png" className="ascending-char" style={{ animationDelay: '55.3s', '--char-offset': '15px' } as React.CSSProperties} alt="" />
                    <img src="/9.png" className="ascending-char" style={{ animationDelay: '63.2s', '--char-offset': '-5px' } as React.CSSProperties} alt="" />
                    <img src="/10.png" className="ascending-char" style={{ animationDelay: '71.1s', '--char-offset': '5px' } as React.CSSProperties} alt="" />
                    <img src="/11.png" className="ascending-char" style={{ animationDelay: '79.0s', '--char-offset': '-18px' } as React.CSSProperties} alt="" />
                </div>
            </div>


        </section>
    );
};

export default Hero;
