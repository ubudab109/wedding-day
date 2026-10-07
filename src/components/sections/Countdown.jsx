import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { popIn, stagger, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import Wave from '../ornaments/Wave';
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

// Strawberry and matcha tiles take turns, each wearing a little leaf cap.
const TONES = [
  'from-berry-400 to-berry-600 shadow-berry-700/30',
  'from-matcha-500 to-matcha-700 shadow-matcha-900/30',
];

function Unit({ value, label, index }) {
  const padded = String(value).padStart(2, '0');
  return (
    <motion.div
      variants={popIn}
      whileHover={{ y: -6, rotate: index % 2 ? 3 : -3 }}
      className={`relative flex w-[4.6rem] flex-col items-center rounded-[1.6rem] bg-linear-to-b py-4 text-milk shadow-xl sm:w-28 sm:py-6 ${TONES[index % 2]}`}
    >
      <svg aria-hidden="true" viewBox="0 0 40 14" className="absolute -top-3 left-1/2 h-5 w-10 -translate-x-1/2">
        <path
          d="M20 12c-5 0-12 0-16-3 5-1 8-2 10-3-2-2-2-4-1-6 2 2 5 4 7 5 2-1 5-3 7-5 1 2 1 4-1 6 2 1 5 2 10 3-4 3-11 3-16 3Z"
          fill={index % 2 ? '#e8455f' : '#6f8f4a'}
        />
      </svg>
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
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-milk/85 sm:text-xs">{label}</span>
    </motion.div>
  );
}

export default function Countdown() {
  const left = useCountdown(wedding.date);

  return (
    <section
      id="countdown"
      data-buddy="Yuk hitung hari bareng-bareng!"
      className="relative overflow-hidden bg-berry-50 bg-islamic-berry px-5 pb-28 pt-16 sm:pb-36 sm:pt-24"
    >
      <SectionTitle arabic="إِنْ شَاءَ اللّٰه" eyebrow="Menuju Hari Bahagia" title="Hitung Mundur" />

      {left.done ? (
        <p className="text-center font-display text-3xl text-berry-600">Alhamdulillah, hari bahagia telah tiba!</p>
      ) : (
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto flex max-w-xl justify-center gap-2.5 pt-3 sm:gap-5"
        >
          <Unit value={left.days} label="Hari" index={0} />
          <Unit value={left.hours} label="Jam" index={1} />
          <Unit value={left.minutes} label="Menit" index={2} />
          <Unit value={left.seconds} label="Detik" index={3} />
        </motion.div>
      )}

      <p className="mt-10 text-center font-display text-xl text-matcha-800">{wedding.dateLabel}</p>
      <div className="mt-5 text-center">
        <a href={calendarUrl()} target="_blank" rel="noreferrer" className="btn-outline text-berry-600">
          <IconCalendar /> Simpan ke Kalender
        </a>
      </div>

      <Wave className="text-milk" />
    </section>
  );
}
