const Stats: React.FC = () => {
    return (
        <section className="stats-section">
            <div className="stats-container">
                <div className="stat-item">
                    <div className="stat-value">∞</div>
                    <div className="stat-label">Upside Potential</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">0%</div>
                    <div className="stat-label">Tax</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">100%</div>
                    <div className="stat-label">Community Owned</div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
