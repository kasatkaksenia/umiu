// Page frame, top bar and navigation (bottom bar on phones, side menu on wide screens).
import { ReactNode, useEffect } from "react";
import { IonContent, IonMenu, IonPage, useIonRouter } from "@ionic/react";
import { useLocation } from "react-router-dom";
import { Logo } from "./ui";
import { UI, useStore } from "../lib/store";
import { TOAST, doUndo } from "../lib/undo";

export type Tab = "train" | "food" | "cycle";
const TABS: [Tab, string, string][] = [
  ["train", "Train", '<path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12"/>'],
  ["food", "Food", '<path d="M5 19C5 9 11 5 20 5c0 9-4 15-13 15M5 19l8-8"/>'],
  ["cycle", "Cycle", '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'],
];
const HOME: Record<Tab, string> = { train: "/train", food: "/food/log", cycle: "/cycle" };

export function useTab(): Tab {
  const p = useLocation().pathname;
  return p.startsWith("/food") ? "food" : p.startsWith("/cycle") ? "cycle" : "train";
}

/** Switch top-level section without a slide animation, closing anything that was open. */
export function useGoTab() {
  const r = useIonRouter();
  return (t: Tab) => {
    UI.sheet = null;
    UI.menu = null;
    r.push(HOME[t], "none");
  };
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
  );
}

/** Floating pill at the bottom of the screen (phones and small tablets). */
export function BottomNav() {
  const tab = useTab(), go = useGoTab();
  return (
    <nav className="bnav" aria-label="Sections">
      {TABS.map(([k, l, d]) => (
        <button key={k} className={tab == k ? "on" : ""} aria-label={l} aria-current={tab == k ? "page" : undefined} onClick={() => go(k)}>
          <NavIcon d={d} />
        </button>
      ))}
    </nav>
  );
}

/** Side menu shown by the split pane on wide screens. */
export function SideMenu() {
  const tab = useTab(), go = useGoTab();
  return (
    <IonMenu contentId="main" swipeGesture={false} className="side" type="push">
      <div className="side-in">
        <div className="side-logo"><Logo height={36} /></div>
        <nav aria-label="Sections">
          {TABS.map(([k, l, d]) => (
            <button key={k} className={tab == k ? "on" : ""} aria-current={tab == k ? "page" : undefined} onClick={() => go(k)}>
              <NavIcon d={d} />
              <span>{l}</span>
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <ProfileButton label />
        </div>
      </div>
    </IonMenu>
  );
}

/** Opens Profile (units, language, style). */
function ProfileButton({ label }: { label?: boolean }) {
  const r = useIonRouter();
  const ico = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.8 4.2-5.6 7.5-5.6s6.3 1.8 7.5 5.6" />
    </svg>
  );
  return label
    ? <button className="g s ibtn" onClick={() => r.push("/profile")}>{ico} Profile</button>
    : <button className="lk" aria-label="Profile" onClick={() => r.push("/profile")}>{ico}</button>;
}

export function TopBar() {
  return (
    <div className="top">
      <span className="brand"><Logo /></span>
      <ProfileButton />
    </div>
  );
}

/** A screen: scrollable content with the shared background and top bar. */
export function Page({ children, wide, title }: { children: ReactNode; wide?: boolean; title?: string }) {
  useEffect(() => {
    if (title) document.title = title + " · umiu";
  }, [title]);
  return (
    <IonPage className="up">
      <IonContent className="uc" scrollEvents={false}>
        <main className={"wrap" + (wide ? " wide" : "")}>
          <TopBar />
          {children}
        </main>
      </IonContent>
    </IonPage>
  );
}

/** "Removed … · Undo" for a few seconds after a delete. */
export function UndoToast() {
  useStore();
  if (!TOAST) return null;
  return (
    <div className="undo toast" role="status">
      <span>{TOAST.m}</span>
      <button onClick={doUndo}>Undo</button>
    </div>
  );
}

/** "‹ Back" button that returns to the previous screen (or to `fallback`). */
export function BackButton({ fallback }: { fallback: string }) {
  const r = useIonRouter();
  return (
    <button className="q" onClick={() => (r.canGoBack() ? r.goBack() : r.push(fallback, "back", "replace"))}>‹ Back</button>
  );
}
