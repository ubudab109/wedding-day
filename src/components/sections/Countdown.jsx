import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { popIn, stagger, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import { IconCalendar } from '../Icons';

const calendarUrl = () => {
  const ev = wedding.events[0];
  const last = wedding.events.at(-1);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${wedding.couple.groom.nickname} & ${wedding.couple.bride.nickname}`,
    dates: `${ev.start}/${last.end}`,
    details: wedding.events.map((e) => `${e.title}: ${e.time}`).join('\n'),
    location: `${wedding.venue.name}, ${wedding.venue.city}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

function Unit({ value, label }) {
  const padded = String(value).padStart(2, '0');
  return (
    <motion.div
      variants={popIn}
      className="relative flex w-[4.6rem] flex-col items-center rounded-2xl border border-gold-400/40 bg-linear-to-b from-emerald-800 to-emerald-950 py-4 text-cream shadow-lg shadow-black/30 sm:w-28 sm:py-6"
    >
      <span className="relative h-10 overflow-hidden font-display text-4xl font-semibold lining-nums tabular-nums sm:h-14 sm:text-6xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="block leading-10 sm:leading-[3.5rem]"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gold-200 sm:text-xs">{label}</span>
    </motion.div>
  );
}

export default function Countdown() {
  const left = useCountdown(wedding.date);

  return (
    <section
      id="countdown"
      data-buddy="Ayo itungin harinye bareng-bareng!"
      className="relative bg-burgundy-900 bg-islamic px-5 py-20 text-cream sm:py-28"
    >
      <SectionTitle arabic="إِنْ شَاءَ اللّٰه" eyebrow="Menuju Hari Bahagia" title="Hitung Mundur" light />

      {left.done ? (
        <p className="text-center font-display text-3xl text-gold-200">Alhamdulillah, hari bahagia telah tiba!</p>
      ) : (
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto flex max-w-xl justify-center gap-2.5 sm:gap-5"
        >
          <Unit value={left.days} label="Hari" />
          <Unit value={left.hours} label="Jam" />
          <Unit value={left.minutes} label="Menit" />
          <Unit value={left.seconds} label="Detik" />
        </motion.div>
      )}

      <p className="mt-8 text-center font-display text-xl text-cream">{wedding.dateLabel}</p>
      <div className="mt-6 text-center">
        <a href={calendarUrl()} target="_blank" rel="noreferrer" className="btn-outline text-gold-200">
          <IconCalendar /> Simpan ke Kalender
        </a>
      </div>
    </section>
  );
}
