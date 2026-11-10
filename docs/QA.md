# UI QA

Back to [AGENTS.md](../AGENTS.md) · Related: [DESIGN.md](DESIGN.md) (what "right" looks like), skill `mobile-qa`

How to check the app in a real browser after UI changes. Mobile first: check iPhone sizes before desktop.

## 1. Automated checks

```bash
npm run dev            # terminal 1
npm run qa             # terminal 2 (or qa:nav, qa:flow, qa:shots on their own)
```

| Script | Checks |
|---|---|
| `qa:nav` | Exactly one screen is visible after every kind of navigation (tabs, back button, typed URL, browser back/forward, deep links). |
| `qa:flow` | 15 user flows on an iPhone 15 screen, starting from empty data: log sets, search exercises, finish a workout, food search in Russian, grams → macros, shopping list, style switch, period start, breathing timer, saving. |
| `qa:shots` | Screenshots of every screen on iPhone SE, iPhone 15, iPhone 15 Pro Max and desktop, normal and full length, plus console errors and anything wider than the screen. |

The scripts drive your installed Google Chrome through `playwright-core` (nothing extra to download). Options:

```bash
node qa/shots.mjs cycle,food/log "iPhone SE"   # some screens, one device
node qa/shots.mjs "" "iPad Mini,desktop"       # all screens, other devices
QA_DARK=1 npm run qa:shots                     # dark mode
HEADED=1 npm run qa:flow                       # watch it run
QA_URL=https://<user>.github.io/umiu/ npm run qa   # check the live site
```

Screenshots go to `qa/out/` (git-ignored). Open the `-full.png` files to see whole screens.

## 2. Look at the screenshots

On each phone size, check for:

- [ ] Text on buttons, tabs and chips doesn't wrap awkwardly or spill out.
- [ ] Nothing scrolls sideways.
- [ ] The banner doesn't take more than about a third of the screen on iPhone SE.
- [ ] The last item of each screen can scroll above the floating bottom bar.
- [ ] Sheets: header stays visible while the list scrolls; nothing hides under the home indicator.
- [ ] Dark mode (`QA_DARK=1`) and all styles (Style) stay readable.
- [ ] Desktop: side menu, two columns, important buttons (Save, Finish) visible without hunting.

## After a deploy

```bash
QA_URL=https://kasatkaksenia.github.io/umiu/ npm run qa
```

Check that only the "Deploy to GitHub Pages" workflow ran. If "pages build and deployment" also runs, Pages is set to "Deploy from a branch"; switch it to GitHub Actions.

## 3. Real devices

Chrome only imitates an iPhone's screen size. Before a release, check on a real iPhone:

```bash
npm run dev:phone      # open the "Network" address in Safari on the iPhone
```

Things only a real iPhone shows: Safari's date picker, keyboard covering inputs, safe areas around the notch and home indicator, swipe-back gesture, add to Home Screen.

## 4. Claude in Chrome (optional)

With the Claude in Chrome extension connected (`/chrome` in Claude Code), Claude can open the dev server in your own Chrome, click through it, read the console and fix issues in a loop. Resize the window to around 390 × 844 to imitate an iPhone.

## Bugs found and fixed so far

