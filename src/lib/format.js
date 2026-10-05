const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

export function timeAgo(ts) {
  const sec = Math.round((ts - Date.now()) / 1000);
  const abs = Math.abs(sec);
  if (abs < 60) return 'baru saja';
  if (abs < 3600) return rtf.format(Math.round(sec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), 'hour');
  if (abs < 2_592_000) return rtf.format(Math.round(sec / 86400), 'day');
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

// BCA style: 585 514 1016
export const groupDigits = (num) => num.replace(/^(\d{3})(\d{3})(\d+)$/, '$1 $2 $3');
