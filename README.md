# umiu

Mobile-first Train / Food / Cycle app. React + Ionic web app today, the same code becomes an iPhone app with Capacitor later.

- **Train**: workouts, sets and reps, progression advice, history calendar, exercise demos.
- **Food**: daily log with food search (English, Russian, Bulgarian) and barcode scan, calorie targets, body fat, recipes, shopping list, progress photos.
- **Cycle**: phase tracking, period tracker, hormone chart, quotes, mood and symptoms, breathing guide.

All data stays on the device (browser storage). Settings → **Style & data** has backup and restore.

## Run it

You need Node 22+ (installed with nvm).

```bash
npm install
npm run dev          # http://localhost:5173/umiu/
npm run dev:phone    # same, reachable from your iPhone on the same Wi-Fi (use the "Network" address)
npm run build        # production build in dist/
npm run typecheck
```

## Check the UI (QA)

```bash
npm run dev          # in one terminal
npm run qa           # in another: navigation + user flows + screenshots
```

Screenshots of every screen on iPhone SE, iPhone 15, iPhone 15 Pro Max and desktop land in `qa/out/`. See [docs/QA.md](docs/QA.md).

## Deploy to GitHub Pages

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site.

One-time setup on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pages needs a public repository on a free plan.

The site is served from `https://<user>.github.io/umiu/`. If the repository name changes, change `base` in `vite.config.ts`.

## iPhone app (later)

See [docs/IOS.md](docs/IOS.md). Short version: install Xcode, then `npx cap add ios`, `npm run build -- --mode native && npx cap sync`, `npx cap open ios`.

## Project layout

```text
src/
  App.tsx            routes, side menu / bottom bar, sheets
  data/              exercises, foods + recipes, cycle content (plain data)
  lib/               logic: store (saved state), train, food, cycle, photos, art, figures, icons
  components/        shared UI (ui.tsx) and page frame + navigation (layout.tsx)
  pages/train|food|cycle/   the screens
  sheets/Sheets.tsx  every pop-up sheet
  theme/             base.css (design + 4 looks), layout.css (responsive layout)
qa/                  browser checks (Playwright driving your installed Chrome)
docs/                architecture, QA and iOS notes
```

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

The original single-file version (`index.html` built from `build/`) is in git history at commit `d83563b`.
