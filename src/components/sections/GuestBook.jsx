import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchWishes, postWish } from '../../lib/guestbook';
import { initials, timeAgo } from '../../lib/format';
import { fadeUp, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import { IconSend } from '../Icons';

const ATTENDANCE = [
  { value: 'hadir', label: 'Hadir', emoji: '🥳' },
  { value: 'ragu', label: 'Masih Ragu', emoji: '🤔' },
  { value: 'tidak', label: 'Berhalangan', emoji: '🙏' },
];
const BADGE = {
  hadir: 'bg-emerald-100 text-emerald-800',
  ragu: 'bg-gold-200 text-gold-700',
  tidak: 'bg-burgundy-100 text-burgundy-700',
};
const PAGE = 6;

export default function GuestBook({ guest }) {
  const defaultName = guest === 'Tamu Undangan' ? '' : guest;
  const [form, setForm] = useState({ name: defaultName, message: '', attendance: 'hadir' });
  const [wishes, setWishes] = useState([]);
  const [remote, setRemote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: 'idle', text: '' });
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    let alive = true;
    fetchWishes().then(({ items, remote: r }) => {
      if (!alive) return;
      setWishes(items);
      setRemote(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(
    () => ATTENDANCE.map((a) => ({ ...a, count: wishes.filter((w) => w.attendance === a.value).length })),
    [wishes],
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const message = form.message.trim();
    if (name.length < 2 || message.length < 2) {
      setStatus({ type: 'error', text: 'Mohon isi nama dan ucapan terlebih dahulu.' });
      return;
    }
    setStatus({ type: 'loading', text: '' });
    try {
      const item = await postWish({ name, message, attendance: form.attendance }, remote);
      setWishes((w) => [item, ...w]);
      setForm((f) => ({ ...f, message: '' }));
      setStatus({ type: 'success', text: 'Terima kasih atas doa & ucapannya! 🤲' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Gagal mengirim, silakan coba lagi.' });
    }
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <section
      id="ucapan"
      data-buddy="Tulis doa yang paling bagus ye, aye bacain nanti!"
      className="relative overflow-hidden bg-cream bg-islamic-dark px-5 py-20 sm:py-28"
    >
      <SectionTitle arabic="دُعَاء" eyebrow="Buku Tamu" title="Doa & Ucapan" />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.15fr]">
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          onSubmit={onSubmit}
          className="card-glass h-fit space-y-5 p-6 sm:p-8"
          noValidate
        >
          <div>
            <label htmlFor="gb-name" className="mb-1.5 block text-sm font-medium text-emerald-900">
              Nama
            </label>
            <input
              id="gb-name"
              value={form.name}
              onChange={update('name')}
              maxLength={60}
              required
              autoComplete="name"
              placeholder="Nama Anda"
              className="w-full rounded-xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-4 focus:ring-gold-300/40"
            />
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-emerald-900">Konfirmasi Kehadiran</legend>
            <div className="grid grid-cols-3 gap-2">
              {ATTENDANCE.map((a) => {
                const active = form.attendance === a.value;
                return (
                  <label
                    key={a.value}
                    className={`relative cursor-pointer rounded-xl border px-2 py-3 text-center text-xs font-medium transition ${
                      active
                        ? 'border-burgundy-600 bg-burgundy-700 text-cream shadow-md'
                        : 'border-emerald-900/15 bg-white/70 text-emerald-900 hover:border-gold-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value={a.value}
                      checked={active}
                      onChange={update('attendance')}
                      className="sr-only"
                    />
                    <motion.span
                      className="block text-xl"
                      animate={active ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {a.emoji}
                    </motion.span>
                    {a.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="gb-message" className="mb-1.5 block text-sm font-medium text-emerald-900">
              Doa & Ucapan
            </label>
            <textarea
              id="gb-message"
              value={form.message}
              onChange={update('message')}
              rows={4}
              maxLength={500}
              required
              placeholder="Tuliskan doa terbaik untuk kedua mempelai…"
              className="w-full resize-none rounded-xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-4 focus:ring-gold-300/40"
            />
            <p className="mt-1 text-right text-[11px] text-emerald-900/50">{form.message.length}/500</p>
          </div>

          <button type="submit" disabled={status.type === 'loading'} className="btn-gold w-full disabled:opacity-60">
            <IconSend className="h-4 w-4" />
            {status.type === 'loading' ? 'Mengirim…' : 'Kirim Ucapan'}
          </button>

          <AnimatePresence>
            {status.text && (
              <motion.p
                key={status.text}
                role={status.type === 'error' ? 'alert' : 'status'}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center text-sm ${status.type === 'error' ? 'text-burgundy-600' : 'text-emerald-700'}`}
              >
                {status.text}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.value} className="rounded-2xl bg-emerald-900 px-2 py-3 text-center text-cream">
                <p className="font-display text-2xl font-semibold lining-nums text-gold-300">{s.count}</p>
                <p className="text-[11px] uppercase tracking-wider text-cream/70">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="card-glass max-h-[34rem] overflow-y-auto p-4 sm:p-5">
            {loading ? (
              <p className="py-10 text-center text-sm text-emerald-900/60">Memuat ucapan…</p>
            ) : wishes.length === 0 ? (
              <p className="py-10 text-center font-display text-lg italic text-emerald-900/70">
                Belum ada ucapan. Jadilah yang pertama mendoakan kami 🤍
              </p>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {wishes.slice(0, shown).map((w) => (
                    <motion.li
                      key={w.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      className="flex gap-3 rounded-2xl bg-white/80 p-4 shadow-sm"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-burgundy-600 to-burgundy-800 text-sm font-semibold text-gold-200">
                        {initials(w.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-emerald-900">{w.name}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${BADGE[w.attendance] ?? BADGE.ragu}`}>
                            {ATTENDANCE.find((a) => a.value === w.attendance)?.label ?? 'Masih Ragu'}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-emerald-950/80">
                          {w.message}
                        </p>
                        <p className="mt-1.5 text-[11px] text-emerald-900/50">{timeAgo(w.createdAt)}</p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
            {wishes.length > shown && (
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE)}
                className="btn-outline mx-auto mt-4 flex text-emerald-800"
              >
                Lihat lebih banyak
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
