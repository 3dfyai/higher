const FloatingTexts: React.FC = () => {
    return (
        <>
            {/* Block 1 - Left side, early in page */}
            <div className="floating-text left" style={{ top: '120vh' }}>
                <h3>THIS IS HIGHER.</h3>
                <p>
                    In crypto, "higher" isn't just a direction—it's a belief system.
                    It means absolute conviction. It means rejecting the noise, the FUD,
                    the paper hands. When you're higher, you don't look down.
                </p>
            </div>

            {/* Block 2 - Right side */}
            <div className="floating-text right" style={{ top: '135vh' }}>
                <h3>WE ALL WANT HIGHER</h3>
                <p>
                    Every holder. Every believer. Every diamond hand.
                    We're not here for quick flips. We're here because
                    we understand that the only direction that matters is up.
                </p>
            </div>

            {/* Block 3 - Left side */}
            <div className="floating-text left" style={{ top: '200vh' }}>
                <h3>THE PHILOSOPHY</h3>
                <p>
                    Higher isn't a promise—it's a mindset. Markets crash.
                    Charts bleed. But those who stay convicted know:
                    every dip is just a setup for the next leg up.
                </p>
            </div>

            {/* Block 4 - Right side */}
            <div className="floating-text right" style={{ top: '240vh' }}>
                <h3>NO CEILING EXISTS</h3>
                <p>
                    They'll tell you it's topped. They'll tell you to sell.
                    They said the same thing at every milestone.
                    And yet—we're still here. Still holding. Still higher.
                </p>
            </div>

            {/* Block 5 - Left side */}
            <div className="floating-text left" style={{ top: '350vh' }}>
                <h3>BUILT BY BELIEVERS</h3>
                <p>
                    This isn't a project. It's a movement. Built by people
                    who refused to accept "good enough." Who looked at the
                    market and said: we can go higher.
                </p>
            </div>

            {/* Block 6 - Right side */}
            <div className="floating-text right" style={{ top: '400vh' }}>
                <h3>JOIN THE ASCENT</h3>
                <p>
                    The community doesn't ask "when moon?"
                    We ask "why would we ever stop?"
                    Because for us, higher isn't a destination.
                    It's the only way we know.
                </p>
            </div>
        </>
    );
};

export default FloatingTexts;
