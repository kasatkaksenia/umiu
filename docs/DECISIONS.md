# Decisions and lessons learned

Back to [AGENTS.md](../AGENTS.md). Add an entry whenever you make a non-obvious choice or learn something the hard way. Product decisions from the first version (formulas, swap ratings, progression, shopping-list merging) are in [HANDOFF.md](../HANDOFF.md) and still apply.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-11-02 | Rebuild the single 260 KB `index.html` (made in the Claude desktop app) as React + Ionic + Vite + TypeScript, keeping features and look | proper structure, responsive, path to an iOS app |
| 2026-11-02 | Ionic 8 + react-router 5, React 18, Vite 7, TS 5.9, Capacitor 8, all pinned | well-known, compatible versions; Ionic 9 needs react-router 6 (upgrade both together) |
| 2026-11-02 | Mutable store (`S`, `UI`, `commit()` + `useSyncExternalStore`) instead of Redux/Zustand | logic ported nearly verbatim; small app, one user |
| 2026-11-02 | Keep localStorage key `bloom2` and the same data shape | compatible with first-version data and backups |
| 2026-11-02 | Hash routing (`#/…`) | GitHub Pages has no SPA fallback; refresh must never 404 |
| 2026-11-02 | `IonTabs` with a hidden `IonTabBar` + custom `BottomNav` / `SideMenu` | per-section page history fixes stuck-screen bugs while keeping the custom pill design |
| 2026-11-02 | Custom bottom sheets (`.ov` / `.sh`) instead of `IonModal` | keeps the original look; content-height sheets; dialogs on desktop |
| 2026-11-02 | Progress photos in IndexedDB | too big for localStorage; first version lost them on page close |
| 2026-11-02 | `ai = null` (`src/lib/ai.ts`), AI-only buttons hidden | Claude's artifact runtime doesn't exist outside Claude; AI needs a backend later, never keys in the frontend |
| 2026-11-02 | Backup / restore JSON in Style & data | move data between devices; old Claude-artifact data can't migrate automatically |
| 2026-11-02 | Fonts bundled via `@fontsource` (Urbanist, Manrope); Fraunces dropped (unused) | offline and inside the iOS app |
| 2026-11-02 | GitHub Pages deploy through Actions (`deploy.yml`); Pages source must be **GitHub Actions** | "Deploy from a branch" also runs GitHub's own job that publishes raw source and races with ours |
| 2026-11-02 | QA with `playwright-core` driving installed Chrome; scripts in `qa/` | repeatable, no browser download; Claude in Chrome when connected |

## Lessons learned (gotchas)

- **Ionic page stack:** pushing between sections in one `IonRouterOutlet` with `"none"`/`"replace"` left the wrong screen visible (exercise → Food → Train showed Food). Fixed with `IonTabs`. `qa:nav` guards it.
- **Hidden screens stay in the DOM** (`.ion-page-hidden`). Selectors like `.ion-page:not(.ion-page-hidden) X` also match through the outer `#main.ion-page` wrapper: use `.ion-page.up:not(.ion-page-hidden)`. Several "bugs" during QA were test-selector mistakes; check the app state before fixing.
- **Page backgrounds:** each `IonPage` (`.up`) carries the gradient and its `::before` layer (the old `#bgfx`), with `ion-content { --background: transparent }`, so iOS slide transitions don't show two pages through each other.
- **Generated art** (`av`, `avq`) is slow on first paint (pixel loops); `useArt()` defers it one frame and caches it as a CSS variable.
- **`white-space: nowrap` on row buttons** made "My period started today" spill out; only chips and tabs are no-wrap.
- **Sticky sheet header with `background: inherit`** showed a square light box; the sheet is now a flex column with a fixed header and a scrolling body.
- **npm 11 blocks install scripts** (esbuild warning); esbuild still works because its binary is an optional dependency.
- **zsh had no profile;** `~/.zshrc` was created for nvm. Non-interactive shells still need `source ~/.nvm/nvm.sh`.
- **Python 3.9** on this Mac: no backslashes inside f-string expressions; no Pillow.
- **`cap:sync`** must use the native build (`build:native`), or assets point at `/umiu/` and the iOS app is blank.
