import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import IslamicStar from '../ornaments/IslamicStar';
import Wave from '../ornaments/Wave';
import { Blossom, Leaf } from '../ornaments/Flowers';
import { IconCalendar, IconClock, IconPin } from '../Icons';

export default function Schedule() {
  const { venue, events } = wedding;
  const coords = `${venue.lat},${venue.lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;
  const embedUrl = `https://maps.google.com/maps?q=${coords}&z=16&output=embed`;

  return (
    <section
      id="acara"
      data-buddy="Catat tanggalnya ya, jangan sampai kelewatan!"
      className="relative overflow-hidden bg-matcha-100 bg-islamic-matcha px-5 pb-28 pt-16 sm:pb-36 sm:pt-24"
    >
      <div className="mx-auto max-w-5xl">
        <SectionTitle arabic="المَوْعِد" eyebrow="Waktu & Tempat" title="Rangkaian Acara" />

        <motion.div
          variants={stagger(0.18)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-8 md:grid-cols-2"
        >
          {events.map((ev, i) => (
            <motion.article
              key={ev.title}
              variants={popIn}
              whileHover={{ y: -6 }}
              className={`relative mx-auto w-full max-w-sm overflow-hidden rounded-t-[10rem] rounded-b-[2rem] bg-linear-to-b px-6 pb-9 pt-20 text-center text-milk shadow-2xl ${
                i % 2 ? 'from-matcha-500 to-matcha-800 shadow-matcha-900/30' : 'from-berry-400 to-berry-700 shadow-berry-800/30'
              }`}
            >
              <div className="pointer-events-none absolute inset-2.5 rounded-t-[10rem] rounded-b-[1.6rem] border border-white/30" />
              <div className="pointer-events-none absolute inset-0 bg-islamic opacity-60" />
              <div className="absolute left-1/2 top-5 -translate-x-1/2">
                <IslamicStar className="h-10 w-10 text-white/60">
                  <span className="block h-1.5 w-1.5 rounded-full bg-white/80" />
                </IslamicStar>
              </div>
              <p lang="ar" dir="rtl" className="relative font-calligraphy text-3xl text-white/90">
                {ev.arabic}
              </p>
              <h3 className="relative mt-1 font-script text-5xl">{ev.title}</h3>
              <ul className="relative mx-auto mt-6 max-w-xs space-y-2.5 text-sm">
                {[
                  [IconCalendar, ev.date],
                  [IconClock, ev.time],
                  [IconPin, `${venue.name}, ${venue.city}`],
                ].map(([Icon, text]) => (
                  <li key={text} className="flex items-center justify-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm">
                    <Icon className="h-4 w-4 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="card-soft relative mt-12 overflow-hidden"
        >
          <Blossom className="absolute -right-3 -top-3 h-14 w-14 animate-float" />
          <Leaf className="absolute right-10 top-3 h-5 w-9 rotate-12 animate-sway" />
          <div className="flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-display text-2xl font-semibold text-matcha-800">{venue.name}</p>
              <p className="text-sm text-matcha-900/60">{venue.city}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-outline text-matcha-700">
                <IconPin className="h-4 w-4" /> Buka Maps
              </a>
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-berry py-2.5">
                Petunjuk Arah
              </a>
            </div>
          </div>
          <iframe
            title={`Peta lokasi ${venue.name}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-72 w-full border-0 sm:h-96"
            allowFullScreen
          />
        </motion.div>
      </div>

      <Wave className="text-berry-700" />
    </section>
  );
}
