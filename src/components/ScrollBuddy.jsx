import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import Ondel from './ornaments/Ondel';

// A tiny Ondel-ondel that wobbles with your scroll speed and chats in Betawi slang
// whenever a new section (any element with `data-buddy="..."`) comes into view.
export default function ScrollBuddy() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 20 });
  const rotate = useTransform(smooth, [-2500, 0, 2500], [-22, 0, 22]);
  const lift = useTransform(smooth, [-2500, 0, 2500], [-18, 0, -18]);

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
    <div className="pointer-events-none fixed bottom-0 left-1 z-40 sm:left-4" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.4, y: 20, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="absolute bottom-[88%] left-10 w-max max-w-[11rem] origin-bottom-left rounded-2xl rounded-bl-none border border-gold-400/60 bg-ivory px-3 py-2 font-display text-sm font-semibold italic leading-snug text-burgundy-800 shadow-lg sm:left-14 sm:max-w-[14rem] sm:text-base"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div style={{ rotate, y: lift }} className="origin-bottom translate-y-[28%]">
        <Ondel variant="pria" className="h-24 w-11 sm:h-32 sm:w-14" title="Ondel-ondel kecil" />
      </motion.div>
    </div>
  );
}
