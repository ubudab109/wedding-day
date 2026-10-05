import { motion } from 'framer-motion';
import { dropIn, fadeUp, stagger, viewport } from '../lib/motion';
import { FloralDivider } from './ornaments/Flowers';

export default function SectionTitle({ arabic, eyebrow, title, light = false, className = '' }) {
  return (
    <motion.header
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`mb-10 text-center sm:mb-14 ${className}`}
    >
      {arabic && (
        <motion.p
          variants={dropIn}
          lang="ar"
          dir="rtl"
          className={`font-calligraphy text-3xl sm:text-4xl ${light ? 'text-gold-300' : 'text-gold-600'}`}
        >
          {arabic}
        </motion.p>
      )}
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          className={`mt-2 text-xs font-medium uppercase tracking-[0.35em] ${light ? 'text-gold-200/80' : 'text-burgundy-600'}`}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className={`mt-2 font-script text-5xl leading-tight sm:text-6xl ${light ? 'text-cream' : 'text-emerald-900'}`}
      >
        {title}
      </motion.h2>
      <motion.div variants={fadeUp}>
        <FloralDivider className="mt-4" light={light} />
      </motion.div>
    </motion.header>
  );
}
