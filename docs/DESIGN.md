# Design: mobile first, responsive, iOS-ready

Back to [AGENTS.md](../AGENTS.md) · Related: [ARCHITECTURE.md](ARCHITECTURE.md), [QA.md](QA.md), [IOS.md](IOS.md)

## Principles

1. **Phone first.** Base CSS is the iPhone layout. Wider screens add rules with `@media (min-width: …)`. Small-phone tweaks use `@media (max-width: 400px)`.
2. **One codebase, three shapes:** phone (bottom bar), tablet (wider single column), desktop (side menu + columns). Never a separate desktop site.
3. **Feels like iOS:** Ionic in `mode: "ios"` (slide transitions, swipe back, alerts), safe areas, 16 px inputs, comfortable touch targets.
4. **Keep the look:** "moss-and-glass" from the first version: frosted cards, pill controls, generated nature art, ten looks. Don't swap in Ionic's default components visually.

## Breakpoints

| Width | Target | What changes |
|---|---|---|
| ≤ 400 px | iPhone SE / mini, small iPhones | smaller banner (132 px), 14 px gutters, tighter cards, smaller thumbnails, 13 px tabs |
| < 640 px | all phones | one column, floating pill bottom bar, bottom sheets |
| 640–899 px | iPad portrait, large phones landscape | content up to 720 px, card grids in 2 columns |
| ≥ 900 px | iPad landscape, laptops | side menu (`IonSplitPane`), content up to 1120 px, two-column screens, Cycle masonry, sheets become centred dialogs, logo moves to the side menu |
| ≥ 1200 px | desktop | recipe grid in 3 columns |

Test devices (Playwright names): `iPhone SE` (375×667), `iPhone 15` (393×852), `iPhone 15 Pro Max` (430×932), `iPad Mini` (768×1024), `desktop` (1366×900).

## Layout helpers (`src/theme/layout.css`)

| Class | Phone | ≥ 900 px |
|---|---|---|
| `.cols.c-even > .col` | stacked | two equal columns |
| `.cols.c-main > .main + .side` | DOM order (put `.side` first if it should come first on phones) | main 1.5fr left, side 1fr right |
| `.grid-cards` | stacked (2 columns from 640 px) | 2–3 columns |
| `.masonry` | stacked | 2 CSS columns, cards don't split |
| `.sticky` | normal | sticks to the top while scrolling |
| `.only-wide` / `.only-narrow` | hidden / shown | shown / hidden |
| `.narrow` | – | caps width at 720 px (shopping list) |

Per screen: Train workout `c-main` (next workout left, plan and welcome-back right); history `c-even`; exercise `c-even` (demo + how-to | sets, sticky); plan `c-even` with a second Save button on wide screens; Food log `c-main`; targets `c-even`; recipes `grid-cards` in a wide page; Cycle `masonry`.

## Design tokens (`src/theme/base.css`)

CSS variables on `:root`, redefined per look (`data-look` on `<html>`: `u` Urban glow (default), `w` Clean white; plus eight looks in `src/theme/looks.css`: `gs` Glow signal, `sl` Still life, `em` Ember, `np` Night planner (always dark), `dh` Desert HUD, `px` Pixel, `ga` Gallery, `mi` Mist. The plain `:root` tokens are the shared base; no look uses them on its own any more) and per colour scheme (`prefers-color-scheme`, or `data-theme="dark|light"`).

| Token | Use |
|---|---|
| `--bg`, `--bg2` | page background gradient |
| `--tx`, `--mu` | text, muted text |
| `--card`, `--solid`, `--ln` | card fill, solid fill (sheets, menus), lines |
| `--ac`, `--ac2` | accent, accent wash (secondary buttons, selected) |
| `--btn`, `--btnt` | primary button fill and text |
| `--pk`, `--cr`, `--ol` | protein / carbs / fat bars |
| `--h1`, `--h2`, `--h3` | hormone chart and widget icon colours |
| `--sh` | shadow |
| `--ff` | font stack: Urbanist, Manrope (bundled with `@fontsource`) |
| `--vgap` | space between widgets (cards, banner, tabs, grids): 12px, 16px from 900px. Don't add other card margins |

The logo (`<Logo>`) is "umiu" in Shantell Sans 500, converted to SVG shapes with each letter riding a gentle wave, plain black (`--logo`; white in dark mode). Brand marks: `BRAND.wave` (Cycle banner, `Hero icon="wave"`) and `BRAND.moon`, drawn with `<BrandMark k="moon" />` in the current colour. Icons inside buttons: just put `<Ico>` before the text; the 5px gap and centring come from CSS.

Always use tokens, never raw colours, so all looks and dark mode keep working. Check new UI in at least the default look (Urban glow), one always-dark look (e.g. Glow signal) and dark mode (`QA_DARK=1`).

## Components and patterns

- Card: `.card` (clickable: `<button class="card">`). Slim variant `.card.slim`.
- Buttons: default (dark primary), `.g` (secondary wash), `.s` (small), `.ic` (icon), `.dg` (danger).
- Chips `.chip` (toggle, `aria-pressed`), horizontal scroller `.hs`, wrapping chips `.hs.wrapc`.
- Options in sheets: `.opt` (selected `.on`); exercise options `<ExOption>`.
- Section tabs: `<Tabs>`. Banners: `<Hero kind seed>` (generated art). Quote picture: `.qc`.
- Bottom sheet: `UI.sheet` + `Sheets.tsx`; header fixed, body scrolls (`.sh-head`, `.sh-body`).
- Confirmations: `useIonAlert` (shows on top, nothing in the list moves). Never `window.confirm` / `alert`, never inline confirm boxes.
- Multi-select pick lists: `AddMany` in `Sheets.tsx` (tap to tick, sticky "Add N" button).
- Mood: `<MoodIcon>` draws the fluffy-character emojis from `src/lib/moods.ts`.
- Small round icon buttons: `className="g s ic"` (32px, 44px tap area). Button with a leading icon: add `ibtn`.
- Drop-downs: plain `<select>`; the arrow is drawn by CSS, inset 16px from the right.
- Confirmations: `useIonAlert`; the app styles it in `layout.css` (font, colours, pill buttons).

## iOS rules (don't break these)

- `input`, `select`, `textarea` ≥ 16 px (otherwise iOS zooms on focus).
- Touch targets ~40–44 px on `pointer: coarse` (buttons, chips, checkboxes 28 px).
- `env(safe-area-inset-*)` for the top bar, bottom bar and sheets; `viewport-fit=cover` is set in `index.html`.
- No hover-only interactions; hover styles behind `@media (hover: hover)` or neutralised for `hover: none`.
- `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, `user-select: none` on controls.
- Long text in buttons and chips: chips never wrap (the row wraps); tabs never wrap (they scroll sideways if needed).
- Leave room above the floating bottom bar: `.wrap` has `padding-bottom: 120px + safe area`.
- Date inputs: `appearance: none`, min height 48 px (Safari renders them small otherwise).
