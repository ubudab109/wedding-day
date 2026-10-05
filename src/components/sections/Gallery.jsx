import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gallery } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import SectionTitle from '../SectionTitle';
import Photo from '../Photo';

// Varying frame ratios give the masonry its rhythm even though every shot is 2:3.
const RATIOS = ['aspect-[3/4]', 'aspect-[2/3]', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-[3/4]', 'aspect-[4/5]'];
const TILTS = [-3, 2, -2, 3, -1.5, 2.5];
const altFor = (i) => `Foto prewedding ${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname} ${i + 1}`;

function Tile({ photo, index, onOpen }) {
  const delay = (index % 3) * 0.12;
  const tilt = TILTS[index % TILTS.length];
  return (
    // The unclipped wrapper is what gets observed; a fully clipped element never reports as in view.
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="mb-4 break-inside-avoid"
    >
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Lihat foto ${index + 1}`}
      variants={{
        hidden: { opacity: 0, y: 60, rotate: tilt * 2, clipPath: 'inset(0 0 100% 0)' },
        show: {
          opacity: 1,
          y: 0,
          rotate: 0,
          clipPath: 'inset(0 0 0% 0)',
          transition: { type: 'spring', stiffness: 90, damping: 16, delay },
        },
      }}
      whileHover={{ rotate: tilt, scale: 1.03, zIndex: 2 }}
      whileTap={{ scale: 0.97 }}
      className="group relative block w-full overflow-hidden rounded-2xl border-4 border-ivory bg-ivory shadow-xl shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
    >
      {/* Inner zoom-out "Ken Burns" as the tile is revealed */}
      <motion.div
        variants={{
          hidden: { scale: 1.35 },
          show: { scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay } },
        }}
      >
        <Photo
          photo={photo}
          alt={altFor(index)}
          sizes="(min-width: 768px) 30vw, 46vw"
          position="50% 30%"
          className={`w-full rounded-xl ${RATIOS[index % RATIOS.length]}`}
          imgClassName="transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>
      <span className="pointer-events-none absolute inset-1 flex items-end justify-center rounded-xl bg-linear-to-t from-emerald-950/70 via-transparent to-transparent pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-script text-2xl text-gold-200">Lihat</span>
      </span>
    </motion.button>
    </motion.div>
  );
}

function Lightbox({ index, onClose, onStep }) {
  const closeRef = useRef(null);
  const photo = gallery[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
      className="fixed inset-0 z-[65] flex items-center justify-center bg-emerald-950/95 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={photo.src}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 60vw, 92vw"
          alt={altFor(index)}
          onClick={(e) => e.stopPropagation()}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) onStep(1);
            else if (info.offset.x > 80) onStep(-1);
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotate: 4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="max-h-[82svh] w-auto max-w-full cursor-grab touch-pan-y rounded-2xl border-4 border-ivory object-contain shadow-2xl active:cursor-grabbing"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          draggable={false}
        />
      </AnimatePresence>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Tutup galeri"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-gold-400/60 bg-emerald-900 text-2xl leading-none text-gold-200 hover:bg-emerald-800"
      >
        ×
      </button>
      {[-1, 1].map((dir) => (
        <button
          key={dir}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(dir);
          }}
          aria-label={dir < 0 ? 'Foto sebelumnya' : 'Foto berikutnya'}
          className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold-400/60 bg-emerald-900/80 text-2xl text-gold-200 hover:bg-emerald-800 sm:grid ${dir < 0 ? 'left-6' : 'right-6'}`}
        >
          {dir < 0 ? '‹' : '›'}
        </button>
      ))}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-900/80 px-4 py-1 text-sm tracking-widest text-gold-200">
        {index + 1} / {gallery.length}
      </p>
    </motion.div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const step = useCallback((dir) => setOpen((i) => (i + dir + gallery.length) % gallery.length), []);
  const close = useCallback(() => setOpen(null), []);

  if (gallery.length === 0) return null;

  return (
    <section
      id="galeri"
      data-buddy="Cakep bener dah fotonye! Kayak artis!"
      className="relative overflow-hidden bg-emerald-950 bg-islamic px-4 py-20 text-cream sm:px-5 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,74,0.18),transparent_60%)]" />
      <div className="relative">
        <SectionTitle arabic="ذِكْرَيَات" eyebrow="Momen Kami" title="Our Galleries" light />
        <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3">
          {gallery.map((photo, i) => (
            <Tile key={photo.src} photo={photo} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  );
}
