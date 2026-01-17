import { useState, useEffect, useRef } from 'react';
import BackgroundGrid from './components/BackgroundGrid';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Manifesto from './components/Manifesto';
import GifFrames from './components/GifFrames';
import LoadingScreen from './components/LoadingScreen';

// Preload character images immediately
const CHARACTER_IMAGES = [
  '/alon.png',
  '/Bandit.png',
  '/cented.png',
  '/clukz.png',
  '/cupsey.png',
  '/daumen.png',
  '/duvall.png',
  '/gake.png',
  '/jijo2.png',
  '/joji.png',
  '/mitch.png'
];

// Start preloading images immediately (before component mounts)
CHARACTER_IMAGES.forEach((imagePath) => {
  const img = new Image();
  img.src = imagePath;
});

function App() {
  const [loading, setLoading] = useState(true);
  const [manifestoBottomPosition, setManifestoBottomPosition] = useState<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play background music when site loads (after loading screen)
  useEffect(() => {
    if (!loading) {
      const audio = new Audio('/space-ambient-cinematic-348459.mp3');
      audio.loop = true;
      audio.volume = 0.4; // Set volume to 40% for ambient background music
      audioRef.current = audio;
      audio.play().catch((err) => {
        console.log('Background music play failed:', err);
      });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [loading]);

  useEffect(() => {
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;

      const candle = document.querySelector('.green-candle') as HTMLElement;
      if (candle) {
        candle.style.height = (120 + scrolled * 0.05) + 'vh';
      }

      const headline = document.querySelector('.headline-vertical') as HTMLElement;
      if (headline) {
        headline.style.transform = `rotate(-90deg) translateX(-100%) translateY(${scrolled * 0.5}px)`;
          }
          
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <BackgroundGrid />
      <Hero />
      <Manifesto onHeightChange={setManifestoBottomPosition} />
      <GifFrames manifestoBottomPosition={manifestoBottomPosition} />
      <Footer />
    </>
  );
}

export default App;
