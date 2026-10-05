# The Wedding of Rizky & Lanina

Betawi × Islamic wedding invitation built with **React 18 + Vite + Tailwind CSS v4 + Framer Motion**, ready for **Vercel**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173/?to=Budi+Dan+Ani
npm run build      # production build in dist/
```

## Personalised links

The guest's name comes from the `to` query parameter. Use `+` (or `%20`) for spaces:

```
https://your-domain.vercel.app/?to=Bapak+Budi+Dan+Keluarga
```

## Editing content

Everything (names, parents, date, event times, venue, Qur'an verse, story, bank accounts, gift address, music path) lives in
[`src/config/wedding.js`](src/config/wedding.js).

> ⚠️ The **Akad (08.00–10.00 WIB)** and **Resepsi (11.00–14.00 WIB)** times are placeholders. Update `events`
> (both the display `time` and the UTC `start`/`end` used for "Simpan ke Kalender").

## Music

The background song is `public/music/song.mp3`. It starts when the guest taps **Buka Undangan**, streams instead of
preloading, pauses while the tab is hidden, and is toggled by the spinning disc. If the file is missing, a soft
generated music-box melody plays instead.

## Photos

| Photo | Source |
| --- | --- |
| Opening photo (cover) | `public/images/couple_opening.jpeg` |
| Groom / bride portraits | `public/images/rizky.jpeg`, `public/images/indah.jpeg` |
| Gallery | every `.jpeg` in `public/galleries/` (sorted 1, 2, … 10) |

Just drop photos in those folders. `plugins/photos.js` auto-rotates them (EXIF), creates 640px/1280px WebP versions
plus blur placeholders in `public/optimized/` (git-ignored, regenerated on each build), and removes the multi-MB
originals from the deployed `dist/`. During `npm run dev`, adding or removing a gallery photo reloads the page.

## Guest book (Doa & Ucapan)

- **With storage:** in Vercel go to *Storage → Marketplace → Upstash (Redis)* and connect it to the project. This injects
  `KV_REST_API_URL` / `KV_REST_API_TOKEN` (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work). Then
  `api/guestbook.js` stores wishes for every guest, with input validation and a 5 posts/min per-IP rate limit.
- **Without storage** (or in `npm run dev`): wishes are saved in the visitor's `localStorage` only.

## Deploy to Vercel

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

Or push to GitHub and import the repo at vercel.com/new. The framework preset is auto-detected as Vite.

## What's inside

| Feature | Where |
| --- | --- |
| Cover: opening photo → fades behind names + button → doors split the photo open | `components/sections/Cover.jsx` |
| Hero, Bismillah, QS. Ar-Rum 21 | `components/sections/Hero.jsx` |
| Live countdown + Google Calendar link | `components/sections/Countdown.jsx` |
| About us with arched portrait reveal | `components/sections/AboutUs.jsx` |
| Our Galleries: masonry reveal + swipeable lightbox | `components/sections/Gallery.jsx` |
| Love-story timeline (fills as you scroll) | `components/sections/LoveStory.jsx` |
| Schedule + Google Maps (Taman Tapawira) | `components/sections/Schedule.jsx` |
| Wedding gift: BCA cards + gift address, with copy buttons | `components/sections/Gift.jsx` |
| Guest book + RSVP | `components/sections/GuestBook.jsx`, `api/guestbook.js` |
| Animated Ondel-ondel (SVG) | `components/ornaments/Ondel.jsx` |
| Scroll buddy: Ondel that wobbles with scroll speed and talks Betawi | `components/ScrollBuddy.jsx` |
| Gigi balang border, 8-point star, melati & rose flowers | `components/ornaments/*` |
| Falling petals, cursor sparkle trail | `FallingPetals.jsx`, `CursorTrail.jsx` |
| Music disc + back-to-top (hide on scroll down, show on scroll up) | `FloatingControls.jsx` |

All decorative motion respects `prefers-reduced-motion`.
