import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger, viewport } from '../../lib/motion';
import Strawberry from '../ornaments/Strawberry';
import { Blossom, FloralDivider, Leaf, PinkBlossom } from '../ornaments/Flowers';

// A little strawberry patch that springs up along the bottom; the middle two have faces and wave goodbye.
const PATCH = [
  { el: <Leaf className="h-7 w-12 -rotate-12" />, hide: true },
  { el: <Blossom className="h-12 w-12" />, hide: true },
  { el: <Strawberry face className="h-24 w-20 sm:h-28 sm:w-24" />, wiggle: true },
  { el: <PinkBlossom className="h-10 w-10" /> },
  { el: <Strawberry face className="h-20 w-16 sm:h-24 sm:w-20" />, wiggle: true },
  { el: <Blossom className="h-12 w-12" />, hide: true },
  { el: <Leaf className="h-7 w-12 rotate-[200deg]" />, hide: true },
];

export default function Footer() {
  const { groom, bride } = wedding.couple;
  return (
    <footer
      data-buddy="Terima kasih sudah mampir! Sampai jumpa~"
      className="relative overflow-hidden bg-matcha-900 bg-islamic text-milk"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(247,109,131,0.2),transparent_60%)]" />
      <motion.div
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative mx-auto max-w-2xl px-6 pb-48 pt-20 text-center sm:pb-56"
      >
        <motion.p variants={fadeUp} className="text-sm leading-relaxed text-milk/80">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
          memberikan doa restu kepada kedua mempelai.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-6 font-display text-lg italic text-berry-200">
          Wassalamualaikum Warahmatullahi Wabarakatuh
        </motion.p>
        <motion.div variants={fadeUp}>
          <FloralDivider className="my-6" light />
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.35em] text-matcha-200">
          Kami yang berbahagia
        </motion.p>
        <motion.h2 variants={popIn} className="mt-3 font-script text-6xl text-berry-gradient sm:text-7xl">
          {groom.nickname} &amp; {bride.nickname}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-sm text-milk/70">
          Beserta keluarga besar Bpk. Suryadi &amp; Ibu Patimah
          <br />
          dan Bpk. Setio Budi &amp; Ibu Mulyani
        </motion.p>
      </motion.div>

      {/* The container stays in place so it can be observed; only the patch springs up. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger(0.1)}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex h-40 items-end justify-center gap-2 sm:gap-5"
      >
        {PATCH.map(({ el, hide, wiggle }, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { y: 200, scale: 0.4 },
              show: { y: 0, scale: 1, transition: { type: 'spring', stiffness: 110, damping: 9 } },
            }}
            className={hide ? 'hidden sm:block' : ''}
          >
            <div className={`origin-bottom ${wiggle ? 'animate-wiggle' : 'animate-float'}`} style={{ animationDelay: `${i * 0.35}s` }}>
              {el}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p className="absolute inset-x-0 bottom-3 z-10 text-center text-[11px] tracking-wider text-milk/50">
        Dibuat dengan 🍓🍵 untuk hari bahagia kami · 2026
      </p>
    </footer>
  );
}
