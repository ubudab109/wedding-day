// Shared Framer Motion variants — playful but tasteful.

export const viewport = { once: true, amount: 0.25 };

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// Springy "boing" with a little tilt — the fun one.
export const popIn = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 14 },
  },
};

export const slideFrom = (dir = 'left') => ({
  hidden: { opacity: 0, x: dir === 'left' ? -80 : 80, rotate: dir === 'left' ? -4 : 4 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 120, damping: 16 },
  },
});

export const dropIn = {
  hidden: { opacity: 0, y: -60, rotate: 6 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 12, mass: 0.8 },
  },
};

export const stagger = (gap = 0.12, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
