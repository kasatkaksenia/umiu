# Architecture

## Stack

| Piece | Version | Why |
|---|---|---|
| React | 18.3 | UI |
| Ionic React | 8.8 | iOS-style page transitions, alerts, split pane, swipe back |
| react-router | 5.3 | required by `@ionic/react-router` 8 |
| Vite | 7.3 | dev server and build |
| TypeScript | 5.9 | `strict`, but `noImplicitAny` off for the ported logic |
| Capacitor | 8.5 | wraps the build as an iOS app |

Versions are pinned (`--save-exact`). Ionic 9 moved to react-router 6, so upgrade Ionic and the router together.

## State

`src/lib/store.ts` holds one object `S` (everything that is saved) and `UI` (what is open right now: sheet, exercise menu, message).

- Actions change `S` / `UI` directly, then call `save()` (write to localStorage), `render()` (re-render), or `commit()` (both).
- Components call `useStore()` once at the top of a screen. Everything below reads `S` directly.
- Saved under the localStorage key `bloom2` (same key as the first version). `merge()` and `migV12()` upgrade old data.
- Progress photos are in IndexedDB (`src/lib/photos.ts`), because they are too big for localStorage.

Keep form fields that are being typed into in component state (`useState`) and write to `S` on blur or submit, so typing doesn't re-render the whole screen.

## Navigation

- Hash routing (`#/food/log`), so GitHub Pages never returns 404 on refresh.
- `IonTabs` with a hidden `IonTabBar` gives Train, Food and Cycle their own page history. The visible navigation is `BottomNav` (phones) and `SideMenu` (wide screens, through `IonSplitPane`).
- Section switch: `useGoTab()` → `router.push(path, "none")`. Inner screens (exercise, plan): `router.push(path)` for the iOS slide.
- Ionic keeps earlier screens in the DOM with `.ion-page-hidden`. In tests and `querySelector`, scope to `.ion-page.up:not(.ion-page-hidden)`.

Routes:

| Path | Screen |
|---|---|
| `/train` | workout + history (tab state in `S.set.tv`) |
| `/train/plan` | training plan |
| `/train/ex/:id` | exercise detail + sets |
| `/train/ex/:id/history` | exercise history |
| `/food/:sub` | `log`, `targets`, `recipes`, `shopping` |
| `/cycle` | cycle widgets |

## Sheets

All pop-ups are in `src/sheets/Sheets.tsx`. Open one with `openSheet({ t: "..." })`; the `Sheet` type in `store.ts` lists them. Bottom sheet on phones, centred dialog on wide screens. Confirmations use Ionic's `useIonAlert` (never `window.confirm`).

## Layout (mobile first)

Base styles target phones. Wider screens add to them:

| Width | Layout |
|---|---|
| ≤ 400px | small iPhone: smaller banner, tighter cards |
| < 640px | one column, floating bottom bar |
| 640–899px | wider single column, recipe grid in 2 columns |
| ≥ 900px | side menu, two-column screens (`.cols.c-even` / `.cols.c-main`), Cycle widgets in a masonry, sheets as dialogs |
| ≥ 1200px | recipe grid in 3 columns |

Helpers in `theme/layout.css`: `.cols` + `.col` (`.main` / `.side`), `.grid-cards`, `.masonry`, `.sticky`, `.only-wide`, `.only-narrow`.

iOS rules that are easy to break:
- Every input, select and textarea is at least 16px, or iOS zooms in on focus.
- Respect safe areas with `env(safe-area-inset-*)` (top bar, bottom bar, sheets).
- Touch targets around 40–44px on `pointer: coarse`.

## Generated graphics

- `lib/art.ts`: canvas painters for banners and quote pictures. Painted once, cached as a CSS variable (`--a-…`). `useArt()` paints after the first frame so screens appear instantly.
- `lib/figures.ts`: SVG strings (muscle map, exercise animation, plate illustration, hormone chart), injected with `<Svg html=…>`. Only generated markup goes in; user text is escaped.
- `lib/icons.ts`: icon paths and the organic mask shapes (`--m1`…`--m6`).

These two files are ported almost unchanged from the first version and use `// @ts-nocheck`.

## AI

`lib/ai.ts` exports `ai = null`. The first version used Claude's built-in runtime, which only exists inside Claude. With `ai` null, AI-only buttons are hidden and the workout generator uses its local fallback. To add AI, point `ai.json()` at your own backend. Never put API keys in the frontend.
