import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { wedding } from '../../config/wedding';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import { IconHeart, IconMosque, IconRing, IconSpark } from '../Icons';

const ICONS = { spark: IconSpark, heart: IconHeart, ring: IconRing, mosque: IconMosque };

export default function LoveStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  return (
    <section
      id="kisah"
      data-buddy="Uhuy! Kisah cintanye bikin baper, ye kan?"
      className="relative overflow-hidden bg-ivory px-5 py-20 sm:py-28"
    >
      <SectionTitle arabic="قِصَّتُنَا" eyebrow="Perjalanan Kami" title="Kisah Cinta" />

      <ol ref={ref} className="relative mx-auto max-w-4xl">
        {/* Timeline rail that fills as you scroll */}
        <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-gold-300/50 md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          style={{ scaleY: progress }}
          className="absolute bottom-0 left-5 top-0 w-0.5 origin-top bg-linear-to-b from-gold-500 via-burgundy-500 to-emerald-700 md:left-1/2 md:-translate-x-1/2"
        />

        {wedding.story.map((item, i) => {
          const Icon = ICONS[item.icon];
          const right = i % 2 === 1;
          return (
            <li key={item.title} className="relative mb-10 pl-14 last:mb-0 md:grid md:grid-cols-2 md:gap-14 md:pl-0">
              <motion.span
                variants={popIn}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                className="absolute left-0 top-2 z-10 grid h-10 w-10 place-items-center rounded-full border-2 border-gold-400 bg-burgundy-700 text-gold-200 shadow-lg md:left-1/2 md:-translate-x-1/2"
              >
                <Icon />
              </motion.span>
              <motion.div
                variants={slideFrom(right ? 'right' : 'left')}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                whileHover={{ rotate: right ? 1 : -1, scale: 1.02 }}
                className={`card-glass px-6 py-6 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-burgundy-600">{item.date}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-emerald-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-950/75">{item.text}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
