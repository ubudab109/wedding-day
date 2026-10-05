import { useEffect, useState } from 'react';

function diff(target) {
  const ms = Math.max(0, target - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function useCountdown(iso) {
  const target = new Date(iso).getTime();
  const [left, setLeft] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return left;
}
