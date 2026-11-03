---
name: ship
description: Release umiu: type-check, QA, build, deploy to GitHub Pages, or prepare the Capacitor iOS build. Use when asked to deploy, publish, release, or build the iPhone app.
---

# Shipping umiu

Ask before pushing, since a push to `main` deploys the public site.

## Before any release

```bash
source ~/.nvm/nvm.sh && npm run typecheck && npm run build
```

With the dev server running: `npm run qa`. Fix anything it finds (see the `mobile-qa` skill).

## Web (GitHub Pages)

- `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
- One-time repo setting: **Settings → Pages → Source: GitHub Actions**. A free plan needs a public repository.
- URL: `https://<user>.github.io/umiu/`. The path comes from `base` in `vite.config.ts`; change it if the repo is renamed.
- After deploying, check the live site: `QA_URL=https://<user>.github.io/umiu/ npm run qa`.
- The `gh` CLI may not be installed. Without it, give the user the GitHub page links instead of running `gh` commands.

## iPhone (Capacitor)

Needs full Xcode (not just Command Line Tools) and CocoaPods. Check with `xcode-select -p`: it should point into `Xcode.app`.

```bash
npm install @capacitor/ios@8.5.3 --save-exact   # once
npx cap add ios                                  # once
npm run build -- --mode native                   # relative asset paths
npx cap sync ios
npx cap open ios
```

Native replacements still to do are listed in `docs/IOS.md` (storage, photos, barcode, sharing).
