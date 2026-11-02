# iPhone app with Capacitor

The web app already uses the iOS look (`setupIonicReact({ mode: "ios" })`), safe areas and bundled fonts, so the same build runs inside an iOS app.

## One-time setup

1. Install **Xcode** from the Mac App Store and open it once to accept the license.
2. Install CocoaPods: `brew install cocoapods`.
3. Add the iOS project:

   ```bash
   npm install @capacitor/ios@8.5.3 --save-exact
   npx cap add ios
   ```

## Each time you want to run it

```bash
npm run build -- --mode native   # relative paths instead of /umiu/
npx cap sync ios
npx cap open ios                 # then press Run in Xcode
```

App id and name are in `capacitor.config.ts` (`app.umiu`, `umiu`). Change the id before publishing; it must be unique on the App Store.

## Things to change for the native app

| Feature | Web today | iOS app |
|---|---|---|
| Saved data | localStorage (iOS may clear it) | `@capacitor/preferences` or SQLite behind `lib/store.ts` `save()` / `load()` |
| Progress photos | IndexedDB | `@capacitor/filesystem` behind `lib/photos.ts` |
| Barcode scan | photo + `html5-qrcode` | live camera with `@capacitor-mlkit/barcode-scanning` behind `readBarcode()` in `lib/food.ts` |
| Save collage | download link | `@capacitor/share` or Filesystem |
| Apple Health | import an export file | a HealthKit plugin could read cycle data directly |

Publishing to the App Store needs an Apple Developer account ($99 a year).
