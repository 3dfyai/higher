const Manifesto: React.FC = () => {
    return (
        <section className="manifesto-section">
            <div className="manifesto-container">
                <h2 className="manifesto-title">
                    The <span>Higher</span> Manifesto
                </h2>
                <ul className="manifesto-list">
                    <li className="manifesto-item">
                        <span className="manifesto-number">01</span>
                        <div className="manifesto-text">
                            <h3>Reject Gravity</h3>
                            <p>We don't follow the market. The market follows us. Every dip is a setup. Every FUD is fuel.</p>
                        </div>
                    </li>
                    <li className="manifesto-item">
                        <span className="manifesto-number">02</span>
                        <div className="manifesto-text">
                            <h3>Community First</h3>
                            <p>Not a project. A movement. Built by believers, for believers. Diamond hands only.</p>
                        </div>
                    </li>
                    <li className="manifesto-item">
                        <span className="manifesto-number">03</span>
                        <div className="manifesto-text">
                            <h3>Infinite Conviction</h3>
                            <p>There is no exit strategy. There is only Higher. The ceiling does not exist.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Manifesto;
