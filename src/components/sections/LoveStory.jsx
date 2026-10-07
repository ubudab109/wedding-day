import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding } from '../../config/wedding';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import Strawberry from '../ornaments/Strawberry';
import Wave from '../ornaments/Wave';
import { IconHeart, IconMosque, IconRing, IconSpark } from '../Icons';

const ICONS = { spark: IconSpark, heart: IconHeart, ring: IconRing, mosque: IconMosque };

export default function LoveStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });
  const tip = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section
      id="kisah"
      data-buddy="Uhuy! Kisah cintanya bikin meleleh~"
      className="relative overflow-hidden bg-berry-50 bg-islamic-berry px-5 pb-28 pt-16 sm:pb-36 sm:pt-24"
    >
      <SectionTitle arabic="قِصَّتُنَا" eyebrow="Perjalanan Kami" title="Kisah Cinta" />

      <ol ref={ref} className="relative mx-auto max-w-4xl">
        {/* Timeline rail that fills as you scroll, with a strawberry riding its tip */}
        <div className="absolute bottom-0 left-5 top-0 w-1 -translate-x-1/2 rounded-full bg-berry-200/60 md:left-1/2" />
        <motion.div
          style={{ scaleY: progress }}
          className="absolute bottom-0 left-5 top-0 w-1 origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-matcha-400 via-berry-400 to-berry-600 md:left-1/2"
        />
        <motion.div
          aria-hidden="true"
          style={{ top: tip }}
          className="absolute left-5 z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
        >
          <Strawberry className="h-9 w-8 animate-wiggle drop-shadow-md" />
        </motion.div>

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
                className="absolute left-0 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-milk text-berry-500 shadow-lg ring-4 ring-berry-100 md:left-1/2 md:-translate-x-1/2"
              >
                <Icon />
              </motion.span>
              <motion.div
                variants={slideFrom(right ? 'right' : 'left')}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                whileHover={{ rotate: right ? 1 : -1, scale: 1.02 }}
                className={`card-soft px-6 py-6 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}
              >
                <p className={`chip ${i % 2 ? 'bg-matcha-100 text-matcha-700' : 'bg-berry-100 text-berry-600'}`}>{item.date}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-matcha-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-matcha-900/70">{item.text}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>

      <Wave className="text-matcha-100" />
    </section>
  );
}
