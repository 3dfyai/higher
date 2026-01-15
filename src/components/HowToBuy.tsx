const HowToBuy: React.FC = () => {
    return (
        <section className="howtobuy-section">
            <div className="howtobuy-container">
                <h2 className="howtobuy-title">How To <span>Buy</span></h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Get a Wallet</h3>
                        <p>Download Phantom or Solflare wallet and set it up with a secure seed phrase.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Get SOL</h3>
                        <p>Buy SOL on an exchange and transfer it to your wallet address.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Swap for HIGHER</h3>
                        <p>Connect your wallet to Raydium or Jupiter and swap SOL for HIGHER.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <h3>Hold Forever</h3>
                        <p>There is no step 4. You simply hold. The only way is Higher.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToBuy;
