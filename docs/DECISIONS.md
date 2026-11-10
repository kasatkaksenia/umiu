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
| 2026-11-03 | Owner's scope rule: change only what was asked, suggest the rest | see AGENTS.md |
| 2026-11-03 | Logo is "umiu" in Shrikhand (OFL), turned into SVG shapes and bent along a sine wave, with a `--pk` offset layer (`Logo` in `ui.tsx`); no font file at runtime | owner wanted wavy, separate letters and a unique font like the "Amazonia" reference |
| 2026-11-03 | Bright pop uses brown `#26150B` and blue `#91B2DD` | owner's colour reference |
| 2026-11-03 | Workout rotation = the split's first N workouts, N = workouts per week (max the full split); "Choose workout" lists those plus the owner's own workouts | owner asked for the list to follow the plan; rotation follows it so "Next workout" never shows a hidden one |
| 2026-11-03 | "Workouts per week" starts empty until a plan is saved once (`S.plan.set`); Save is disabled until a number is picked | owner's request |
| 2026-11-03 | Delete confirmations in sheets use `useIonAlert` (on top), not inline boxes | inline box shifted the list |
| 2026-11-03 | Mood emojis are drawn SVG characters (`src/lib/moods.ts`), not system emoji | custom look, same on every device |
| 2026-11-03 | Apple Health import removed from the Cycle screen (`ahImport` kept in `lib/cycle.ts`) | owner's request; HealthKit comes with the native app |
| 2026-11-03 | Period tracker: endless day strip with a month label; tap a past day to mark/unmark it as a period day, optional Light/Medium/Heavy for the tapped day (`perTog`, `setFlow`, `S.flow`). No separate "past periods" list: earlier periods are added by scrolling back | owner's request, Apple Health style |
| 2026-11-03 | Exercise search matches every typed word anywhere (name, muscles, equipment), ignores hyphens and plurals. Add lists sort by words in the workout name, then A–Z. While searching, matches needing un-ticked equipment and exercises already in the workout are shown in their own groups instead of hidden | "Machine hip thrust" seemed missing: it was filtered by equipment or already in the workout |
| 2026-11-03 | Small icon buttons (`button.ic`) are 32px with an invisible 44px tap area | owner asked for smaller edit buttons; keeps Apple's touch-target size |
| 2026-11-03 | Hormone lines: rose (estrogen), blue (progesterone), gold (testosterone) in every look except Bright pop; no green or purple | owner's request |
| 2026-11-03 | Cycle length = average gap between the last 6 period starts (20–45 days); period days less than a week apart count as one period. Default 26 days until two periods are logged (`DEF_LEN`) | owner's request |
| 2026-11-03 | Local workout generator fills up to the asked number in passes (focus muscle main → no per-muscle cap → secondary → ignoring the equipment list) | it returned 2 of 6 when little equipment was ticked |
| 2026-11-03 | Icons inside buttons have no margin; buttons with an icon are inline-flex with a 5px gap | uneven icon/text spacing, off-centre icon-only buttons |
| 2026-11-03 | Brand marks `BRAND.wave` (Cycle banner) and `BRAND.moon` (spare) in `lib/icons.ts`, CSS vars `--b-wave`, `--b-moon`, component `BrandMark` | owner picked the wave for the banner and wanted the moon kept as a brand icon |
| 2026-11-03 | "+ Add meal" (saves a recipe) lives on Food › Log, next to Scan barcode | owner's request |
| 2026-11-06 | Workout editor saves every change at once; an **Undo** bar shows for 5 s after each change (remove, add, swap, rename). One header button, "‹ Back" (to the workout list); no Done / Save / Discard. Removing still asks first. A new workout left empty and unnamed is dropped on leaving | owner picked this flow (replaces the Done + snapshot editor) |
| 2026-11-06 | Choose workout (all screen sizes): the card opens the editor; a "Do next" pill picks the next workout ("✓ Next" on the current one); no ✎ | goes with the editor flow |
| 2026-11-05 | No "Save plan" button: plan changes save on tap; the rotation restarts only if workouts per week or split change; a started workout (ticked sets) is only reset after asking | owner's request |
| 2026-11-05 | Exercise screen: strip of the workout's exercises + swipe left/right (not from the left 28 px, kept for iOS back) | owner's request |
| 2026-11-05 | Add exercises from the main screen is multi-select (same list as the editor) | owner's request |
| 2026-11-05 | Recipes have a meal category (`cat`, or guessed from the name by `catOf`); filtered in the filter pop-up | owner's request |
| 2026-11-05 | Eat / Sports / Do icons v4: cherries, lightning bolt, hourglass drawn straight in the widget colour (no sticker shape behind) | owner asked for a new concept, then no background circles |
| 2026-11-05 | Dates shown as "5 Nov 2026" (`dmy` in `util.ts`) | owner's request (replaces dd/mm/yyyy) |
| 2026-11-05 | A new set (+) starts with empty kg and reps | owner's request |
| 2026-11-05 | Exercise names follow common gym naming ("Dumbbell hammer curl", not "Hammer curl (dumbbell)"); equipment labels on the plan screen unchanged | easier to search online |
| 2026-11-05 | 19 exercise animations redrawn that had borrowed another exercise's movement (pull-ups, hanging raises, cable crunch, woodchop, upright row, fire hydrant, donkey kick, seated calf raise…), see the end of `exercises.ts` | they showed the wrong movement |
| 2026-11-05 | Nutrition tips: 62 tips in 11 topics (`src/data/tips.ts`; sources kept in the data, not shown), topic filter sheet, ‹ › and Shuffle; card height = tallest tip | owner's request |
| 2026-11-02 | QA with `playwright-core` driving installed Chrome; scripts in `qa/` | repeatable, no browser download; Claude in Chrome when connected |
| 2026-11-09 | Spacing conventions: one scale (4/8/12/16/20/24) and one padding per element type, in a final block of `layout.css` (table in DESIGN.md › Spacing) | owner asked for consistent padding rules |
| 2026-11-09 | Languages EN / RU / UK for the interface. Translation at render time through a custom JSX runtime (`jsxImportSource: "umiu-i18n"`, local package `src/i18n`) instead of wrapping ~500 strings by hand; content stays English for now; changing language reloads the app; informal "ты/ти" | owner chose "interface first" |
| 2026-11-09 | Units in Profile: kg/lb and cm/in, stored metric and converted at the edges (`lib/units.ts`); food stays in grams | owner's request |
| 2026-11-09 | Accounts with Supabase (email + password, one `user_data` row per user, RLS). Sign-in replaces device data with the account's (or uploads if the account is empty); every save syncs after 2 s; log out clears account data from the device. Off until `VITE_SUPABASE_*` are set (docs/ACCOUNTS.md) | owner chose real accounts + cloud |
| 2026-11-09 | Profile screen (`#/profile`, person button in the top bar): account, units, language, style | owner's request |
| 2026-11-09 | Food: barcode field placeholder "Barcode (optional)"; drawn barcode and plus icons on Scan barcode / Add meal; nutrient units in brackets "(g)" | owner's request |
| 2026-11-09 | Removed looks Cerulean & soil (`b`), Bright pop (`p`) and Golden hour (`gh`). Default is now Urban glow; a saved removed look falls back to it. The selected look in the Style sheet is always outlined with a ✓ | owner's request |
| 2026-11-09 | Meal from photo: full-width button in Food › Log opens a sheet with the photo, meal name, ingredients (grams each, add from the food search, remove), whole-meal grams and ½–2× portion chips, live totals, "Add to today". `analyseMeal()` in `lib/food.ts` fills it in once AI is connected (`lib/ai.ts`); until then ingredients are added by hand | owner wants photo logging; owner chose "screens now, AI later" (no server or key yet) |
| 2026-11-10 | Three button levels app-wide: main (filled), secondary (`.g`, file buttons now with normal text colour instead of the accent), quiet (`.q`, text only: Back, Edit ›, Reset, Clear, Dismiss). The welcome-back reason is a `.seg` switch | UI review item 2 and 3, approved by the owner |
| 2026-11-10 | Macro colours per look (`--mp/--mc/--mf`), same in bars and in the P / C / F letters of the Today list; Urban glow uses its rose / violet / teal trio | UI review item 6 |
| 2026-11-10 | Contrast pass: every look now meets WCAG AA for text in light and dark (darker accent in Clean white, Desert HUD, Gallery, Mist; darker grey text in Clean white and Mist, lighter in Night planner; period-day and breathing-timer text fixed). Checker: `npm run qa:contrast` | UI review item 7 |
| 2026-11-10 | Exercise rows: 56 px picture, name clamped to two lines | UI review item 8 |
| 2026-11-10 | Deleting a logged meal or own recipe happens at once with a 5 s Undo bar (was: instant with no way back / a confirm dialog) | UX review item 4 |
| 2026-11-10 | No pencil on the workout title; the name is edited at the top of "Change workout" | UX review item 7 |
| 2026-11-10 | Cycle: the setup card is first until a period is logged | UX review item 8 |
| 2026-11-10 | Quote card pictures are drawn SVG scenes (`src/lib/qart.ts`): 40 designs × 1–3 colour versions = 101 pictures, inspired by the owner's moodboard (moon on the sea, ripples, backlit leaves, word-of-the-day hills, era poster, aura orbs, deadpan cat, bath duck, sticker sky, ammonite …). Each design fits some elements and/or topics; every new quote gets a fitting picture this user hasn't seen yet (`S.set.qu`), and only when all fitting ones were seen does that set start over. Some designs carry the words themselves (text on a ripple ring, a chart, a curved line). Flow got a new concept (silk scarf); Moon uses upright Inter Tight, no italics | owner approved the previews, asked for many more that never repeat |
| 2026-11-10 | Russian removed for now (option, dictionary column and plurals). A saved `ru` falls back to English. The old Russian strings are in git history (commit `dc0071d` onwards) | owner's request |
| 2026-11-10 | Ukrainian rewritten as funny surzhyk with slang (Train = "Трєня", Food = "Хавчик", moods "Капець … Імба"). Medical and safety text keeps its meaning, just a lighter tone | owner's request |
| 2026-11-10 | Profile: account card hidden (sign-in screens and sync code stay, reachable at `#/profile/account`); the chosen language is filled with the primary button colour instead of a ✓ | owner's request |
| 2026-11-10 | Style is opened only from Profile → Style → Change. The ◐ top-bar button and the side-menu "Style" button are gone | owner's request |
| 2026-11-09 | Style sheet no longer has the backup / restore block; the sheet and the menu button are called "Style" | owner's request |
| 2026-11-09 | Cycle: if the next period isn't logged, the day keeps counting ("Day 36 of 28 · Period is 7 days late") for up to one extra cycle, instead of silently starting a new cycle | the first Cycle card showed a wrong day and phase when a period was late |
| 2026-11-09 | Tick boxes are drawn by the app (soft filled square, accent fill and check when ticked) instead of the browser checkbox | owner didn't want the grey border inside the box |
| 2026-11-09 | Nine extra looks (`theme/looks.css`): Glow signal `gs`, Still life `sl`, Desert HUD `dh`, Pixel `px`, Golden hour `gh`, Ember `em`, Night planner `np`, Gallery `ga`, Mist `mi`. `gs`, `sl`, `em`, `np` are always dark; the rest have a dark version. Their fonts (Inter Tight, Space Mono, Doto, Silkscreen, Montserrat) are bundled with @fontsource and only downloaded when used. Each look restyles the whole UI like its preview: section banners, cards, title/label/number fonts, buttons, chips, tabs, fields, calorie ring, macro bars, period calendar, list rows and ticks, breathing circle, quote card, bottom bar | owner picked them from the theme previews, then asked for the full UI, not just colours |
| 2026-11-09 | Logo in Shantell Sans 500 (OFL): letters ride a gentle wave and tilt with it; plain black in every look (`--logo`, white in dark mode), no colour offset layer | owner tried option 10 (Gluten), then picked option 9 and black |
| 2026-11-06 | Recipe filters live in one pop-up (meal chips, four segmented limit rows reusing `.seg`, Favourites switch, "Show N recipes", Reset in the header). The screen keeps the count, the filter button and removable chips for active filters | owner approved the preview |
| 2026-11-06 | Workouts per week: any whole number ≥ 1 (was capped at 14). Custom opens a labelled field with "per week" and a Set button; a custom value shows as "10 ✎" | owner's request |
| 2026-11-06 | Exercise swipe listens on the whole screen (`.ion-page`), not just the cards | swipe on the header / empty space did nothing |

