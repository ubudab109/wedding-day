import { motion } from 'framer-motion';
import { images } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger, viewport } from '../../lib/motion';
import Photo from '../Photo';
import IslamicStar from '../ornaments/IslamicStar';
import Strawberry from '../ornaments/Strawberry';
import Wave from '../ornaments/Wave';
import { Blossom, FloralCorner, FloralDivider, Leaf, PinkBlossom } from '../ornaments/Flowers';

// Opening photo framed in a mihrab arch, crowned with an 8-point star.
function ArchPortrait() {
  return (
    <motion.div variants={popIn} className="relative mx-auto w-56 sm:w-64 lg:w-72">
      <div className="absolute -inset-3 rounded-t-full border border-dashed border-berry-200/50" />
      <div className="relative rounded-t-full bg-linear-to-b from-berry-300 via-berry-200 to-matcha-300 p-1.5 shadow-2xl shadow-matcha-950/60">
        <Photo
          photo={images[wedding.photos.opening]}
          alt={`${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname}`}
          sizes="(min-width: 1024px) 18rem, 16rem"
          position="50% 30%"
          eager
          className="aspect-[3/4.4] w-full rounded-t-full"
        />
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <IslamicStar className="h-16 w-16 text-berry-200">
          <span className="block h-3 w-3 rotate-45 rounded-[3px] bg-berry-300" />
        </IslamicStar>
      </div>
      <Blossom className="absolute -left-6 bottom-16 h-12 w-12 animate-float" />
      <PinkBlossom className="absolute -right-5 bottom-32 h-9 w-9 animate-float [animation-delay:1.4s]" />
      <Leaf className="absolute -left-8 bottom-6 h-6 w-10 -rotate-12 animate-sway" />
      <div className="absolute -right-6 bottom-2 origin-top animate-wiggle">
        <Strawberry className="h-14 w-12" />
      </div>
    </motion.div>
  );
}

export default function Hero({ active }) {
  const { groom, bride } = wedding.couple;
  const { quran } = wedding;

  return (
    <section
      id="home"
      data-buddy="Assalamualaikum! Selamat datang, yuk masuk~"
      className="relative overflow-hidden bg-matcha-900 bg-islamic pb-24 text-milk sm:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(247,109,131,0.22),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(141,170,100,0.25),transparent_55%)]" />
      <FloralCorner className="absolute -left-6 -top-4 h-40 w-40 sm:h-56 sm:w-56" />
      <FloralCorner side="right" className="absolute -right-6 -top-4 h-40 w-40 sm:h-56 sm:w-56 lg:hidden" />

      <motion.div
        variants={stagger(0.16, 0.2)}
        initial="hidden"
        animate={active ? 'show' : 'hidden'}
        className="relative z-10 mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 pb-10 pt-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-16"
      >
        <div className="text-center lg:text-left">
          <motion.p
            variants={popIn}
            lang="ar"
            dir="rtl"
            className="font-calligraphy text-4xl leading-tight text-berry-200 sm:text-5xl lg:text-left"
            aria-label="Bismillahirrahmanirrahim"
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </motion.p>

          <motion.p variants={fadeUp} className="mt-5 font-display text-lg italic text-matcha-100 sm:text-xl">
            Assalamualaikum Warahmatullahi Wabarakatuh
          </motion.p>

          <motion.p variants={fadeUp} className="chip mt-8 bg-berry-400/15 text-berry-200 ring-1 ring-berry-300/30">
            Walimatul &lsquo;Urs
          </motion.p>

          <motion.h1 variants={popIn} className="mt-4 font-script text-5xl leading-[1.12] sm:text-7xl">
            <span className="block text-berry-gradient">{groom.fullName}</span>
            <span className="my-1 block font-display text-3xl italic text-matcha-200 sm:text-4xl">&amp;</span>
            <span className="block text-berry-gradient">{bride.fullName}</span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-milk/95 py-2 pl-2 pr-5 font-display text-matcha-900 shadow-xl shadow-matcha-950/40"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-berry-500 text-milk">
              <Strawberry className="h-5 w-5" body="#fffaf3" shade="#ffc7d0" leaf="#cddcb4" />
            </span>
            <span className="text-base tracking-wide sm:text-lg">{wedding.dateLabel}</span>
          </motion.div>
        </div>

        <ArchPortrait />

        <motion.div
          variants={fadeUp}
          className="absolute inset-x-0 bottom-0 hidden justify-center sm:flex"
          aria-hidden="true"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-matcha-200/80"
          >
            Gulir ke bawah
            <span className="mx-auto mt-2 block h-8 w-5 rounded-full border border-matcha-200/60 p-1">
              <span className="mx-auto block h-2 w-1 rounded-full bg-berry-300" />
            </span>
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.figure
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative z-10 mx-6 max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-8 text-center backdrop-blur-sm sm:mx-auto sm:px-10"
      >
        <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.1] text-berry-100 sm:text-3xl">
          {quran.arabic}
        </p>
        <FloralDivider className="my-4" light />
        <blockquote className="font-display text-base italic leading-relaxed text-milk/90 sm:text-lg">
          &ldquo;{quran.translation}&rdquo;
        </blockquote>
        <figcaption className="chip mt-4 bg-matcha-700/60 text-matcha-100">{quran.source}</figcaption>
      </motion.figure>

      <Wave className="text-berry-50" />
    </section>
  );
}
