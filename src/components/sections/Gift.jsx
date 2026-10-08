import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { useGiftAccounts } from '../../hooks/useGiftAccounts';
import { groupDigits } from '../../lib/format';
import { popIn, slideFrom, viewport } from '../../lib/motion';
import SectionTitle from '../SectionTitle';
import Strawberry from '../ornaments/Strawberry';
import Wave from '../ornaments/Wave';
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

function CopyButton({ text, label, className = 'bg-milk text-matcha-800 hover:bg-white' }) {
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
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 ${className}`}
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
      className="relative flex aspect-[1.586] w-full max-w-sm flex-col justify-between gap-4 rounded-[1.75rem] bg-linear-to-br from-matcha-500 via-matcha-700 to-matcha-900 p-5 text-milk shadow-2xl shadow-berry-900/50 ring-1 ring-white/20 sm:p-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
        <div className="absolute inset-0 bg-islamic opacity-70" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-berry-300/25 blur-2xl" />
        <Strawberry className="absolute -bottom-4 right-24 h-20 w-16 rotate-12 opacity-15" body="#fffaf3" shade="#fffaf3" leaf="#fffaf3" />
      </div>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-3xl font-bold italic tracking-wide text-milk">{gift.bank}</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-matcha-100/70">{gift.bankName}</p>
        </div>
        <div className="h-9 w-12 rounded-md bg-linear-to-br from-seed to-[#c99a3a] shadow-inner" aria-hidden="true">
          <div className="mx-auto mt-2 h-5 w-8 rounded-sm border border-black/15" />
        </div>
      </div>
      <div className="relative">
        <p className="whitespace-nowrap font-mono text-xl tracking-[0.12em] sm:text-2xl">{groupDigits(gift.number)}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="min-w-0 text-sm font-medium uppercase leading-snug tracking-wider text-milk/90">
            a.n. {gift.holder}
          </p>
          <CopyButton text={gift.number} label={`Salin nomor rekening ${gift.holder}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Gift() {
  const accounts = useGiftAccounts();
  return (
    <section
      id="hadiah"
      data-buddy="Amplop digital juga boleh lho, hehe…"
      className="relative overflow-hidden bg-berry-700 bg-islamic px-5 pb-28 pt-16 text-milk sm:pb-36 sm:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,156,172,0.25),transparent_60%)]" />
      <div className="relative">
        <SectionTitle arabic="هَدِيَّة" eyebrow="Tanda Kasih" title="Wedding Gift" light />
        <p className="mx-auto -mt-4 mb-12 max-w-xl text-center text-sm leading-relaxed text-milk/85">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda
          kasih, Anda dapat mengirimkannya melalui rekening atau alamat berikut.
        </p>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 md:flex-row">
          {accounts.map((g, i) => (
            <BankCard key={g.number} gift={g} index={i} />
          ))}
        </div>

        <motion.div
          variants={popIn}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto mt-8 max-w-2xl rounded-[1.75rem] bg-milk p-6 text-center text-matcha-900 shadow-2xl shadow-berry-900/40 sm:p-8"
        >
          <motion.span
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-berry-500 text-milk shadow-lg shadow-berry-700/30"
            animate={{ rotate: [0, -12, 12, -6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
          >
            <IconGift className="h-7 w-7" />
          </motion.span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-matcha-800">Kirim Kado</h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-berry-500">Alamat Pengiriman</p>
          <address className="mx-auto mt-4 max-w-md text-sm not-italic leading-relaxed text-matcha-900/80">
            {wedding.giftAddress}
          </address>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <CopyButton
              text={wedding.giftAddress}
              label="Salin alamat pengiriman kado"
              className="bg-berry-500 text-milk hover:bg-berry-400"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.giftAddress)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-matcha-300 px-3 py-1.5 text-xs font-semibold text-matcha-700 transition hover:bg-matcha-50"
            >
              <IconPin className="h-3.5 w-3.5" /> Lihat di Maps
            </a>
          </div>
        </motion.div>
      </div>

      <Wave className="text-milk" />
    </section>
  );
}
