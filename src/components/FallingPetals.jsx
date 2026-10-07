import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Strawberry-milk petals, matcha leaves and the odd tiny strawberry drifting down the page.
const SHAPES = [
  { kind: 'petal', fill: '#ff9cac' },
  { kind: 'leaf', fill: '#8daa64' },
  { kind: 'petal', fill: '#fffaf3' },
  { kind: 'petal', fill: '#ffc7d0' },
  { kind: 'leaf', fill: '#aec58a' },
  { kind: 'petal', fill: '#f76d83' },
  { kind: 'berry', fill: '#e8455f' },
];

function Shape({ kind, fill }) {
  if (kind === 'leaf') {
    return (
      <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow-sm">
        <path d="M2 18C2 8 8 2 18 2 18 12 12 18 2 18Z" fill={fill} opacity="0.85" />
        <path d="M3 17 16 4" stroke="#fff" strokeOpacity="0.35" />
      </svg>
    );
  }
  if (kind === 'berry') {
    return (
      <svg viewBox="0 0 20 22" className="h-full w-full drop-shadow-sm">
        <path d="M10 21C4 18 1 12 2 8c1-3 4-3 8-3s7 0 8 3c1 4-2 10-8 13Z" fill={fill} />
        <path d="M10 6C8 6 5 6 3 5l4-1-1-3 4 2 4-2-1 3 4 1c-2 1-5 1-7 1Z" fill="#6f8f4a" />
        <circle cx="7" cy="10" r=".7" fill="#f6d27c" />
        <circle cx="13" cy="10" r=".7" fill="#f6d27c" />
        <circle cx="10" cy="14" r=".7" fill="#f6d27c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow-sm">
      <path d="M10 1C15 5 17 11 10 19C3 11 5 5 10 1Z" fill={fill} opacity="0.85" />
      <path d="M10 3v14" stroke="#000" strokeOpacity="0.06" />
    </svg>
  );
}

// Pure CSS animation — cheap on mobile.
export default function FallingPetals({ count = 16 }) {
  const reduced = useReducedMotion();
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 12,
        duration: 11 + Math.random() * 10,
        delay: -Math.random() * 20,
        drift: `${-60 + Math.random() * 120}px`,
        spin: `${(Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 360)}deg`,
        shape: SHAPES[i % SHAPES.length],
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            '--drift': p.drift,
            '--spin': p.spin,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite, petal-sway ${p.duration / 4}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <Shape {...p.shape} />
        </span>
      ))}
    </div>
  );
}
