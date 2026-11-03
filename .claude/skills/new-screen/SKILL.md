---
name: new-screen
description: Add a new screen, sub-tab, card or pop-up sheet to umiu following the project's patterns (store, routing, mobile-first layout). Use when building a new feature in the UI.
---

# Adding UI to umiu

Read `AGENTS.md`, `docs/ARCHITECTURE.md` and `docs/DESIGN.md` first if you haven't in this session. Respect the scope rule: build only what was asked.

## Data and logic

1. Static content → `src/data/*.ts`.
2. Saved state → add a field to `State` and `BLANK` in `src/lib/store.ts`. If old saves lack it, default it in `migV12()` / `merge()`.
3. Logic → a function in `src/lib/<area>.ts` that changes `S` and ends with `commit()`. No DOM access in logic.

## A new screen

1. Create `src/pages/<area>/<Name>.tsx`:

   ```tsx
   export default function Name() {
     useStore();
     return (
       <Page title="Name">
         <BackButton fallback="/train" />   {/* inner screens only */}
         <h1>Name</h1>
         <div className="cols c-even">      {/* one column on phones, two on ≥900px */}
           <div className="col">…cards…</div>
           <div className="col">…cards…</div>
         </div>
       </Page>
     );
   }
   ```

2. Add `<Route exact path="/area/name" component={Name} />` inside `IonRouterOutlet` in `src/App.tsx`, under the right section prefix (`/train`, `/food`, `/cycle`) so it joins that section's history.
3. Open it with `useIonRouter().push("/area/name")` (slides in like iOS).

A new top-level section also needs an `IonTabButton` in `App.tsx` and an entry in `TABS` / `HOME` in `components/layout.tsx`.

## A new sheet

1. Add `{ t: "name"; …params }` to the `Sheet` union in `store.ts`.
2. Add a `case` in `content()` in `src/sheets/Sheets.tsx` returning `{ title, body }`. Write the body as a small component with its own `useState` for form fields.
3. Open it with `openSheet({ t: "name" })`; close with `openSheet(null)` or by setting `UI.sheet = null` before `commit()`.

## Building blocks (`components/ui.tsx`)

`Hero`, `Tabs`, `Chip`, `Ico`, `Wico`, `ExOption`, `FileButton`, `NumField`, `Svg`. Cards are `<div className="card">`; a clickable card is `<button className="card">`. Confirmations use `useIonAlert`, never `window.confirm`.

## Mobile-first checklist

- Design for 375px wide first; check text length in buttons and tabs.
- Inputs `font-size` ≥ 16px; touch targets around 40–44px.
- Lists of many cards: `.grid-cards`. Independent widgets: `.masonry`.
- Then run the `mobile-qa` skill.
