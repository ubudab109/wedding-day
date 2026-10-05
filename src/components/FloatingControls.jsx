import { AnimatePresence, motion } from 'framer-motion';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { IconArrowUp, IconPause, IconPlay } from './Icons';

// Spinning music disc + back-to-top. Both hide while scrolling down and come back on scroll up.
export default function FloatingControls({ music, track }) {
  const { direction, y } = useScrollDirection();
  const visible = direction === 'up' || y < 80;
  const showTop = visible && y > 500;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            aria-label="Kembali ke atas"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.6 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="grid h-11 w-11 place-items-center rounded-full border border-gold-400/60 bg-emerald-900/90 text-gold-300 shadow-lg backdrop-blur"
          >
            <IconArrowUp />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={music.toggle}
        aria-label={music.playing ? 'Jeda musik' : 'Putar musik'}
        aria-pressed={music.playing}
        title={`${track.title} — ${track.subtitle}`}
        animate={visible ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 90, rotate: 90 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
        className="group relative h-14 w-14 rounded-full shadow-xl shadow-emerald-950/40"
      >
        <span
          className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,#111_0_2px,#1f1f1f_2px_4px)] ring-2 ring-gold-500"
          style={{ animation: 'spin 4s linear infinite', animationPlayState: music.playing ? 'running' : 'paused' }}
        >
          <span className="absolute inset-[30%] grid place-items-center rounded-full bg-linear-to-br from-burgundy-600 to-burgundy-800 ring-1 ring-gold-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cream" />
          </span>
          <span className="absolute left-[18%] top-[14%] h-2 w-4 rotate-[-35deg] rounded-full bg-white/15 blur-[1px]" />
        </span>
        <span className="absolute -left-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold-500 text-emerald-950 shadow">
          {music.playing ? <IconPause className="h-3 w-3" /> : <IconPlay className="h-3 w-3" />}
        </span>
        {music.playing && (
          <span aria-hidden="true" className="absolute -right-1 -top-3 flex items-end gap-0.5">
            {[0, 0.2, 0.4].map((d) => (
              <span
                key={d}
                className="w-1 rounded-full bg-gold-400"
                style={{ height: 10, animation: `bob 0.8s ease-in-out ${d}s infinite` }}
              />
            ))}
          </span>
        )}
      </motion.button>
    </div>
  );
}
