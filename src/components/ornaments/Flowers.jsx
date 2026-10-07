import { motion } from 'framer-motion';
import Strawberry from './Strawberry';

// Five round white petals and a sunny center — the flower a strawberry grows from.
export function Blossom({ className = '', petal = '#fffaf3', center = '#f6d27c', stroke = '#ffc7d0' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} rx="7.2" ry="8.6" cy="-9" fill={petal} stroke={stroke} strokeWidth="0.9" transform={`rotate(${r})`} />
        ))}
        <circle r="5" fill={center} />
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <circle key={r} r=".9" cy="-2.6" fill="#a8822f" transform={`rotate(${r})`} />
        ))}
      </g>
    </svg>
  );
}

// Notched pink petals, like a blush blossom.
export function PinkBlossom({ className = '', color = '#ff9cac', light = '#ffe3e7' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d="M0 0C-7-4-8-13-3.5-17L0-14l3.5-3C8-13 7-4 0 0Z" fill={color} transform={`rotate(${r})`} />
        ))}
        {[36, 108, 180, 252, 324].map((r) => (
          <path key={r} d="M0 0C-3-3-3-8 0-10 3-8 3-3 0 0Z" fill={light} opacity=".8" transform={`rotate(${r})`} />
        ))}
        <circle r="2.6" fill="#cc2b48" />
      </g>
    </svg>
  );
}

// A single matcha leaf with a midrib.
export function Leaf({ className = '', color = '#6f8f4a', vein = '#cddcb4' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 24" className={className}>
      <path d="M2 12C10 0 28-1 38 10 28 23 10 23 2 12Z" fill={color} />
      <path d="M4 12C14 10 26 10 36 10" stroke={vein} strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const VineLeaf = ({ d, fill }) => <path d={d} fill={fill} />;

// A swaying vine of matcha leaves, blossoms and hanging strawberries for corners. `side` mirrors it.
export function FloralCorner({ className = '', side = 'left' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${side === 'right' ? '-scale-x-100' : ''} ${className}`}>
      <div className="relative h-full w-full origin-top-left animate-sway-slow">
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
          <path d="M0 0C40 30 70 70 90 130C96 150 98 170 96 196" stroke="#57733a" strokeWidth="2.2" fill="none" />
          <path d="M0 0C50 10 100 30 150 70" stroke="#57733a" strokeWidth="1.8" fill="none" />
          <VineLeaf d="M40 32c10-18 32-20 40-14-10 16-26 20-40 14z" fill="#6f8f4a" />
          <VineLeaf d="M70 82c-20-6-30-24-26-34 18 4 28 18 26 34z" fill="#8daa64" />
          <VineLeaf d="M88 120c14-14 34-12 40-4-14 12-28 12-40 4z" fill="#6f8f4a" />
          <VineLeaf d="M110 50c4-18 22-28 32-24-4 18-18 26-32 24z" fill="#8daa64" />
          <VineLeaf d="M92 160c-18-4-26-20-22-30 16 4 24 16 22 30z" fill="#57733a" />
          <path d="M150 70v22M128 112v18" stroke="#57733a" strokeWidth="1.4" />
        </svg>
        <div className="absolute left-[8%] top-[2%] w-[24%]"><Blossom className="h-full w-full" /></div>
        <div className="absolute left-[62%] top-[24%] w-[16%]"><PinkBlossom className="h-full w-full" /></div>
        <div className="absolute left-[34%] top-[50%] w-[20%]"><Blossom className="h-full w-full" /></div>
        <div className="absolute left-[2%] top-[22%] w-[13%]"><PinkBlossom className="h-full w-full" /></div>
        <div className="absolute left-[69%] top-[44%] w-[14%] origin-top animate-sway"><Strawberry className="h-full w-full" /></div>
        <div className="absolute left-[58%] top-[63%] w-[11%] origin-top animate-sway [animation-delay:1.2s]"><Strawberry className="h-full w-full" /></div>
        <div className="absolute left-[38%] top-[86%] w-[12%]"><PinkBlossom className="h-full w-full" /></div>
      </div>
    </div>
  );
}

const BLOOMS = { blossom: Blossom, pink: PinkBlossom, strawberry: Strawberry };

// Something that pops into bloom (spins + scales up) when it scrolls into view.
export function BloomFlower({ className = '', kind = 'blossom', delay = 0 }) {
  const Comp = BLOOMS[kind];
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

// Section divider: line · blossom · strawberry · blossom · line.
export function FloralDivider({ className = '', light = false }) {
  const line = light ? 'bg-berry-200/50' : 'bg-matcha-400/60';
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px w-14 sm:w-24 ${line}`} />
      <BloomFlower className="h-5 w-5" kind="pink" />
      <BloomFlower className="h-8 w-7" kind="strawberry" delay={0.1} />
      <BloomFlower className="h-5 w-5" delay={0.2} />
      <span className={`h-px w-14 sm:w-24 ${line}`} />
    </div>
  );
}
