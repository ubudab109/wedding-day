import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { images } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import { IconMail } from '../Icons';
import IslamicStar from '../ornaments/IslamicStar';
import Strawberry from '../ornaments/Strawberry';
import { Blossom, FloralCorner, Leaf, PinkBlossom } from '../ornaments/Flowers';

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
      className={`absolute inset-y-0 w-1/2 overflow-hidden bg-matcha-900 ${isLeft ? 'left-0' : 'right-0'}`}
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
      {/* Photo fades into the background behind a matcha veil, strawberry glow + Islamic pattern */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: faded ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-matcha-900/85 via-matcha-900/75 to-matcha-950/95" />
        <div
          className={`absolute inset-0 ${isLeft ? 'bg-[radial-gradient(circle_at_100%_45%,rgba(247,109,131,0.28),transparent_55%)]' : 'bg-[radial-gradient(circle_at_0%_45%,rgba(247,109,131,0.28),transparent_55%)]'}`}
        />
        <div className="absolute inset-0 bg-islamic opacity-80" />
      </motion.div>
      <div
        className={`absolute inset-y-0 w-px bg-linear-to-b from-transparent via-berry-300/70 to-transparent transition-opacity duration-1000 ${faded ? 'opacity-100' : 'opacity-0'} ${isLeft ? 'right-0' : 'left-0'}`}
      />
    </motion.div>
  );
}

const item = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } },
});

// The little garden that springs up along the bottom edge.
const GARDEN = [
  { C: Leaf, cls: 'h-6 w-10 -rotate-12', delay: 0.35 },
  { C: Strawberry, cls: 'h-12 w-10 -rotate-12', delay: 0.45 },
  { C: Blossom, cls: 'h-9 w-9', delay: 0.55 },
  { C: PinkBlossom, cls: 'hidden h-7 w-7 sm:block', delay: 0.6 },
  { C: Leaf, cls: 'hidden h-6 w-10 rotate-[200deg] sm:block', delay: 0.65 },
  { C: Strawberry, cls: 'h-10 w-8 rotate-12', delay: 0.7 },
];

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
        className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-script text-4xl text-milk drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={stage === 'photo' && photoReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.9, delay: stage === 'photo' ? 0.5 : 0 }}
      >
        Bismillah, kami menikah
      </motion.p>

      <motion.div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center text-milk"
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

        <motion.p variants={item(0.1)} className="chip bg-white/10 text-berry-100 ring-1 ring-white/20 backdrop-blur-sm">
          The Wedding of
        </motion.p>

        <motion.div
          variants={{
            hidden: { scale: 0, rotate: -90, opacity: 0 },
            show: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12, delay: 0.2 } },
          }}
          className="relative"
        >
          <IslamicStar className="my-5 h-28 w-28 text-berry-300 sm:h-36 sm:w-36">
            <span className="font-script text-4xl text-berry-200 sm:text-5xl">
              {groom.nickname[0]}
              <span className="mx-0.5 text-2xl text-matcha-200">&amp;</span>
              {bride.nickname[0]}
            </span>
          </IslamicStar>
          {/* A strawberry orbiting the monogram */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          >
            <Strawberry className="absolute -top-1 left-1/2 h-7 w-6 -translate-x-1/2" />
          </motion.div>
        </motion.div>

        <motion.h1 variants={item(0.35)} className="font-script text-6xl leading-none text-berry-gradient sm:text-7xl">
          {groom.nickname} <span className="text-5xl">&amp;</span> {bride.nickname}
        </motion.h1>
        <motion.p variants={item(0.5)} className="mt-4 font-display text-lg tracking-[0.3em] text-matcha-100">
          {wedding.dateShort}
        </motion.p>

        <motion.div
          variants={item(0.7)}
          className="mt-8 w-full max-w-xs rounded-[1.75rem] border border-white/15 bg-white/10 px-5 py-4 shadow-2xl shadow-matcha-950/40 backdrop-blur-md"
        >
          <p className="text-xs text-milk/75">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="mt-1 break-words font-display text-2xl font-semibold text-berry-100">{guest}</p>
          <p className="mt-1 text-[11px] text-milk/55">Mohon maaf apabila ada kesalahan penulisan nama &amp; gelar</p>
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
            className="btn-berry px-7 py-3.5"
          >
            <IconMail /> Buka Undangan
          </motion.button>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-3 sm:px-12 sm:pb-6">
          {[GARDEN.slice(0, 3), GARDEN.slice(3)].map((group, g) => (
            <div key={g} className={`flex items-end gap-1 sm:gap-3 ${g ? 'flex-row-reverse' : ''}`}>
              {group.map(({ C, cls, delay }, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { y: 120, opacity: 0 }, show: { y: 0, opacity: 1, transition: { delay, type: 'spring', stiffness: 110, damping: 9 } } }}
                >
                  <div className="animate-float" style={{ animationDelay: `${i * 0.7}s` }}>
                    <C className={cls} />
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
