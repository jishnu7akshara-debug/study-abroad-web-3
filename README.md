# Study Abroad Web 1 — Northline Overseas (demo)

Landing page for the **Study Abroad & Visa/Immigration Consultancies** sector.
Plain HTML/CSS/JS, no build step. Double-click `index.html` to open it, or serve the folder (e.g. `npx serve .`).

## Structure
- `index.html` — all sections (hero + departures board, destinations, process, video + intake calendar, visa desk tabs, stories, fees FAQ, booking form, footer)
- `css/styles.css` — design tokens at the top (`:root`)
- `js/main.js` — split-flap board, video pause/visibility, tabs, story switcher, form validation

## Design system
- Colours: paper `#F3F6F7`, passport navy `#12223F`, departure-board yellow `#F4C430`, approval green `#1E7A57`, board `#0F1C33`
- Type: Archivo (variable width, used expanded for headlines, condensed on the board) + Public Sans for body
- Radii by hierarchy: photos 28px, panels 22px, inputs 14px, buttons pill, board tiles 4px
- Motion: one load moment (split-flap board), everything else only responds to clicks/hover; respects reduced motion

## Before selling / going live — replace these placeholders
- Brand name "Northline Overseas", logo, phone, office addresses
- Stats in the hero (2,400+ students, 97% visa approval), "students in 2025", "99% approved" on the UK tab
- Student testimonials (sample text — use real, consented testimonials)
- Visa-only fee (₹18,000) and the commission disclosure in the FAQ
- Visa checklists are general; re-check against official government pages before launch
- Booking form only logs to the console — connect it to the client's CRM / form endpoint in `js/main.js`

## Media
Photos and the takeoff video load from Wikimedia Commons (stable URLs, free licences). Attribution is required — see `CREDITS.md` and keep the footer credit line.
To self-host, download each file from its Commons page in a browser into `assets/img` / `assets/video` and update the `src` paths.
