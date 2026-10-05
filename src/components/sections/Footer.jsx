import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger, viewport } from '../../lib/motion';
import GigiBalang from '../ornaments/GigiBalang';
import Ondel from '../ornaments/Ondel';
import { FloralDivider } from '../ornaments/Flowers';

export default function Footer() {
  const { groom, bride } = wedding.couple;
  return (
    <footer
      data-buddy="Makasih banyak ye udeh mampir! Sampe ketemu!"
      className="relative overflow-hidden bg-emerald-950 bg-islamic text-cream"
    >
      <GigiBalang />
      <motion.div
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto max-w-2xl px-6 pb-56 pt-20 text-center sm:pb-72"
      >
        <motion.p variants={fadeUp} className="text-sm leading-relaxed text-cream/80">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
          memberikan doa restu kepada kedua mempelai.
        </motion.p>
        <motion.p variants={fadeUp} className="mt-6 font-display text-lg italic text-gold-200">
          Wassalamualaikum Warahmatullahi Wabarakatuh
        </motion.p>
        <motion.div variants={fadeUp}>
          <FloralDivider className="my-6" light />
        </motion.div>
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.35em] text-cream/60">
          Kami yang berbahagia
        </motion.p>
        <motion.h2 variants={popIn} className="mt-3 font-script text-6xl text-gold-gradient sm:text-7xl">
          {groom.nickname} &amp; {bride.nickname}
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 text-sm text-cream/70">
          Beserta keluarga besar Bpk. Suryadi &amp; Ibu Patimah
          <br />
          dan Bpk. Setio Budi &amp; Ibu Mulyani
        </motion.p>
      </motion.div>

      {/* The container stays in place so it can be observed; only the puppets rise. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger(0.15)}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-48 items-end justify-center gap-3 sm:h-64 sm:gap-8"
      >
        {['pria', 'wanita', 'pria', 'wanita'].map((v, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { y: 260 },
              show: { y: 0, transition: { type: 'spring', stiffness: 90, damping: 11 } },
            }}
            className={i === 0 || i === 3 ? 'hidden sm:block' : ''}
          >
            <Ondel variant={v} delay={i * 0.4} className="h-44 w-20 translate-y-5 sm:h-60 sm:w-28" />
          </motion.div>
        ))}
      </motion.div>
      <p className="absolute inset-x-0 bottom-2 z-10 text-center text-[11px] tracking-wider text-cream/50">
        Dibuat dengan 🤍 untuk hari bahagia kami · 2026
      </p>
    </footer>
  );
}
