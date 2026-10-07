// Rub el Hizb (8-point star) frame, used for the monogram and as accents.
// Strokes use `currentColor`, so tint it with a text colour class.
export default function IslamicStar({ className = '', fill = 'none', children }) {
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite]">
        <g fill={fill} stroke="currentColor" strokeWidth="1.2">
          <rect x="18" y="18" width="64" height="64" />
          <rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)" />
        </g>
        <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 3" />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
