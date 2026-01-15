import React from 'react';

const TokenomicsReceipt: React.FC = () => {
    return (
        <div className="receipt">
            <div className="receipt-header">
                <h3>TRANSACTION SLIP</h3>
                <p>NETWORK: SOLANA</p>
            </div>
            <div className="receipt-row"><span>SUPPLY</span> <span>1,000,000,000</span></div>
            <div className="receipt-row"><span>TAX</span> <span>0%</span></div>
            <div className="receipt-row"><span>VIBES</span> <span>MAX</span></div>
            <div className="receipt-row"><span>LP</span> <span>BURNED</span></div>
            <div className="receipt-row" style={{ marginTop: '20px', fontWeight: 'bold' }}><span>TOTAL</span> <span>HIGHER</span></div>
            <div className="barcode"></div>
            <p style={{ fontSize: '0.6rem', textAlign: 'center', marginTop: '10px' }}>CA: HIGHER...UP...ONLY</p>
        </div>
    );
};

export default TokenomicsReceipt;
