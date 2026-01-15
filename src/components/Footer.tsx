import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <svg className="cloud-layer" viewBox="0 0 1440 320">
                <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                <path d="M0,280L120,260C240,240,480,200,720,210C960,220,1200,280,1320,310L1440,340L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" opacity="0.5"></path>
            </svg>
            <div className="footer-links">
                <a href="#">Twitter</a>
                <a href="#">Telegram</a>
                <a href="#">Dexscreener</a>
            </div>
            <div className="footer-copy">There is no bottom, only Higher.</div>
        </footer>
    );
};

export default Footer;
