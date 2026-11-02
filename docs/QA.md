# UI QA

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
- [ ] Dark mode (`QA_DARK=1`) and all four styles (Style & data) stay readable.
- [ ] Desktop: side menu, two columns, important buttons (Save, Finish) visible without hunting.

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