| Bug | Fix |
|---|---|
| Open an exercise → tap Food → tap Train: Food stayed on screen | `IonTabs` with a hidden tab bar, so each section has its own page history |
| Section tabs ("My targets") wrapped onto two lines on small phones | No wrapping, smaller text under 400px, sideways scroll as a fallback |
| "Holiday or busy" chip broke into a tall two-line pill | Chips never wrap; the chip row wraps instead |
| Exercise names broke mid-word ("Hyperextensi on") | Smaller thumbnails on small phones, normal word wrapping |
| Sheet header was a lighter box with square corners | Sheet is now a fixed header plus a scrolling body |
| Save plan was far below the equipment list on desktop | Second Save button in the left column on wide screens |
| "about about 80%" in the welcome-back card (from the first version) | Text fixed |
| Small inputs made iOS zoom in on focus | Every field is at least 16px |
| Cycle phase card: widgets button covered the progress bar | Button moved into the first line (`.stl`) |
| Typing "62." in a weight lost the dot, so decimals were hard to enter; "62,5" ignored | `SetInput` keeps the typed text; comma becomes a dot |
| Phone gaps between widgets were 24px between columns, 12px elsewhere (flex margins don't collapse) | `.cols` is block on phones; one `--vgap` for cards, grids, Cycle columns |
| Quote banner decoration sat under the filter button | Decoration kept left of the button |
| Breathing card changed height while the instructions changed | Fixed stage for the orb, three-line text box |
| Native select arrow touched the right border | Own CSS arrow, 40px right padding |
| Delete pop-up looked like stock iOS (blue buttons) | App font, colours and pill buttons |
| Add-exercise search hid "Machine hip thrust" (equipment not ticked, or already in the workout) | Separate groups for both while searching |
| Generator made 2 exercises when 6 were asked (few ticked machines) | Fills in less strict passes |
| Icon in "Manual" sat 10px from the text; filter icons off-centre | No margin on icons in buttons, flex gap |
| Nutrition tip card changed size between tips | All tips stacked in one grid cell |
| Exercise menu ☰ glyph sat off-centre | Drawn SVG icon in a 40px round button |
| "Add meal" text was 14px next to 16px "Scan barcode" | `.lab`, `.lab2` fixed at 16px |
| Scan barcode (label) stayed 16px while buttons in rows shrink to 14px on small phones | Same small-screen rule for `.lab`/`.lab2` |
| Nutrition tip card grew 3px when a long topic name wrapped | Topic label on one line |
| "Scan barcode" wrapped to two lines on iPhone SE, so "Add meal" looked padded differently | Two-button rows: one line, 8px side padding on small phones |
| Swipe didn't work over the exercise demo, header or empty space | Listener on the whole page; demo's inner SVG ignores touches |
| Custom "10" chip cut off at the row's right edge after Set | Row scrolls to the end after saving |
| Cycle: with no data, the widgets button sat on top of the text (`button.ic` made it `position: relative`) | `button.wbtn { position: absolute }` |
| Cycle: a late period silently wrapped into a new cycle ("Day 8, follicular") | Counts on and shows "Period is N days late" |
| Looks: theme rules for `input` also restyled the tick boxes (Glow signal tick invisible) | Theme input rules skip `type=checkbox` |
| Russian labels overflowed (Food tabs, Train banner, Scan barcode / Add meal on SE) | Shorter Russian/Ukrainian wording in `dict.ts` |
| Spacing rule for buttons also hit tab-bar buttons (Food tabs overflowed) | Rule limited to action buttons (plain, `.g`, `.lab`, `.lab2`) |
| "+ Add meal" had no outline in outlined themes while "Scan barcode" did | Removed the old `border: 0` from `button.lab2` |
| Quote card wider than the iPhone SE screen | `aspect-ratio` with `min-height` widened it; added `width: 100%` |
| Text inside quote pictures rendered at 7 px | Global `svg text` rule; sizes now set inline |
| "Bloom" dictionary text showed as a white box | Reused class `up` (Ionic page); renamed to `qa-up` |
| Many texts below 4.5:1 (Mist grey text, Clean white / Desert HUD / Gallery accents, period-day numbers) | Token fixes per look; `qa/contrast.mjs` checks every look |
| Undo bar appeared once per loaded screen | Rendered once in `App.tsx` |
| Mist's grey day style hid period colours | Period-day rules use higher specificity |
| Night planner banner stayed medium weight when set to bold | Manrope 700 wasn't loaded; added it (and Montserrat 700) |
| New Back label would read "Спина" (body part) in Ukrainian | `BackTxt` picks the word by language |
| Chart quote picture cut "SMALL THING W…" at the right edge; larger quotes collided in chart, palm storm, mist dictionary, duck and Buddha pictures | Narrower wrap, `max` length per picture, text boxes moved; checked all 40 pictures with the longest fitting quote |
| Breathing practice picker showed no arrow in looks that restyle selects | Real chevron icon in `.selw` |
| Selected mood hard to spot (Clay tiles all coloured; Glow signal lime on lime) | Ring on the chosen one, others faded; checked 8 looks × light/dark |
| Meal icons filled the whole ring | Ring rule no longer matches the icon svg |
| Dropdowns had no arrow in Glow signal, Desert HUD and Mist (look background rule removed it) | Arrow forced on every `select` |
