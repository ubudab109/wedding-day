import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const COLORS = ['#862637', '#b95564', '#fffdf7', '#e9b7bd', '#dcbf73'];

// Petals drifting down the whole page. Pure CSS animation — cheap on mobile.
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
        color: COLORS[i % COLORS.length],
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
          <svg viewBox="0 0 20 20" className="h-full w-full drop-shadow-sm">
            <path d="M10 1C15 5 17 11 10 19C3 11 5 5 10 1Z" fill={p.color} opacity="0.85" />
            <path d="M10 3v14" stroke="#000" strokeOpacity="0.08" />
          </svg>
        </span>
      ))}
    </div>
  );
}
