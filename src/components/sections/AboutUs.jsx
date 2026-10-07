import { motion } from 'framer-motion';
import { images } from 'virtual:photos';
import { wedding } from '../../config/wedding';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import Photo from '../Photo';
import IslamicStar from '../ornaments/IslamicStar';
import Strawberry from '../ornaments/Strawberry';
import Wave from '../ornaments/Wave';
import { Blossom, Leaf, PinkBlossom } from '../ornaments/Flowers';
import { IconInstagram } from '../Icons';

function Person({ person, photo, side }) {
  const isGroom = side === 'left';
  return (
    <motion.article
      variants={slideFrom(side)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className="card-soft relative flex flex-col items-center px-6 pb-8 pt-10 text-center"
    >
      <div className="relative">
        {/* Mihrab-arched frame with the portrait inside. */}
        {/* Driven by the article's in-view variant: a fully clipped element never counts as "in view" itself. */}
        <motion.div
          variants={{
            hidden: { clipPath: 'inset(100% 0 0 0)' },
            show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 } },
          }}
          className={`rounded-t-full bg-linear-to-b p-1.5 shadow-xl ${isGroom ? 'from-matcha-300 to-matcha-600 shadow-matcha-900/25' : 'from-berry-200 to-berry-500 shadow-berry-800/25'}`}
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
        <div className="pointer-events-none absolute -inset-2.5 rounded-t-full border border-dashed border-matcha-300/70" />
        <Blossom className="absolute -left-5 bottom-6 h-12 w-12 animate-float" />
        <PinkBlossom className="absolute -right-4 bottom-16 h-9 w-9 animate-float [animation-delay:1s]" />
        <Leaf className="absolute -left-6 top-24 h-5 w-9 -rotate-45 animate-sway [animation-delay:2s]" />
        {/* A strawberry that hops in from behind the frame */}
        <motion.div
          initial={{ x: isGroom ? 30 : -30, y: 20, opacity: 0, rotate: isGroom ? 25 : -25 }}
          whileInView={{ x: 0, y: 0, opacity: 1, rotate: isGroom ? 12 : -12 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 160, damping: 9, delay: 0.9 }}
          className={`absolute -bottom-3 ${isGroom ? '-right-7' : '-left-7'}`}
        >
          <div className="animate-bob">
            <Strawberry face className="h-14 w-12 drop-shadow-md" />
          </div>
        </motion.div>
      </div>

      <p className={`chip mt-7 ${isGroom ? 'bg-matcha-100 text-matcha-700' : 'bg-berry-100 text-berry-600'}`}>{person.role}</p>
      <h3 className="mt-3 font-script text-4xl leading-tight text-matcha-800 sm:text-5xl">{person.fullName}</h3>
      <p className="mt-3 font-display text-base font-semibold text-berry-600 sm:text-lg">{person.parents}</p>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-matcha-900/70">{person.description}</p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-matcha-200 px-3 py-1.5 text-xs font-semibold text-matcha-700 transition hover:border-berry-300 hover:text-berry-600"
        >
          <IconInstagram className="h-4 w-4" /> @{person.instagram}
        </a>
      )}
    </motion.article>
  );
}

export default function AboutUs() {
  const { groom, bride } = wedding.couple;
  return (
    <section
      id="mempelai"
      data-buddy="Cieee… pasangan paling manis kayak stroberi!"
      className="relative overflow-hidden bg-milk bg-islamic-matcha px-5 pb-28 pt-16 sm:pb-36 sm:pt-24"
    >
      <SectionTitle arabic="الزَّوْجَان" eyebrow="Dengan memohon rahmat dan ridho Allah SWT" title="Kedua Mempelai" />
      <p className="mx-auto -mt-4 mb-14 max-w-xl text-center text-sm leading-relaxed text-matcha-900/70">
        Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Kami bermaksud menyelenggarakan
        pernikahan putra-putri kami:
      </p>

      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <Person person={groom} photo={images[wedding.photos.groom]} side="left" />
        <motion.div variants={popIn} initial="hidden" whileInView="show" viewport={viewport} className="mx-auto self-center">
          <IslamicStar className="h-24 w-24 text-matcha-400">
            <span className="font-script text-5xl text-berry-500">&amp;</span>
          </IslamicStar>
        </motion.div>
        <Person person={bride} photo={images[wedding.photos.bride]} side="right" />
      </div>

      <Wave className="text-matcha-800" />
    </section>
  );
}