## Lessons learned (gotchas)

- **`svg text` in base.css** sets `font-size: 7px` for every SVG text; text drawn inside quote pictures must set its size in a `style` attribute, not `font-size=`.
- **`aspect-ratio` + `min-height`** widens a box when the min-height wins; give such boxes `width: 100%` (quote card overflowed on the iPhone SE).
- **Class `up`** is the Ionic page class here; don't reuse it inside components.

- **Ionic page stack:** pushing between sections in one `IonRouterOutlet` with `"none"`/`"replace"` left the wrong screen visible (exercise → Food → Train showed Food). Fixed with `IonTabs`. `qa:nav` guards it.
- **Hidden screens stay in the DOM** (`.ion-page-hidden`). Selectors like `.ion-page:not(.ion-page-hidden) X` also match through the outer `#main.ion-page` wrapper: use `.ion-page.up:not(.ion-page-hidden)`. Several "bugs" during QA were test-selector mistakes; check the app state before fixing.
- **Page backgrounds:** each `IonPage` (`.up`) carries the gradient and its `::before` layer (the old `#bgfx`), with `ion-content { --background: transparent }`, so iOS slide transitions don't show two pages through each other.
- **Generated art** (`av`, `avq`) is slow on first paint (pixel loops); `useArt()` defers it one frame and caches it as a CSS variable.
- **Breathing card jumped** because instruction text changed length; the orb now sits in a fixed stage and the text box always has room for four lines.
- **Ionic alert colours** need `.sc-ion-alert-ios` in the selector to beat Ionic's own scoped rules.
- **`white-space: nowrap` on row buttons** made "My period started today" spill out; only chips and tabs are no-wrap.
- **Sticky sheet header with `background: inherit`** showed a square light box; the sheet is now a flex column with a fixed header and a scrolling body.
- **Swipes over the exercise demo never finished:** the demo redraws its SVG every frame, so the touched node left the DOM and `touchend` never bubbled. `.anim > * { pointer-events: none }` makes the stable `.anim` box the target.
- **Look styles vs. state styles:** a look rule like `:root[data-look="x"] button.g` outranks state rules such as `.rbar > .fic.on`. Button rules in `looks.css` are wrapped in `:where(:root[data-look="x"])` so they only beat the plain base styles.
- **Vite pre-bundles the JSX runtime** (`node_modules/.vite/deps`), so dictionary edits need `npx vite --force` in development. Production builds are not affected.
- **Ionic alerts aren't React text**: use `useAlert()` (translates header, message, buttons), not `useIonAlert()`.
- **npm 11 blocks install scripts** (esbuild warning); esbuild still works because its binary is an optional dependency.
- **zsh had no profile;** `~/.zshrc` was created for nvm. Non-interactive shells still need `source ~/.nvm/nvm.sh`.
- **Python 3.9** on this Mac: no backslashes inside f-string expressions; no Pillow.
- **`cap:sync`** must use the native build (`build:native`), or assets point at `/umiu/` and the iOS app is blank.
