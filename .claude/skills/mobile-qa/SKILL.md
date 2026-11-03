---
name: mobile-qa
description: Verify UI changes in a real browser at iPhone sizes, find visual bugs and glitches, fix them and re-check in a loop. Use after any change to screens, styles or navigation, or when asked to "QA", "check the UI", "test on mobile" or "make it responsive".
---

# Mobile-first UI QA loop

Rules for what "right" looks like: `docs/DESIGN.md`. Bugs table and checklist: `docs/QA.md`.

Goal: every screen works on iPhone SE (375px) first, then larger phones, iPad and desktop. Repeat check → fix → re-check until a round finds nothing new (usually 2–3 rounds).

## 1. Start the app

```bash
source ~/.nvm/nvm.sh && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/umiu/ || (npm run dev > /tmp/umiu-dev.log 2>&1 &)
```

Run the dev server in the background so it keeps running between steps.

## 2. Run the checks

```bash
source ~/.nvm/nvm.sh && npm run typecheck && npm run qa
```

- `qa:nav`: exactly one visible screen after every kind of navigation.
- `qa:flow`: user flows on iPhone 15 from empty data.
- `qa:shots`: screenshots of every screen (iPhone SE, 15, 15 Pro Max, desktop), console errors, sideways overflow.

Narrow it while iterating: `node qa/shots.mjs food/log,cycle "iPhone SE"`. Dark mode: `QA_DARK=1`. Other devices: `"iPad Mini,desktop"`.

## 3. Look at the screenshots

Read the PNGs in `qa/out/` with the Read tool: the normal view first (what the user sees without scrolling), then `-full.png` for whole screens. Start with iPhone SE.

Look for:
- Text wrapping badly in buttons, tabs, chips and titles; words broken mid-word.
- Anything wider than the screen, or overlapping.
- The banner or one card eating most of the first screen.
- Content hidden under the floating bottom bar or the home indicator.
- Sheets: header, scrolling, bottom padding.
- Low contrast in dark mode or another style.
- On desktop: empty columns, key buttons far away, stretched content.

Interaction bugs need a script. Copy a step from `qa/flow.mjs`, and always scope selectors with `active()` from `qa/lib.mjs`, because Ionic keeps hidden screens in the DOM.

## 4. Fix

- Fix mobile in base CSS or with `@media (max-width: 400px)` in `src/theme/layout.css`; add wide-screen rules with `min-width`.
- Inputs at least 16px (iOS zoom), touch targets around 40–44px (`pointer: coarse`), safe areas with `env(safe-area-inset-*)`.
- Prefer one rule that fixes a pattern everywhere (all chips, all tabs) over one-off inline styles.
- If a bug is in the test, not the app, say so and fix the test.

## 5. Re-check and report

Re-run the checks for the screens you touched, then the full `npm run qa` at the end. Add each bug found to the table in `docs/QA.md`. Report what was found, what was fixed, and what can only be checked on a real iPhone (`npm run dev:phone`).

## Claude in Chrome alternative

If `mcp__claude-in-chrome__*` tools are available (the user ran `/chrome`), you can also open http://localhost:5173/umiu/ in a new tab, resize the window to about 390×844, click through screens and read console messages. The scripts above stay the repeatable baseline.
