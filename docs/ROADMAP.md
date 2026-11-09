# Roadmap and known limits

Back to [AGENTS.md](../AGENTS.md). Suggest these to the owner; don't start them unasked.

## Next

1. **Real iPhone check:** `npm run dev:phone` → Safari on the iPhone. Check date pickers, keyboard over inputs, notch and home-indicator spacing, swipe back, Add to Home Screen.
2. **iOS app:** install Xcode + CocoaPods, then follow [IOS.md](IOS.md). Move storage to `@capacitor/preferences` and photos to `@capacitor/filesystem` first (iOS may clear web storage).
3. **Live barcode scanning** with `@capacitor-mlkit/barcode-scanning` (today: take a photo, then decode).
4. **Optional AI backend** (meal photo estimates, recipe ideas, workout generator) behind `src/lib/ai.ts`; keys stay on the server.
5. **PWA basics** (manifest, icons, offline service worker) so the web app installs nicely on the home screen before the native app exists.
6. **Bundle size:** the main chunk is ~1.25 MB (~310 KB gzip), mostly Ionic. Code-split pages with `React.lazy` if load time matters.

## Known limits

- Data lives in one browser on one device; no sync. Backup / restore moves it manually.
- Data from the old Claude-artifact version doesn't carry over automatically.
- Bulgarian brand nutrition values are typical figures; no external food database.
- Exercise figures and recipe images are schematic.
- Cycle content is educational, not medical advice.
- Apple Health: the import button was removed from Cycle (owner's request); the importer code is still in `lib/cycle.ts`. Live HealthKit needs the native app.
- The equipment filter lives on the Training plan screen (collapsible card with pictures), not in settings.
- Chrome imitates iPhone sizes only; Safari-engine bugs need a real iPhone or the iOS Simulator.
