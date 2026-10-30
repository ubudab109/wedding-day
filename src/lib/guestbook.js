// Guest book client — every wish is stored in the Amplify Data backend (amplify/data/resource.ts),
// so all guests on all devices see the same list. Nothing is ever kept only on the guest's device.
//
// amplify_outputs.json is written by the Amplify build (`ampx pipeline-deploy`) or locally by
// `npx ampx sandbox`. Without it the guest book reports itself unavailable instead of pretending.

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

const outputs = Object.values(import.meta.glob('../../amplify_outputs.json', { eager: true, import: 'default' }))[0];
let client = null;
if (outputs) {
  Amplify.configure(outputs);
  client = generateClient();
}

// An older version of the site saved wishes here when it had no server; they get uploaded once.
const LEGACY_KEY = 'wedding-guestbook';
const ATTENDANCE = new Set(['hadir', 'ragu', 'tidak']);
const UNAVAILABLE = 'Maaf, ucapan belum terkirim karena gangguan server. Silakan coba lagi sebentar lagi.';

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const toWish = (w) => ({
  id: w.id,
  name: w.name,
  message: w.message,
  attendance: w.attendance ?? 'ragu',
  createdAt: Date.parse(w.sentAt ?? w.createdAt),
});

function assertOk({ data, errors }) {
  if (errors?.length) throw new Error(errors[0].message);
  return data;
}

async function create({ name, message, attendance, createdAt }) {
  const data = assertOk(
    await client.models.Wish.create({
      name,
      message,
      attendance: ATTENDANCE.has(attendance) ? attendance : 'ragu',
      sentAt: createdAt ? new Date(createdAt).toISOString() : undefined,
    }),
  );
  if (!data) throw new Error('Wish was not saved');
  return toWish(data);
}

async function listAll() {
  const items = [];
  let nextToken;
  do {
    const page = await client.models.Wish.list({ limit: 1000, nextToken });
    items.push(...assertOk(page));
    nextToken = page.nextToken;
  } while (nextToken);
  return items.map(toWish).sort((a, b) => b.createdAt - a.createdAt);
}

const readLegacy = () => {
  try {
    return JSON.parse(localStorage.getItem(LEGACY_KEY)) ?? [];
  } catch {
    return [];
  }
};

const writeLegacy = (items) => {
  try {
    if (items.length) localStorage.setItem(LEGACY_KEY, JSON.stringify(items));
    else localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* storage blocked — nothing to recover then */
  }
};

// Uploads wishes stranded on this device by the old site, keeping their original time.
// Uploaded (or unusable) ones are removed; anything that fails is kept for the next visit.
async function syncLegacy() {
  const pending = readLegacy();
  if (!pending.length) return;
  const left = [];
  for (const w of pending) {
    const name = clean(w.name, 60);
    const message = clean(w.message, 500);
    if (name.length < 2 || message.length < 2) continue;
    try {
      await create({ name, message, attendance: w.attendance, createdAt: w.createdAt });
    } catch {
      left.push(w);
    }
  }
  writeLegacy(left);
}

export async function fetchWishes() {
  if (!client) return { items: [], failed: true };
  try {
    await syncLegacy().catch(() => {});
    return { items: await listAll(), failed: false };
  } catch (err) {
    console.error('[guestbook]', err);
    return { items: [], failed: true };
  }
}

export async function postWish(wish) {
  const name = clean(wish.name, 60);
  const message = clean(wish.message, 500);
  if (name.length < 2 || message.length < 2) throw new Error('Mohon isi nama dan ucapan terlebih dahulu.');
  if (!client) throw new Error(UNAVAILABLE);
  try {
    return await create({ name, message, attendance: wish.attendance });
  } catch (err) {
    console.error('[guestbook]', err);
    throw new Error(UNAVAILABLE);
  }
}
