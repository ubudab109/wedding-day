const SEEDS = [
  [12, 21], [20, 20], [28, 21], [9, 28], [16, 27], [24, 27], [31, 28],
  [13, 34], [20, 34], [27, 34], [17, 40], [23, 40],
];
// Seeds that would sit on the face are left out when the strawberry has one.
const FACE_SEEDS = new Set(['16,27', '24,27', '20,34', '13,34', '27,34']);

// A ripe strawberry. With `face`, it becomes the cute buddy (blinking eyes, blush, smile).
export default function Strawberry({
  className = '',
  face = false,
  body = '#e8455f',
  shade = '#cc2b48',
  leaf = '#6f8f4a',
  title,
}) {
  return (
    <svg viewBox="0 0 40 48" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M20 46C9 40 3 29 4 20 5 13 11 11 20 12c9-1 15 1 16 8 1 9-5 20-16 26Z" fill={body} />
      <path d="M20 46c7-7 12-17 13-26 0-5-2-7-6-8 4 5 3 19-7 34Z" fill={shade} opacity=".55" />
      <ellipse cx="11" cy="18" rx="2.2" ry="4" fill="#fff" opacity=".28" transform="rotate(25 11 18)" />
      {SEEDS.filter(([x, y]) => !(face && FACE_SEEDS.has(`${x},${y}`))).map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx=".9" ry="1.4" fill="#f6d27c" />
      ))}
      {face && (
        <g>
          <g style={{ transformOrigin: '20px 27px', animation: 'blink 4s infinite' }}>
            <circle cx="15" cy="27" r="1.9" fill="#2b1a1a" />
            <circle cx="25" cy="27" r="1.9" fill="#2b1a1a" />
            <circle cx="15.6" cy="26.4" r=".6" fill="#fff" />
            <circle cx="25.6" cy="26.4" r=".6" fill="#fff" />
          </g>
          <ellipse cx="11.5" cy="31" rx="2.4" ry="1.4" fill="#ffc7d0" opacity=".9" />
          <ellipse cx="28.5" cy="31" rx="2.4" ry="1.4" fill="#ffc7d0" opacity=".9" />
          <path d="M17.5 31.2q2.5 2.8 5 0" stroke="#2b1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      )}
      <path
        d="M20 15c-4 0-10 1-13-2 4-1 6-2 8-3-2-2-2-4-1-6 2 2 4 4 6 5 2-1 4-3 6-5 1 2 1 4-1 6 2 1 4 2 8 3-3 3-9 2-13 2Z"
        fill={leaf}
      />
      <path d="M20 9V3" stroke={leaf} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
