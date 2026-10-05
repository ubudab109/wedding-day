// Guest book client: uses the Vercel serverless API when storage is configured,
// and falls back to localStorage (per device) otherwise — e.g. in local dev.

const LOCAL_KEY = 'wedding-guestbook';

const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) ?? [];
  } catch {
    return [];
  }
};

const writeLocal = (items) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items.slice(0, 200)));
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

export async function fetchWishes() {
  try {
    const { items } = await api('GET');
    return { items, remote: true };
  } catch {
    return { items: readLocal(), remote: false };
  }
}

export async function postWish(wish, remote) {
  if (remote) {
    try {
      const { item } = await api('POST', wish);
      return item;
    } catch (err) {
      if (err.status === 400 || err.status === 429) throw err;
    }
  }
  const item = { ...wish, id: crypto.randomUUID?.() ?? String(Date.now()), createdAt: Date.now() };
  writeLocal([item, ...readLocal()]);
  return item;
}
