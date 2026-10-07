import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import Strawberry from './ornaments/Strawberry';

// A tiny strawberry that wobbles and squishes with your scroll speed and chats
// whenever a new section (any element with `data-buddy="..."`) comes into view.
export default function ScrollBuddy() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 20 });
  const rotate = useTransform(smooth, [-2500, 0, 2500], [-22, 0, 22]);
  const lift = useTransform(smooth, [-2500, 0, 2500], [-18, 0, -18]);
  // Squash & stretch: tall and thin when flung, round when resting.
  const scaleY = useTransform(smooth, [-2500, 0, 2500], [1.18, 1, 1.18]);
  const scaleX = useTransform(smooth, [-2500, 0, 2500], [0.86, 1, 0.86]);

  const [message, setMessage] = useState(null);
  const timer = useRef(0);

  useEffect(() => {
    const seen = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const text = entry.target.dataset.buddy;
          if (!entry.isIntersecting || !text || seen.has(entry.target)) return;
          seen.add(entry.target);
          setMessage(text);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setMessage(null), 3000);
        });
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll('[data-buddy]').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-2 left-2 z-40 sm:bottom-4 sm:left-4" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.4, y: 20, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="absolute bottom-[92%] left-9 w-max max-w-[11rem] origin-bottom-left rounded-2xl rounded-bl-none border border-berry-200 bg-milk px-3 py-2 text-[13px] font-semibold leading-snug text-berry-700 shadow-lg shadow-berry-900/10 sm:left-12 sm:max-w-[14rem] sm:text-sm"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div style={{ rotate, y: lift, scaleX, scaleY }} className="origin-bottom">
        <div className="animate-bob">
          <Strawberry face className="h-14 w-12 drop-shadow-md sm:h-[4.5rem] sm:w-[3.75rem]" title="Stroberi kecil" />
        </div>
      </motion.div>
    </div>
  );
}
