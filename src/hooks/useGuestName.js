import { useMemo } from 'react';

const MAX_LEN = 80;

// Reads `?to=Budi+Dan+Ani` (URLSearchParams already turns `+` into spaces).
export function useGuestName(fallback = 'Tamu Undangan') {
  return useMemo(() => {
    if (typeof window === 'undefined') return fallback;
    const raw = new URLSearchParams(window.location.search).get('to');
    if (!raw) return fallback;
    const clean = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_LEN);
    return clean || fallback;
  }, [fallback]);
}
