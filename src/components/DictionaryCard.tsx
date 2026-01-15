import React from 'react';

const DictionaryCard: React.FC = () => {
    return (
        <div className="dictionary-card">
            <span className="type">Adjective / Philosophy</span>
            <h2>Higher</h2>
            <p className="phonetic">/hī-ər/</p>
            <p>1. The state of absolute conviction.<br />
                2. The rejection of gravity.<br />
                3. The only direction of the Solana ecosystem.</p>

            <div className="handwritten" style={{ top: '-40px', right: '-60px', width: '200px' }}>
                This is the goal.
                <svg width="100" height="50" style={{ position: 'absolute', top: '30px', left: '-20px' }}>
                    <path d="M10,10 Q50,40 90,10" stroke="#ff3333" fill="transparent" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};

export default DictionaryCard;
