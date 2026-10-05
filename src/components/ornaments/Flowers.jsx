import { motion } from 'framer-motion';

// Five-petal melati (jasmine) — the flower of a Betawi bride's roncean.
export function Melati({ className = '', petal = '#fffdf7', center = '#c9a24a', stroke = '#ead7a1' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="6" ry="11" cy="-9" fill={petal} stroke={stroke} strokeWidth="0.8" transform={`rotate(${r})`} />
        ))}
        <circle r="4.2" fill={center} />
        <circle r="1.6" fill="#fff8e1" />
      </g>
    </svg>
  );
}

// Layered rose-like bloom in burgundy.
export function Rose({ className = '', color = '#862637', light = '#b95564' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <g transform="translate(20 20)">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} d="M0 0C-8 -6 -8 -16 0 -17C8 -16 8 -6 0 0Z" fill={color} transform={`rotate(${r})`} />
        ))}
        {[30, 150, 270].map((r) => (
          <path key={r} d="M0 0C-5 -4 -5 -10 0 -11C5 -10 5 -4 0 0Z" fill={light} transform={`rotate(${r})`} />
        ))}
        <circle r="3.4" fill="#5c1825" />
        <path d="M-2 -1a2.4 2.4 0 1 1 4 1" stroke="#e9b7bd" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}

const Leaf = ({ d, fill = '#0f766e' }) => <path d={d} fill={fill} />;

// A swaying floral branch for corners. `side` mirrors it.
export function FloralCorner({ className = '', side = 'left' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${side === 'right' ? '-scale-x-100' : ''} ${className}`}
    >
      <div className="relative h-full w-full origin-top-left animate-sway-slow">
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
          <path d="M0 0C40 30 70 70 90 130C96 150 98 170 96 196" stroke="#a8822f" strokeWidth="2" fill="none" />
          <path d="M0 0C50 10 100 30 150 70" stroke="#a8822f" strokeWidth="1.6" fill="none" />
          <Leaf d="M40 32c10-18 32-20 40-14-10 16-26 20-40 14z" fill="#065f46" />
          <Leaf d="M70 82c-20-6-30-24-26-34 18 4 28 18 26 34z" fill="#047857" />
          <Leaf d="M88 120c14-14 34-12 40-4-14 12-28 12-40 4z" fill="#065f46" />
          <Leaf d="M110 50c4-18 22-28 32-24-4 18-18 26-32 24z" fill="#047857" />
          <Leaf d="M92 160c-18-4-26-20-22-30 16 4 24 16 22 30z" fill="#065f46" />
        </svg>
        <div className="absolute left-[10%] top-[2%] w-[24%]"><Rose className="h-full w-full" /></div>
        <div className="absolute left-[64%] top-[26%] w-[18%]"><Melati className="h-full w-full" /></div>
        <div className="absolute left-[36%] top-[52%] w-[20%]"><Rose className="h-full w-full" color="#9c3445" /></div>
        <div className="absolute left-[2%] top-[22%] w-[14%]"><Melati className="h-full w-full" /></div>
        <div className="absolute left-[38%] top-[86%] w-[13%]"><Melati className="h-full w-full" /></div>
      </div>
    </div>
  );
}

// A flower that blooms (spins + scales up) when it scrolls into view.
export function BloomFlower({ className = '', kind = 'melati', delay = 0 }) {
  const Comp = kind === 'rose' ? Rose : Melati;
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={{ scale: 0, rotate: -120, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ type: 'spring', stiffness: 140, damping: 11, delay }}
    >
      <Comp className="h-full w-full" />
    </motion.div>
  );
}

// Section divider: line · flowers · line.
export function FloralDivider({ className = '', light = false }) {
  const line = light ? 'bg-gold-300/60' : 'bg-gold-500/60';
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px w-16 sm:w-24 ${line}`} />
      <BloomFlower className="h-5 w-5" />
      <BloomFlower className="h-8 w-8" kind="rose" delay={0.1} />
      <BloomFlower className="h-5 w-5" delay={0.2} />
      <span className={`h-px w-16 sm:w-24 ${line}`} />
    </div>
  );
}
