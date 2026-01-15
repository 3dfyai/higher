import { useEffect } from 'react';
import BackgroundGrid from './components/BackgroundGrid';
import Hero from './components/Hero';
import UpdraftGrid from './components/UpdraftGrid';
import DictionaryCard from './components/DictionaryCard';
import TokenomicsReceipt from './components/TokenomicsReceipt';
import Footer from './components/Footer';
import Manifesto from './components/Manifesto';
import FloatingTexts from './components/FloatingTexts';
import GifFrames from './components/GifFrames';

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const frames = document.querySelectorAll('.frame') as NodeListOf<HTMLElement>;
      frames.forEach((frame, index) => {
        const speed = (index + 1) * 0.2;
        frame.style.transform = `translateY(${scrolled * speed * -1}px) rotate(${5 - (index * 4)}deg)`;
      });

      const candle = document.querySelector('.green-candle') as HTMLElement;
      if (candle) {
        candle.style.height = (120 + scrolled * 0.05) + 'vh';
      }

      const headline = document.querySelector('.headline-vertical') as HTMLElement;
      if (headline) {
        headline.style.transform = `rotate(-90deg) translateX(-100%) translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <BackgroundGrid />
      <Hero />
      <UpdraftGrid />
      <GifFrames />
      <FloatingTexts />
      <DictionaryCard />
      <svg className="annotation-line" width="600" height="400">
        <path d="M0,0 C150,50 400,-150 500,-400" stroke="#ff3333" fill="transparent" strokeWidth="3" strokeDasharray="5,5" />
      </svg>
      <Manifesto />
      <TokenomicsReceipt />
      <Footer />
    </>
  );
}

export default App;
