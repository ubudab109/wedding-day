import { useMemo } from 'react';
import { wedding } from '../config/wedding';

// Picks the bank accounts for this link. `?from=mertua` (quoted or not, any case)
// swaps in that group's accounts; anything else falls back to the couple's own.
export function useGiftAccounts() {
  return useMemo(() => {
    if (typeof window === 'undefined') return wedding.gifts;
    const raw = new URLSearchParams(window.location.search).get('from') ?? '';
    const key = raw.replace(/["'“”]/g, '').trim().toLowerCase();
    return Object.hasOwn(wedding.giftsByFrom, key) ? wedding.giftsByFrom[key] : wedding.gifts;
  }, []);
}
