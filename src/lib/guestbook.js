// Guest book client: talks to the Vercel serverless API (/api/guestbook).
//
// In local dev (no API), wishes fall back to localStorage. In production a failed
// save is reported to the guest instead of being silently kept on their device —
// and any wishes an older version of the site did keep locally are uploaded the
// next time that guest opens the invitation (see `syncPending`).

const LOCAL_KEY = 'wedding-guestbook';
const DEV = Boolean(import.meta.env?.DEV);

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? [];
  } catch {
    return [];
  }
};

const writeLocal = (items) => {
  try {
    if (items.length) localStorage.setItem(LOCAL_KEY, JSON.stringify(items.slice(0, 200)));
    else localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* storage full or blocked — ignore */
  }
};

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function api(method, body) {
  const res = await fetch('/api/guestbook', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok || !data) throw new ApiError(res.status, data?.error ?? 'Guest book unavailable');
  return data;
}

// Uploads wishes that were only ever saved on this device. Each one that the server
// accepts (or rejects as invalid) is removed locally; anything else is kept for next time.
async function syncPending() {
  const pending = readLocal();
  if (!pending.length) return [];
  const uploaded = [];
  const left = [];
  for (let i = 0; i < pending.length; i += 1) {
    const w = pending[i];
    try {
      const { item } = await api('POST', {
        name: w.name,
        message: w.message,
        attendance: w.attendance,
        createdAt: w.createdAt,
      });
      uploaded.push(item);
    } catch (err) {
      if (err.status === 400) continue; // invalid — drop it rather than retry forever
      left.push(...pending.slice(i)); // rate-limited or offline — retry on the next visit
      break;
    }
  }
  writeLocal(left);
  return uploaded;
}

// `remote` is false only in local dev without the API. `failed` means the server
// could not be reached in production: the list is empty and posting should be retried.
export async function fetchWishes() {
  try {
    await syncPending().catch(() => {});
    const { items } = await api('GET');
    return { items, remote: true, failed: false };
  } catch {
    if (DEV) return { items: readLocal(), remote: false, failed: false };
    return { items: [], remote: true, failed: true };
  }
}

export async function postWish(wish, remote) {
  if (remote || !DEV) {
    try {
      const { item } = await api('POST', wish);
      return item;
    } catch (err) {
      if (err.status === 400 || err.status === 429 || !DEV) {
        throw new Error(
          err.status === 400 || err.status === 429
            ? err.message
            : 'Maaf, ucapan belum terkirim karena gangguan server. Silakan coba lagi sebentar lagi.',
        );
      }
    }
  }
  const item = { ...wish, id: crypto.randomUUID?.() ?? String(Date.now()), createdAt: Date.now() };
  writeLocal([item, ...readLocal()]);
  return item;
}
