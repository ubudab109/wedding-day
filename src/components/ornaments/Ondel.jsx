// Animated Ondel-ondel — the giant Betawi guardian puppets.
// `pria` has the red face, `wanita` the white face; both wear the kembang kelapa crown.

const PALETTE = {
  pria: { face: '#b3261e', faceShade: '#8f1d17', robe: '#064e3b', robeDark: '#043d2e', sash: '#862637', trim: '#c9a24a' },
  wanita: { face: '#fdf3e7', faceShade: '#f1dcc6', robe: '#862637', robeDark: '#6b1d2c', sash: '#047857', trim: '#c9a24a' },
};
const TIP_COLORS = ['#f3e7c4', '#dc2626', '#c9a24a', '#10b981', '#fffdf7', '#f472b6'];

const STEMS = Array.from({ length: 13 }, (_, i) => {
  const angle = -72 + i * 12;
  const len = i % 2 ? 50 : 60;
  const rad = (angle * Math.PI) / 180;
  return { angle, x: 70 + len * Math.sin(rad), y: 80 - len * Math.cos(rad), color: TIP_COLORS[i % TIP_COLORS.length] };
});

// Pucuk rebung (bamboo shoot) triangles across the robe at height y.
function rebungRow(y, height = 12) {
  const off = ((y - 140) * 26) / 160;
  const left = 44 - off + 4;
  const right = 96 + off - 4;
  const count = Math.max(3, Math.floor((right - left) / 10));
  const w = (right - left) / count;
  return Array.from({ length: count }, (_, i) => {
    const x = left + i * w;
    return `M${x} ${y + height}L${x + w / 2} ${y}L${x + w} ${y + height}Z`;
  }).join('');
}

