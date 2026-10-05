import { useEffect, useState } from 'react';

// Returns { direction: 'up' | 'down', y } with a small threshold to avoid jitter.
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ direction: 'up', y: 0 });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) >= threshold) {
        setState({ direction: y > lastY ? 'down' : 'up', y });
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return state;
}
