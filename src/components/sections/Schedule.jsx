import { motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { fadeUp, popIn, stagger, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import GigiBalang from '../ornaments/GigiBalang';
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
      data-buddy="Catet tanggalnye! Jangan sampe kelewatan ye!"
      className="relative overflow-hidden bg-emerald-950 bg-islamic text-cream"
    >
      <GigiBalang />
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <SectionTitle arabic="المَوْعِد" eyebrow="Waktu & Tempat" title="Rangkaian Acara" light />

        <motion.div
          variants={stagger(0.18)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2"
        >
          {events.map((ev) => (
            <motion.article
              key={ev.title}
              variants={popIn}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-t-[10rem] rounded-b-3xl border border-gold-400/40 bg-linear-to-b from-burgundy-800 to-burgundy-950 px-6 pb-8 pt-14 text-center shadow-2xl shadow-black/30"
            >
              <div className="pointer-events-none absolute inset-2 rounded-t-[10rem] rounded-b-2xl border border-gold-400/25" />
              <p lang="ar" dir="rtl" className="font-calligraphy text-3xl text-gold-300">
                {ev.arabic}
              </p>
              <h3 className="mt-1 font-script text-5xl text-cream">{ev.title}</h3>
              <ul className="mt-6 space-y-3 text-sm text-cream/90">
                <li className="flex items-center justify-center gap-2">
                  <IconCalendar className="h-4 w-4 text-gold-300" /> {ev.date}
                </li>
                <li className="flex items-center justify-center gap-2">
                  <IconClock className="h-4 w-4 text-gold-300" /> {ev.time}
                </li>
                <li className="flex items-center justify-center gap-2">
                  <IconPin className="h-4 w-4 text-gold-300" /> {venue.name}, {venue.city}
                </li>
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-12 overflow-hidden rounded-3xl border border-gold-400/40 bg-emerald-900/50 shadow-2xl"
        >
          <div className="flex flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-display text-2xl font-semibold text-gold-200">{venue.name}</p>
              <p className="text-sm text-cream/70">{venue.city}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-outline text-gold-200">
                <IconPin className="h-4 w-4" /> Buka Maps
              </a>
              <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-gold py-2.5">
                Petunjuk Arah
              </a>
            </div>
          </div>
          <iframe
            title={`Peta lokasi ${venue.name}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-72 w-full border-0 grayscale-[30%] sm:h-96"
            allowFullScreen
          />
        </motion.div>
      </div>
      <GigiBalang flip />
    </section>
  );
}
