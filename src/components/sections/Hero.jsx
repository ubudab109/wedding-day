import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger } from '../../lib/motion';
import GigiBalang from '../ornaments/GigiBalang';
import Ondel from '../ornaments/Ondel';
import { FloralCorner, FloralDivider } from '../ornaments/Flowers';

export default function Hero({ active }) {
  const { groom, bride } = wedding.couple;
  const { quran } = wedding;

  return (
    <section
      id="home"
      data-buddy="Assalamualaikum! Selamat dateng, Abang & Mpok!"
      className="relative flex min-h-svh flex-col overflow-hidden bg-emerald-950 bg-islamic text-cream"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,74,0.22),transparent_60%)]" />
      <GigiBalang className="relative z-10" />
      <FloralCorner className="absolute -left-4 top-4 h-40 w-40 sm:h-60 sm:w-60" />
      <FloralCorner side="right" className="absolute -right-4 top-4 h-40 w-40 sm:h-60 sm:w-60" />

      <motion.div
        variants={stagger(0.18, 0.2)}
        initial="hidden"
        animate={active ? 'show' : 'hidden'}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-40 pt-16 text-center sm:pb-48"
      >
        <motion.p
          variants={popIn}
          lang="ar"
          dir="rtl"
          className="font-calligraphy text-4xl leading-tight text-gold-300 sm:text-6xl"
          aria-label="Bismillahirrahmanirrahim"
        >
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.p>

        <motion.p variants={fadeUp} className="mt-6 font-display text-lg italic text-gold-200 sm:text-xl">
          Assalamualaikum Warahmatullahi Wabarakatuh
        </motion.p>

        <motion.p variants={fadeUp} className="mt-8 text-xs uppercase tracking-[0.45em] text-cream/70">
          Walimatul &lsquo;Urs
        </motion.p>

        <motion.h1 variants={popIn} className="mt-3 font-script text-5xl leading-[1.1] sm:text-7xl lg:text-8xl">
          <span className="block text-gold-gradient">{groom.fullName}</span>
          <span className="my-1 block font-display text-3xl italic text-cream/80 sm:text-4xl">&amp;</span>
          <span className="block text-gold-gradient">{bride.fullName}</span>
        </motion.h1>

        <motion.div variants={fadeUp} className="mt-6 flex items-center gap-4 font-display text-cream">
          <span className="h-px w-10 bg-gold-400" />
          <span className="text-lg tracking-[0.2em] sm:text-xl">{wedding.dateLabel}</span>
          <span className="h-px w-10 bg-gold-400" />
        </motion.div>

        <motion.figure
          variants={fadeUp}
          className="mt-10 w-full max-w-2xl rounded-3xl border border-gold-400/30 bg-emerald-900/40 px-6 py-7 backdrop-blur-sm"
        >
          <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.1] text-gold-200 sm:text-3xl">
            {quran.arabic}
          </p>
          <FloralDivider className="my-4" light />
          <blockquote className="font-display text-base italic leading-relaxed text-cream/90 sm:text-lg">
            &ldquo;{quran.translation}&rdquo;
          </blockquote>
          <figcaption className="mt-3 text-sm font-medium tracking-widest text-gold-300">{quran.source}</figcaption>
        </motion.figure>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-2 sm:px-12">
        <Ondel variant="pria" className="h-44 w-20 translate-y-4 sm:h-72 sm:w-32" />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="mb-6 text-center text-[11px] uppercase tracking-[0.35em] text-gold-300/80"
        >
          Gulir ke bawah
          <span className="mx-auto mt-2 block h-8 w-5 rounded-full border border-gold-300/70 p-1">
            <span className="mx-auto block h-2 w-1 rounded-full bg-gold-300" />
          </span>
        </motion.div>
        <Ondel variant="wanita" delay={0.5} className="h-44 w-20 translate-y-4 sm:h-72 sm:w-32" />
      </div>
    </section>
  );
}
