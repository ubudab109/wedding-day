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
const isJpeg = (f) => /\.jpe?g$/i.test(f);
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

async function buildManifest(publicDir) {
  const manifest = {};
  for (const folder of SOURCES) {
    let files = [];
    try {
      files = (await fs.readdir(path.join(publicDir, folder))).filter(isJpeg).sort(naturalSort);
    } catch {
      /* folder missing — empty list */
    }
    manifest[folder] = await Promise.all(files.map((f) => processPhoto(publicDir, folder, f)));
  }
  return {
    images: Object.fromEntries(manifest.images.map((p) => [p.name, p])),
    gallery: manifest.galleries,
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
      return `export const images = ${JSON.stringify(manifest.images)};\nexport const gallery = ${JSON.stringify(manifest.gallery)};`;
    },
    configureServer(server) {
      // Re-scan when photos are added/removed during `npm run dev`.
      const watched = SOURCES.map((f) => path.join(publicDir, f));
      const refresh = async (file) => {
        if (!isJpeg(file) || !watched.some((dir) => file.startsWith(dir))) return;
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
        await Promise.all(files.filter(isJpeg).map((f) => fs.unlink(path.join(dir, f))));
        await fs.rmdir(dir).catch(() => {});
      }
    },
  };
}
