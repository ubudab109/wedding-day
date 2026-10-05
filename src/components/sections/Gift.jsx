import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { groupDigits } from '../../lib/format';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import { IconCheck, IconCopy, IconGift, IconPin } from '../Icons';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  }
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 transition hover:bg-gold-400 active:scale-95"
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'ok' : 'copy'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          className="inline-flex items-center gap-1.5"
        >
          {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
          {copied ? 'Tersalin!' : 'Salin'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function BankCard({ gift, index }) {
  return (
    <motion.div
      variants={slideFrom(index % 2 ? 'right' : 'left')}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      whileHover={{ rotateX: 6, rotateY: index % 2 ? -6 : 6, scale: 1.02 }}
      style={{ transformPerspective: 900 }}
      // No overflow-hidden here: with it, aspect-ratio can't grow to fit taller text (iOS Safari
      // renders the mono digits wider / honours text-size settings), which clipped the bottom row.
      className="relative flex aspect-[1.586] w-full max-w-sm flex-col justify-between gap-4 rounded-3xl bg-linear-to-br from-emerald-800 via-emerald-900 to-emerald-950 p-5 text-cream shadow-2xl shadow-emerald-950/40 sm:p-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-islamic opacity-70" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/15 blur-2xl" />
      </div>
      <div className="relative flex items-start justify-between">
          <div>
            <p className="font-display text-3xl font-bold italic tracking-wide text-gold-200">{gift.bank}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cream/60">{gift.bankName}</p>
          </div>
          <div className="h-9 w-12 rounded-md bg-linear-to-br from-gold-300 to-gold-600 shadow-inner" aria-hidden="true">
            <div className="mx-auto mt-2 h-5 w-8 rounded-sm border border-gold-700/40" />
          </div>
      </div>
      <div className="relative">
        <p className="whitespace-nowrap font-mono text-xl tracking-[0.12em] sm:text-2xl">{groupDigits(gift.number)}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="min-w-0 text-sm font-medium uppercase leading-snug tracking-wider text-cream/90">
            a.n. {gift.holder}
          </p>
          <CopyButton text={gift.number} label={`Salin nomor rekening ${gift.holder}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gift() {
  return (
    <section
      id="hadiah"
      data-buddy="Amplop digital juga boleh, aye catet ye! Hehe…"
      className="relative overflow-hidden bg-burgundy-900 bg-islamic px-5 py-20 text-cream sm:py-28"
    >
      <SectionTitle arabic="هَدِيَّة" eyebrow="Tanda Kasih" title="Wedding Gift" light />
      <p className="mx-auto -mt-4 mb-12 flex max-w-xl items-start gap-3 text-center text-sm leading-relaxed text-cream/80">
        <IconGift className="mt-0.5 hidden h-5 w-5 shrink-0 text-gold-300 sm:block" />
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda
        kasih, Anda dapat mengirimkannya melalui rekening atau alamat berikut.
      </p>
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 md:flex-row">
        {wedding.gifts.map((g, i) => (
          <BankCard key={g.number} gift={g} index={i} />
        ))}
      </div>

      <motion.div
        variants={popIn}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto mt-8 max-w-2xl rounded-3xl border border-gold-400/40 bg-burgundy-950/50 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8"
      >
        <motion.span
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-emerald-950 shadow-lg"
          animate={{ rotate: [0, -12, 12, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
        >
          <IconGift className="h-7 w-7" />
        </motion.span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-gold-200">Kirim Kado</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cream/60">Alamat Pengiriman</p>
        <address className="mx-auto mt-4 max-w-md text-sm not-italic leading-relaxed text-cream/90">
          {wedding.giftAddress}
        </address>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <CopyButton text={wedding.giftAddress} label="Salin alamat pengiriman kado" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.giftAddress)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/60 px-3 py-1.5 text-xs font-semibold text-gold-200 transition hover:bg-gold-400/10"
          >
            <IconPin className="h-3.5 w-3.5" /> Lihat di Maps
          </a>
        </div>
      </motion.div>
    </section>
  );
}
