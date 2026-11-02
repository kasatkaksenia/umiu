# umiu – notes for Claude

React 18 + Ionic 8 + Vite + TypeScript web app, mobile first, later an iOS app via Capacitor. Read `docs/ARCHITECTURE.md` before larger changes.

## Commands

Node comes from nvm: prefix shell commands with `source ~/.nvm/nvm.sh &&`.

- `npm run dev` → http://localhost:5173/umiu/ (hash routes, e.g. `#/food/log`)
- `npm run typecheck`, `npm run build`
- `npm run qa` (needs the dev server): navigation, user flows, screenshots in `qa/out/`

## Conventions

- State: change `S` / `UI` from `src/lib/store.ts`, then `commit()` (save + re-render). Screens call `useStore()`.
- New screen: add a route in `App.tsx`, wrap content in `<Page>`. New pop-up: add to the `Sheet` type and the switch in `sheets/Sheets.tsx`.
- Mobile first: style for an iPhone SE (375px) first, then add `@media (min-width: …)` rules. Use `.cols`, `.grid-cards`, `.masonry` for wide screens.
- Inputs at least 16px; touch targets around 40–44px; use `env(safe-area-inset-*)` for anything fixed.
- No `window.confirm` / `alert`: use `useIonAlert`.
- Section navigation goes through `useGoTab()`. Ionic keeps hidden screens in the DOM, so scope selectors to `.ion-page.up:not(.ion-page-hidden)`.
- `lib/art.ts` and `lib/figures.ts` are ported generator code with `// @ts-nocheck`; keep them string-based.

## After UI changes

Use the `mobile-qa` skill: run `npm run qa`, look at the iPhone SE and iPhone 15 screenshots, fix, repeat.
