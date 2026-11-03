# umiu – Claude Code notes

@AGENTS.md

## Claude-specific

- Shell: always `source ~/.nvm/nvm.sh && …` before npm/node/npx.
- After any UI change, use the `mobile-qa` skill before reporting. Read screenshots from `qa/out/` with the Read tool, iPhone SE first.
- Claude in Chrome tools only exist after the owner runs `/chrome`. If they're missing, say so and use `npm run qa` (Playwright + installed Chrome) instead.
- Ionic keeps hidden screens in the DOM: scope any browser selector to `.ion-page.up:not(.ion-page-hidden)` (helper `active()` in `qa/lib.mjs`).
- Pushing to `main` deploys the public site: ask before pushing. Work on a branch; the owner merges through pull requests.
- No `gh` CLI: give GitHub links instead. Read-only GitHub API calls work with `curl` for public data (Actions runs).
- Keep `docs/QA.md` (bugs table) and `docs/DECISIONS.md` up to date when you fix something non-obvious or make a choice.
