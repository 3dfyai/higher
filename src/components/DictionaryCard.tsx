import React from 'react';

const DictionaryCard: React.FC = () => {
    return (
        <div className="dictionary-card">
            <span className="type">Verb / Philosophy</span>
            <h2>Ascend</h2>
            <p className="phonetic">/ə-send/</p>
            <p>1. To rise above market noise with conviction.<br />
                2. The pursuit of limitless potential.<br />
                3. The definitive trajectory of the ecosystem.</p>

            <div className="handwritten" style={{ top: '-40px', right: '-60px', width: '200px' }}>
                The only way is up.
                <svg width="100" height="50" style={{ position: 'absolute', top: '30px', left: '-20px' }}>
                    <path d="M10,10 Q50,40 90,10" stroke="#ff3333" fill="transparent" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};

export default DictionaryCard;
