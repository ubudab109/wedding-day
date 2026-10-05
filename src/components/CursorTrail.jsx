import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const COLORS = ['#c9a24a', '#f3e7c4', '#dcbf73', '#e9b7bd', '#b95564'];
const MAX_PARTICLES = 140;

// Sparkle + petal trail that follows the pointer (and touch drags) on a single canvas.
export default function CursorTrail() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = [];
    let raf = 0;
    let last = { x: 0, y: 0, t: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStar = (p) => {
      const r = p.size * p.life;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const a = (i * Math.PI) / 4 + p.rot;
        const rad = i % 2 ? r * 0.4 : r;
        ctx.lineTo(p.x + Math.cos(a) * rad, p.y + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawPetal = (p) => {
      const r = p.size * 1.3 * p.life;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.45, r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.vy += 0.04;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.globalAlpha = Math.min(1, p.life * 1.4);
        ctx.fillStyle = p.color;
        if (p.petal) drawPetal(p);
        else drawStar(p);
      }
      ctx.globalAlpha = 1;
      raf = particles.length ? requestAnimationFrame(tick) : 0;
    };

    const spawn = (x, y, n) => {
      for (let i = 0; i < n && particles.length < MAX_PARTICLES; i += 1) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.8) * 1.2,
          size: 3 + Math.random() * 4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.2,
          life: 1,
          decay: 0.018 + Math.random() * 0.02,
          petal: Math.random() < 0.3,
          color: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      if (now - last.t < 16 && dist < 8) return;
      last = { x: e.clientX, y: e.clientY, t: now };
      spawn(e.clientX, e.clientY, e.pointerType === 'touch' ? 1 : 2);
    };
    const onDown = (e) => spawn(e.clientX, e.clientY, 14);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] h-full w-full" />;
}
