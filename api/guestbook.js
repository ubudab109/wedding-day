// Vercel Serverless Function — guest book backed by Vercel KV / Upstash Redis (REST).
// Env: KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const LIST_KEY = 'wedding:guestbook';
const MAX_ITEMS = 500;
const RATE_LIMIT = 5; // posts per minute per IP
const ATTENDANCE = new Set(['hadir', 'tidak', 'ragu']);

async function redis(commands) {
  const res = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const out = await res.json();
  const failed = out.find((r) => r.error);
  if (failed) throw new Error(failed.error);
  return out.map((r) => r.result);
}

const clean = (value, max) =>
  String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!URL_ || !TOKEN) {
    return res.status(503).json({ error: 'Guest book storage is not configured' });
  }

  try {
    if (req.method === 'GET') {
      const [rows] = await redis([['LRANGE', LIST_KEY, '0', '199']]);
      const items = rows.map((r) => {
        try {
          return JSON.parse(r);
        } catch {
          return null;
        }
      });
      return res.status(200).json({ items: items.filter(Boolean) });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
      const name = clean(body.name, 60);
      const message = clean(body.message, 500);
      const attendance = ATTENDANCE.has(body.attendance) ? body.attendance : 'ragu';

      if (name.length < 2 || message.length < 2) {
        return res.status(400).json({ error: 'Nama dan ucapan wajib diisi' });
      }

      const ip = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0].trim();
      const rlKey = `wedding:rl:${ip}`;
      const [count] = await redis([['INCR', rlKey], ['EXPIRE', rlKey, '60', 'NX']]);
      if (count > RATE_LIMIT) {
        return res.status(429).json({ error: 'Terlalu banyak ucapan, coba lagi sebentar ya' });
      }

      const item = { id: crypto.randomUUID(), name, message, attendance, createdAt: Date.now() };
      await redis([
        ['LPUSH', LIST_KEY, JSON.stringify(item)],
        ['LTRIM', LIST_KEY, '0', String(MAX_ITEMS - 1)],
      ]);
      return res.status(201).json({ item });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[guestbook]', err);
    return res.status(500).json({ error: 'Terjadi kesalahan, silakan coba lagi' });
  }
}
