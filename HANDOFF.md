> **History.** This describes the first single-file version (before the React rebuild on 2026-11-02). Its product decisions still apply; the code structure and build steps don't. Current docs: [AGENTS.md](AGENTS.md).

# umiu: developer handoff

## What it is
A mobile-first, single-file web app with three tabs, published as a Claude Artifact. Source: `Desktop/projects/umiu/umiu`.
- **Train:** workout library and logger, training plans (split and days per week), history calendar, progression advice, cardio logging.
- **Food:** calorie and macro calculator (Mifflin–St Jeor), food log, recipes, shopping list, body-fat tools, progress photos with collages.
- **Cycle:** phase tracking and tips, hormone curves, mood and symptoms, quotes, period tracker, breathing exercises.

Four themes: Cerulean & soil (default), Urban glow, Bright pop (brown), Clean white. Each has light and dark variants.

## How `index.html` is structured
One generated file of about 260 KB, no separate image files.
- **Head:** title, Google Fonts link, CSS. Colours are tokens on `:root`, overridden per theme with `data-look` (b, u, p, w) and per scheme with `prefers-color-scheme` or `data-theme`.
- **Body:** `#bgfx`, `#app`, `#nav`. A single `render()` rebuilds `#app` from state and the current tab.
- **State:** one object `S`, saved to `localStorage` under `bloom2` and, when signed in, to a db document. UI state (open sheet, screen, menu) lives in `UI`. `merge()` and `migV12()` handle defaults and migrations.
- **Exercise data:** `EX[id]=[name, primary muscles, secondary muscles, reps, steps]`. Equipment is in `EQ` and `EQL`; cardio field config is in `CD`. Animated stick figures are in `AN`; the body diagram is `fig()`.
- **Training logic:** `rowsOf`, `sv`, `fin`, `adv` (progression and breaks), `backCard`, `matchPct` and `swapHtml` (swap ratings), `setsTable` (strength and cardio tables).
- **Food data:** `FD` (food macros), `REC` (96 recipes built by `mkR` from gram strings), shopping-list merge (`parseIng`, `toShop`), `calc()`, goal sheet (`gp`).
- **Cycle data:** `phase()`, tips tables, `QX` (quotes), `perCard` and the period functions, Apple Health importer (`ahImport`).
- **Art:** everything visual is generated in code: hero images, quote pictures (`avq`), icon masks (`IC`), widget icons (`WIC`), wordmark (`LOGO`).
- **Sheets:** `sheetH()` is one big `if/else` that renders every bottom sheet (swap, add, `wk`, `ew`, `gp`, `qf`, `col`, ...).

## How it is built
`build/assemble10.py` produces `index.html`. It first runs `assemble5.py` over the old base files (`v3.html`, `v4.html`, `v5.html`), then inserts the newer scripts (`p3_12`, `p4`, `p5`, `p6_10`, `p7_12`, `p8a`, `p8b`, `p9`) and applies string patches from `patch10.py`. Rebuilding reproduces the shipped file exactly. Put new work in the newest files: `head12.html`, `head_add12.css`, `p8a`, `p8b`, `p9`, `patch10.py`.

## Decisions made
- **Pictures:** all pictures are generated or from free stock. Reference images were inspiration only; no AI photos.
- **Scope rule:** change only what the owner asks for; suggest other improvements in chat first.
- **Wordmark:** custom-drawn heavy geometric wordmark, because the reference font (Haust) is commercial.
- **Formula:** BMR uses coefficients 10, 6.25 and 5, with activity multipliers 1.4 to 2.2 (custom up to 2.4). Goal is a percentage of calories, set in a sheet.
- **Swap ratings:** match % = 60% primary muscles, 20% secondary muscles, 10% same equipment, 10% rep-range proximity.
- **Equipment filter:** `S.eq` filters every exercise list and the AI generator. Empty shows everything; bodyweight exercises always show.
- **Progression:** double progression; load steps about 5% lower body, 2.5% upper body; a stall suggests a deload; after a break of 14 days or more, weights drop 5 to 30% depending on the gap.
- **Shopping list:** items merge on unit and singular name, showing the summed amount and source recipes.
- **Apple Health:** a web page can't read it live, so import `export.zip` or `export.xml`. Periods are grouped from days with flow, with gaps of up to 3 days.
- **Downloads:** use the `downloads` capability; plain `<a download>` does nothing in the viewer.

## Known limits
- Nutrition values for Bulgarian brands are typical figures; there is no external food database.
- Exercise figures and recipe images are schematic placeholders.
- Cycle content is educational, not medical advice.

## What's left
- Not tested on a real phone (only Playwright at 400 px), with real signed-in sync, or with a real Apple Health export.
- The build is fragile: `assemble10` is a chain of copies and string patches. Merge everything into one clean source tree with real modules.
- The bottom navigation bar covers the last card on each screen.
- The equipment filter lives on the Training plan screen, not in a profile or settings screen.
- Possible follow-ups: long-press on the quote picture to open the filter; a restore option for the old blob icon; zip64 support for very large Apple Health exports.
- Nothing is committed to git yet.