export default function Ondel({ variant = 'pria', className = '', delay = 0, title }) {
  const c = PALETTE[variant];
  const isPria = variant === 'pria';
  const anim = (name, dur, extra = 0) => ({ animation: `${name} ${dur}s ease-in-out ${delay + extra}s infinite` });

  return (
    <div className={`origin-bottom ${className}`} style={anim('ondel', 2.6)} role="img" aria-label={title ?? `Ondel-ondel ${variant}`}>
      <svg viewBox="0 0 140 320" className="h-full w-full overflow-visible" style={anim('bob', 1.3)}>
        {/* Kembang kelapa */}
        {STEMS.map((s, i) => (
          <g key={i} style={{ transformOrigin: '70px 80px', ...anim('sway', 2.2, i * 0.12) }}>
            <path d={`M70 80Q${(70 + s.x) / 2 + s.angle / 10} ${(80 + s.y) / 2} ${s.x} ${s.y}`} stroke="#a8822f" strokeWidth="1.1" fill="none" />
            <circle cx={s.x} cy={s.y} r="4" fill={s.color} stroke="#a8822f" strokeWidth="0.6" />
            <circle cx={s.x} cy={s.y} r="1.4" fill="#fff" opacity="0.8" />
          </g>
        ))}

        {/* Hair */}
        <ellipse cx="70" cy="108" rx="32" ry="35" fill="#1c1917" />
        {!isPria && (
          <>
            <path d="M38 108c-6 22-2 38 6 46l6-10c-6-10-8-22-6-34z" fill="#1c1917" />
            <path d="M102 108c6 22 2 38-6 46l-6-10c6-10 8-22 6-34z" fill="#1c1917" />
          </>
        )}

        {/* Crown band */}
        <path d="M40 86h60l-4 10H44z" fill={c.trim} />
        {[48, 59, 70, 81, 92].map((x) => (
          <path key={x} d={`M${x} 88l3 3-3 3-3-3z`} fill="#862637" />
        ))}
        <path d="M40 86l5-7 5 7 5-7 5 7 5-7 5 7 5-7 5 7 5-7 5 7 5-7 5 7z" fill={c.trim} />

        {/* Face */}
        <ellipse cx="70" cy="114" rx="25" ry="27" fill={c.face} />
        <ellipse cx="70" cy="128" rx="20" ry="11" fill={c.faceShade} opacity="0.5" />

        {isPria ? (
          <>
            <path d="M54 101q7-6 13 0" stroke="#111" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M73 101q7-6 13 0" stroke="#111" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <circle cx="61" cy="110" r="5.5" fill="#fff" />
            <circle cx="79" cy="110" r="5.5" fill="#fff" />
            <circle cx="62" cy="111" r="2.6" fill="#111" />
            <circle cx="80" cy="111" r="2.6" fill="#111" />
            <path d="M67 116q3 5 6 0" stroke={c.faceShade} strokeWidth="2" fill="none" />
            <path d="M54 124q8-6 16 0 8-6 16 0-3 3-8 2-5-1-8-1-3 0-8 1-5 1-8-2z" fill="#111" />
            <path d="M58 129q12 9 24 0z" fill="#fff" stroke="#111" strokeWidth="1" />
            <path d="M62 129v3M66 129v4M70 129v4M74 129v4M78 129v3" stroke="#111" strokeWidth="0.6" />
          </>
        ) : (
          <>
            <path d="M55 103q6-3 12 0" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M73 103q6-3 12 0" stroke="#1c1917" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M55 111q6-5 12 0q-6 4-12 0z" fill="#fff" stroke="#1c1917" strokeWidth="0.8" />
            <path d="M73 111q6-5 12 0q-6 4-12 0z" fill="#fff" stroke="#1c1917" strokeWidth="0.8" />
            <circle cx="61" cy="110.6" r="2" fill="#1c1917" />
            <circle cx="79" cy="110.6" r="2" fill="#1c1917" />
            <path d="M54 107l-2-2M56 106l-1-2.5M86 107l2-2M84 106l1-2.5" stroke="#1c1917" strokeWidth="0.8" />
            <circle cx="56" cy="122" r="4.5" fill="#f472b6" opacity="0.45" />
            <circle cx="84" cy="122" r="4.5" fill="#f472b6" opacity="0.45" />
            <path d="M68 117q2 2 4 0" stroke="#d6a98a" strokeWidth="1.2" fill="none" />
            <path d="M63 127q7 6 14 0q-7 2-14 0z" fill="#be123c" />
            <circle cx="70" cy="96" r="1.6" fill="#be123c" />
          </>
        )}

        {/* Robe */}
        <path d="M44 140h52l26 160H18z" fill={c.robe} />
        <path d={rebungRow(196)} fill={c.trim} opacity="0.9" />
        <path d={rebungRow(250, 14)} fill={c.trim} opacity="0.9" />
        <path d="M30 222h80M24 278h92" stroke={c.trim} strokeWidth="1.4" strokeDasharray="3 3" />

        {/* Selendang (sash) */}
        <path d="M44 146l10-8 60 88-10 10z" fill={c.sash} />
        <path d="M44 146l10-8 60 88-10 10z" fill="none" stroke={c.trim} strokeWidth="1" />

        {/* Kalung (necklace) */}
        <path d="M44 140q26 26 52 0" stroke={c.trim} strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="70" cy="155" r="4" fill="#dc2626" stroke={c.trim} strokeWidth="1.5" />

        {/* Arms */}
        <g style={{ transformOrigin: '46px 146px', ...anim('sway', 1.8) }}>
          <rect x="30" y="142" width="15" height="78" rx="7.5" fill={c.robeDark} transform="rotate(8 46 146)" />
          <circle cx="27" cy="222" r="6.5" fill={c.face} />
        </g>
        <g style={{ transformOrigin: '94px 146px', ...anim('sway', 1.8, 0.9) }}>
          <rect x="95" y="142" width="15" height="78" rx="7.5" fill={c.robeDark} transform="rotate(-8 94 146)" />
          <circle cx="113" cy="222" r="6.5" fill={c.face} />
        </g>

        {/* Rumbai (fringe) */}
        <path
          d={Array.from({ length: 27 }, (_, i) => `M${18 + i * 4} 300v${i % 2 ? 9 : 12}`).join('')}
          stroke={c.trim}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
