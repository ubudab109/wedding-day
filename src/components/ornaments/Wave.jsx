// Four 720-wide periods of a gentle wave across 2880, so sliding it by half loops seamlessly.
const PATH = `M0 30${[0, 720, 1440, 2160]
  .map((o) => `C${o + 120} 0 ${o + 240} 0 ${o + 360} 30C${o + 480} 60 ${o + 600} 60 ${o + 720} 30`)
  .join('')}V60H0Z`;

// A drifting "latte layer" edge between sections. Place it at the bottom of a section and
// colour it (via `className` text colour) as the section that comes next.
export default function Wave({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 overflow-hidden sm:h-12 ${className}`}>
      <svg
        viewBox="0 0 2880 60"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-full w-[200%] opacity-50"
        style={{ animation: 'wave-drift 18s linear infinite reverse' }}
      >
        <path d={PATH} fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 2880 60"
        preserveAspectRatio="none"
        className="absolute -bottom-px left-0 h-[85%] w-[200%]"
        style={{ animation: 'wave-drift 12s linear infinite' }}
      >
        <path d={PATH} fill="currentColor" />
      </svg>
    </div>
  );
}
