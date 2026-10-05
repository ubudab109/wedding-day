import { useId } from 'react';

// "Gigi balang" — the row of triangular teeth that trims the eaves of a Betawi house.
export default function GigiBalang({ className = '', color = '#c9a24a', accent = '#7a1f2b', flip = false }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      className={`block h-6 w-full ${flip ? 'rotate-180' : ''} ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 400 24"
    >
      <defs>
        <pattern id={`gb-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 0h24L12 18z" fill={color} />
          <path d="M5 0h14L12 10z" fill={accent} />
          <circle cx="12" cy="21.5" r="2" fill={color} />
        </pattern>
      </defs>
      <rect width="400" height="3" fill={color} />
      <rect width="400" height="24" fill={`url(#gb-${id})`} />
    </svg>
  );
}
