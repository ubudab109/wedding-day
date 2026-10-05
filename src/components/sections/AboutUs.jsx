import { motion } from 'framer-motion';
import { images } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import Photo from '../Photo';
import Ondel from '../ornaments/Ondel';
import IslamicStar from '../ornaments/IslamicStar';
import { Melati, Rose } from '../ornaments/Flowers';

function Person({ person, photo, variant, dir }) {
  const isGroom = variant === 'pria';
  return (
    <motion.article
      variants={slideFrom(dir)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="card-glass relative flex flex-col items-center px-6 pb-8 pt-8 text-center"
    >
      <div className="relative">
        {/* Arched frame (Betawi doorway) with the portrait inside */}
        {/* Driven by the article's in-view variant: a fully clipped element never counts as "in view" itself. */}
        <motion.div
          variants={{
            hidden: { clipPath: 'inset(100% 0 0 0)' },
            show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 } },
          }}
          className="rounded-t-full border-4 border-gold-400 p-1.5 shadow-xl shadow-emerald-950/20"
        >
          <Photo
            photo={photo}
            alt={person.fullName}
            sizes="(min-width: 640px) 13rem, 11rem"
            position="50% 30%"
            className="h-64 w-44 rounded-t-full sm:h-72 sm:w-52"
            imgClassName="transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
        <Rose className="absolute -left-5 bottom-6 h-12 w-12 animate-float" />
        <Melati className="absolute -right-4 bottom-14 h-9 w-9 animate-float [animation-delay:1s]" />
        <Melati className="absolute -left-3 top-20 h-7 w-7 animate-float [animation-delay:2s]" />
        {/* A tiny Ondel-ondel peeking from behind the frame */}
        <motion.div
          initial={{ x: isGroom ? 30 : -30, opacity: 0, rotate: isGroom ? 20 : -20 }}
          whileInView={{ x: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 160, damping: 10, delay: 0.9 }}
          className={`absolute -bottom-2 ${isGroom ? '-right-9' : '-left-9'}`}
        >
          <Ondel variant={variant} className="h-24 w-11" />
        </motion.div>
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-burgundy-600">{person.role}</p>
      <h3 className="mt-2 font-script text-4xl leading-tight text-emerald-900 sm:text-5xl">{person.fullName}</h3>
      <p className="mt-3 font-display text-lg font-semibold text-burgundy-700">{person.parents}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-emerald-950/75">{person.description}</p>
    </motion.article>
  );
}

export default function AboutUs() {
  const { groom, bride } = wedding.couple;
  return (
    <section
      id="mempelai"
      data-buddy="Cieee… ini die pasangan paling serasi se-Jakarte!"
      className="relative overflow-hidden bg-cream bg-islamic-dark px-5 py-20 sm:py-28"
    >
      <SectionTitle arabic="الزَّوْجَان" eyebrow="Dengan memohon rahmat dan ridho Allah SWT" title="Kedua Mempelai" />
      <p className="mx-auto -mt-4 mb-12 max-w-xl text-center text-sm leading-relaxed text-emerald-950/70">
        Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Kami bermaksud menyelenggarakan
        pernikahan putra-putri kami:
      </p>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_auto_1fr]">
        <Person person={groom} photo={images[wedding.photos.groom]} variant="pria" dir="left" />
        <motion.div variants={popIn} initial="hidden" whileInView="show" viewport={viewport} className="mx-auto self-center">
          <IslamicStar className="h-24 w-24">
            <span className="font-script text-5xl text-burgundy-700">&amp;</span>
          </IslamicStar>
        </motion.div>
        <Person person={bride} photo={images[wedding.photos.bride]} variant="wanita" dir="right" />
      </div>
    </section>
  );
}
