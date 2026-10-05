import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { images } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import { IconMail } from '../Icons';
import Ondel from '../ornaments/Ondel';
import IslamicStar from '../ornaments/IslamicStar';
import { FloralCorner } from '../ornaments/Flowers';

const DOOR_MS = 1500;
const PHOTO_HOLD_MS = 2400; // how long the photo is shown on its own
const PHOTO_MAX_WAIT_MS = 4500; // start the intro even if the photo is slow to load

const photo = images[wedding.photos.opening];

// One half of the gate. Each half carries its half of the photo, so the picture
// splits down the middle when the doors open.
function DoorPanel({ side, stage, onPhotoLoad }) {
  const isLeft = side === 'left';
  const faded = stage !== 'photo';
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute inset-y-0 w-1/2 overflow-hidden bg-emerald-950 ${isLeft ? 'left-0' : 'right-0'}`}
      animate={stage === 'opening' ? { x: isLeft ? '-102%' : '102%' } : { x: 0 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.7, 0, 0.3, 1] }}
    >
      {photo && (
        <motion.img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          onLoad={onPhotoLoad}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: faded ? 1.02 : 1.08 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, ease: 'easeOut' } }}
          // Each half is a full-viewport-wide image anchored to the outer edge, so the two halves line up.
          className={`absolute inset-y-0 h-full w-[200%] max-w-none object-cover ${isLeft ? 'left-0' : 'right-0'}`}
          style={{ objectPosition: '50% 35%' }}
        />
      )}
      {/* Photo fades into the background behind an emerald veil + Islamic pattern */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: faded ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/80 via-emerald-950/70 to-emerald-950/95" />
        <div className="absolute inset-0 bg-islamic opacity-70" />
      </motion.div>
      <div
        className={`absolute inset-y-0 w-px bg-linear-to-b from-transparent via-gold-400/70 to-transparent transition-opacity duration-1000 ${faded ? 'opacity-100' : 'opacity-0'} ${isLeft ? 'right-0' : 'left-0'}`}
      />
    </motion.div>
  );
}

const item = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
});

export default function Cover({ guest, onOpen, onDone }) {
  // photo → intro (names + button) → opening (doors part)
  const [stage, setStage] = useState('photo');
  const [photoReady, setPhotoReady] = useState(!photo);
  const { groom, bride } = wedding.couple;

  useEffect(() => {
    const hold = photoReady ? setTimeout(() => setStage((s) => (s === 'photo' ? 'intro' : s)), PHOTO_HOLD_MS) : null;
    const cap = setTimeout(() => setStage((s) => (s === 'photo' ? 'intro' : s)), PHOTO_MAX_WAIT_MS);
    return () => {
      clearTimeout(hold);
      clearTimeout(cap);
    };
  }, [photoReady]);

  const handleOpen = () => {
    if (stage === 'opening') return;
    setStage('opening');
    onOpen();
    setTimeout(onDone, DOOR_MS);
  };

  const show = stage === 'intro' ? 'show' : 'hidden';

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden" role="dialog" aria-label="Sampul undangan">
      <DoorPanel side="left" stage={stage} onPhotoLoad={() => setPhotoReady(true)} />
      <DoorPanel side="right" stage={stage} />

      {/* Photo-only moment: a gentle caption */}
      <motion.p
        className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-script text-4xl text-cream drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={stage === 'photo' && photoReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.9, delay: stage === 'photo' ? 0.5 : 0 }}
      >
        Bismillah, kami menikah
      </motion.p>

      <motion.div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream"
        initial="hidden"
        animate={stage === 'opening' ? { opacity: 0, scale: 1.15, filter: 'blur(6px)' } : show}
        variants={{ hidden: {}, show: {} }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: stage === 'photo' ? 'none' : 'auto' }}
      >
        <motion.div variants={item(0)} className="pointer-events-none absolute inset-0">
          <FloralCorner className="absolute -left-6 -top-6 h-44 w-44 sm:h-64 sm:w-64" />
          <FloralCorner side="right" className="absolute -right-6 -top-6 h-44 w-44 sm:h-64 sm:w-64" />
        </motion.div>

        <motion.p variants={item(0.1)} className="text-xs uppercase tracking-[0.4em] text-gold-300">
          The Wedding of
        </motion.p>

        <motion.div
          variants={{
            hidden: { scale: 0, rotate: -90, opacity: 0 },
            show: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12, delay: 0.2 } },
          }}
        >
          <IslamicStar className="my-5 h-28 w-28 sm:h-36 sm:w-36">
            <span className="font-script text-4xl text-gold-300 sm:text-5xl">
              {groom.nickname[0]}
              <span className="mx-0.5 text-2xl text-cream/80">&amp;</span>
              {bride.nickname[0]}
            </span>
          </IslamicStar>
        </motion.div>

        <motion.h1 variants={item(0.35)} className="font-script text-6xl leading-none text-gold-gradient sm:text-7xl">
          {groom.nickname} <span className="text-5xl">&amp;</span> {bride.nickname}
        </motion.h1>
        <motion.p variants={item(0.5)} className="mt-3 font-display text-lg tracking-[0.3em] text-cream/90">
          {wedding.dateShort}
        </motion.p>

        <motion.div
          variants={item(0.7)}
          className="mt-8 w-full max-w-xs rounded-2xl border border-gold-400/40 bg-emerald-950/60 px-5 py-4 backdrop-blur-sm"
        >
          <p className="text-xs text-cream/80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="mt-1 break-words font-display text-2xl font-semibold text-gold-200">{guest}</p>
          <p className="mt-1 text-[11px] text-cream/60">Mohon maaf apabila ada kesalahan penulisan nama & gelar</p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 12, delay: 0.95 } },
          }}
          className="relative z-10 mt-7"
        >
          <motion.button
            type="button"
            onClick={handleOpen}
            animate={stage === 'intro' ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ delay: 1.8, duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            whileTap={{ scale: 0.92 }}
            className="btn-gold"
          >
            <IconMail /> Buka Undangan
          </motion.button>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-between px-1 sm:px-10">
          <motion.div variants={{ hidden: { y: 220 }, show: { y: 0, transition: { delay: 0.4, type: 'spring', stiffness: 80 } } }}>
            <Ondel variant="pria" className="h-40 w-[4.4rem] translate-y-6 sm:h-64 sm:w-28" />
          </motion.div>
          <motion.div variants={{ hidden: { y: 220 }, show: { y: 0, transition: { delay: 0.55, type: 'spring', stiffness: 80 } } }}>
            <Ondel variant="wanita" delay={0.6} className="h-40 w-[4.4rem] translate-y-6 sm:h-64 sm:w-28" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
