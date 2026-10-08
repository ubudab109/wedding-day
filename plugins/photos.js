// Vite plugin: turns the large camera JPEGs in public/images and public/galleries into
// web-sized WebP variants (+ tiny blur placeholders) and exposes them as `virtual:photos`.
// Originals stay as the source of truth; they are stripped from the production bundle.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTHS = [640, 1280];
const SOURCES = ['images', 'galleries'];
const OUT_DIR = 'optimized';
const VIRTUAL_ID = 'virtual:photos';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const STICKER_WIDTHS = [480, 960];
const isJpeg = (f) => /\.jpe?g$/i.test(f);
// PNGs in public/images are die-cut stickers on a white canvas (e.g. child.png).
const isSticker = (folder, f) => folder === 'images' && /\.png$/i.test(f);
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true });

async function isFresh(src, out) {
  try {
    const [s, o] = await Promise.all([fs.stat(src), fs.stat(out)]);
    return o.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

async function processPhoto(publicDir, folder, file) {
  const src = path.join(publicDir, folder, file);
  const name = path.parse(file).name;
  const outDir = path.join(publicDir, OUT_DIR, folder);
  await fs.mkdir(outDir, { recursive: true });

  // `.rotate()` applies the EXIF orientation (these shots are stored sideways).
  const meta = await sharp(src).rotate().metadata();
  const portrait = meta.orientation >= 5;
  const width = portrait ? meta.height : meta.width;
  const height = portrait ? meta.width : meta.height;

  const variants = [];
  for (const w of WIDTHS) {
    const out = path.join(outDir, `${name}-${w}.webp`);
    if (!(await isFresh(src, out))) {
      await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    }
    variants.push({ w, url: `/${OUT_DIR}/${folder}/${name}-${w}.webp` });
  }

  const placeholder = await sharp(src).rotate().resize({ width: 16 }).blur(1).jpeg({ quality: 50 }).toBuffer();

  return {
    name,
    src: variants.at(-1).url,
    srcSet: variants.map((v) => `${v.url} ${v.w}w`).join(', '),
    width,
    height,
    placeholder: `data:image/jpeg;base64,${placeholder.toString('base64')}`,
  };
}

// Cuts a die-cut sticker out of its flat white canvas: flood-fills the white from the edges
// (the sticker's outline stops the fill, so white clothing inside is kept), feathers the
// fringe, then trims to the sticker.
async function cutoutSticker(src) {
  const { data, info } = await sharp(src).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const rgba = Buffer.alloc(w * h * 4);
  const minAt = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
    minAt[i] = Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]);
  }

  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (i) => {
    if (!bg[i] && minAt[i] > 232) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x += 1) push(x), push((h - 1) * w + x);
  for (let y = 0; y < h; y += 1) push(y * w), push(y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }

  for (let i = 0; i < w * h; i += 1) {
    if (bg[i]) {
      rgba[i * 4 + 3] = 0;
      continue;
    }
    const x = i % w;
    const touchesBg = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || bg[i - w] || bg[i + w];
    // Pale anti-aliased pixels along the edge fade out instead of leaving a white halo.
    if (touchesBg && minAt[i] > 150) rgba[i * 4 + 3] = Math.round((255 * (255 - minAt[i])) / 105);
  }

  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).trim().png().toBuffer({ resolveWithObject: true });
}

async function processSticker(publicDir, folder, file) {
  const src = path.join(publicDir, folder, file);
  const name = path.parse(file).name;
  const outDir = path.join(publicDir, OUT_DIR, folder);
  await fs.mkdir(outDir, { recursive: true });

  const { data, info } = await cutoutSticker(src);
  const variants = [];
  for (const w of STICKER_WIDTHS) {
    const out = path.join(outDir, `${name}-${w}.webp`);
    if (!(await isFresh(src, out))) {
      await sharp(data).resize({ width: w, withoutEnlargement: true }).webp({ quality: 85, alphaQuality: 90 }).toFile(out);
    }
    variants.push({ w, url: `/${OUT_DIR}/${folder}/${name}-${w}.webp` });
  }

  return {
    name,
    src: variants.at(-1).url,
    srcSet: variants.map((v) => `${v.url} ${v.w}w`).join(', '),
    width: info.width,
    height: info.height,
  };
}

async function buildManifest(publicDir) {
  const manifest = {};
  const stickers = [];
  for (const folder of SOURCES) {
    let files = [];
    try {
      files = (await fs.readdir(path.join(publicDir, folder))).sort(naturalSort);
    } catch {
      /* folder missing — empty list */
    }
    manifest[folder] = await Promise.all(files.filter(isJpeg).map((f) => processPhoto(publicDir, folder, f)));
    stickers.push(...(await Promise.all(files.filter((f) => isSticker(folder, f)).map((f) => processSticker(publicDir, folder, f)))));
  }
  return {
    images: Object.fromEntries(manifest.images.map((p) => [p.name, p])),
    gallery: manifest.galleries,
    stickers: Object.fromEntries(stickers.map((s) => [s.name, s])),
  };
}

export default function photos() {
  let publicDir;
  let outDir;
  let manifest;
  let isBuild = false;

  return {
    name: 'wedding-photos',
    configResolved(config) {
      publicDir = config.publicDir;
      outDir = path.resolve(config.root, config.build.outDir);
      isBuild = config.command === 'build';
    },
    async buildStart() {
      manifest = await buildManifest(publicDir);
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return [
        `export const images = ${JSON.stringify(manifest.images)};`,
        `export const gallery = ${JSON.stringify(manifest.gallery)};`,
        `export const stickers = ${JSON.stringify(manifest.stickers)};`,
      ].join('\n');
    },
    configureServer(server) {
      // Re-scan when photos are added/removed during `npm run dev`.
      const watched = SOURCES.map((f) => path.join(publicDir, f));
      const refresh = async (file) => {
        if (!/\.(jpe?g|png)$/i.test(file) || !watched.some((dir) => file.startsWith(dir))) return;
        manifest = await buildManifest(publicDir);
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      server.watcher.on('change', refresh);
    },
    async closeBundle() {
      if (!isBuild) return;
      // Keep the deploy lean: drop the multi‑MB originals copied from public/.
      for (const folder of SOURCES) {
        const dir = path.join(outDir, folder);
        const files = await fs.readdir(dir).catch(() => []);
        const originals = files.filter((f) => isJpeg(f) || isSticker(folder, f));
        await Promise.all(originals.map((f) => fs.unlink(path.join(dir, f))));
        await fs.rmdir(dir).catch(() => {});
      }
    },
  };
}
