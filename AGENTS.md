# umiu: guide for AI agents and developers

Start here. This file is the single entry point; `CLAUDE.md` imports it, and every other doc is linked below.

## What umiu is

A personal Train / Food / Cycle app for one owner. It is a **mobile-first responsive web app** today (React + Ionic, hosted on GitHub Pages) and will become an **iPhone app** later from the same code (Capacitor).

- Live site: https://kasatkaksenia.github.io/umiu/
- Repo: https://github.com/kasatkaksenia/umiu (default branch `main`, every push to `main` deploys)

## Three rules that matter most

1. **Mobile first.** Design and test for an iPhone SE (375 px wide) first, then iPhone 15 / 15 Pro Max, iPad and desktop. Desktop is an enhancement, never the starting point. See [docs/DESIGN.md](docs/DESIGN.md).
2. **iOS-ready.** Everything must keep working inside a Capacitor iOS app: no server, no browser-only features without a native plan, safe areas respected, inputs ≥ 16 px. See [docs/IOS.md](docs/IOS.md).
3. **Verify in a browser before saying "done".** Run `npm run qa`, look at the iPhone screenshots, fix, repeat (usually 2–3 rounds). See [docs/QA.md](docs/QA.md).

## Scope rule (owner's rule)

**Never change anything the owner didn't ask to change.** This covers code, design, copy, docs and refactors alike.

- You may **suggest** other changes (bugs you noticed, UX ideas, cleanups), but make them **only after the owner confirms**.
- When a request says "suggest", propose options and wait; don't implement.
- If a requested change forces a side change (e.g. a shared style), say so in the report.

## Git workflow (owner's rule)

- Everything happens on `main`. **Don't create branches.**
- **Don't commit or push.** Leave changes in the working tree; the owner reviews, commits and pushes manually.
- At the end of a task, list the changed files (`git status --short`) so the owner knows what to commit.
- Reading git is fine (`status`, `diff`, `log`, `fetch`). Every push to `main` deploys the live site.

## Commands

Node comes from nvm and is not on the default PATH in fresh shells: prefix commands with `source ~/.nvm/nvm.sh &&`.

| Command | What it does |
|---|---|
| `npm run dev` | dev server at http://localhost:5173/umiu/ (hash routes: `#/train`, `#/food/log`, `#/cycle`) |
| `npm run dev:phone` | same, reachable from an iPhone on the same Wi-Fi |
| `npm run typecheck` | TypeScript check |
| `npm run build` | web build for GitHub Pages (`base: /umiu/`) |
| `npm run build:native` | build for the iOS app (relative paths) |
| `npm run qa` | browser checks (needs the dev server): `qa:nav`, `qa:flow`, `qa:shots` |
| `npm run cap:sync` | native build + copy into the iOS project (after `npx cap add ios`) |

## Documentation map

| Doc | Read it when |
|---|---|
| [README.md](README.md) | first look: features, running, deploying |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | changing code: stack, state, routing, sheets, file layout |
| [docs/DESIGN.md](docs/DESIGN.md) | changing UI: mobile-first rules, breakpoints, design tokens, components |
| [docs/QA.md](docs/QA.md) | verifying UI: scripts, checklist, bugs found so far |
| [docs/IOS.md](docs/IOS.md) | building the iPhone app, native replacements |
| [docs/DECISIONS.md](docs/DECISIONS.md) | why things are the way they are, lessons learned, gotchas |
| [docs/ROADMAP.md](docs/ROADMAP.md) | what's next, known limits |
| [docs/EXERCISES.md](docs/EXERCISES.md) | every exercise grouped by equipment (generated from `src/data/exercises.ts`) |
| [HANDOFF.md](HANDOFF.md) | history: the first single-file version and its product decisions (formulas, swap ratings, progression) |

Claude Code skills (in `.claude/skills/`, usable by name):

| Skill | Use for |
|---|---|
| `mobile-qa` | the check → fix → re-check loop at iPhone sizes |
| `new-screen` | adding a screen, card or sheet the project's way |
| `ship` | release: checks, GitHub Pages, iOS build |

## Code in one minute

- `src/lib/store.ts`: saved state `S` (localStorage key `bloom2`) and `UI` (open sheet etc.). Change them, then `commit()`.
- `src/pages/<train|food|cycle>/`: screens, each wrapped in `<Page>`. Routes are in `src/App.tsx`.
- `src/sheets/Sheets.tsx`: every pop-up; open with `openSheet({ t: "…" })`.
- `src/components/ui.tsx` and `layout.tsx`: shared pieces, navigation (bottom bar on phones, side menu ≥ 900 px).
- `src/theme/base.css` (design and four looks) and `layout.css` (responsive layout, iOS polish).
- `src/data/`: exercises, foods, recipes, cycle content. `src/lib/`: logic per area.

## Environment facts (owner's Mac)

- macOS, VS Code with Claude Code, Google Chrome with the Claude in Chrome extension (connect with `/chrome`).
- **No Xcode yet** (only Command Line Tools), so no iOS Simulator; **no `gh` CLI**. Python 3.9 without Pillow.
- Playwright (`playwright-core`) drives the installed Chrome; its own WebKit download stalled, so Safari-engine testing needs a real iPhone or Xcode.
