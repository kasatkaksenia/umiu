// Profile: measurement units, language, style. (The account card is hidden for now; /profile/account still works.)
import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import { useLocation } from "react-router-dom";
import { S, commit, openSheet, useStore } from "../../lib/store";
import { cloudOn, resetPassword, signIn, signUp } from "../../lib/cloud";
import { LANG, LANGS, Lang, t } from "../../lib/i18n";
import { BackButton, Page } from "../../components/layout";
import { lookOf, LOOKS } from "../../sheets/Sheets";

/** Two to four choices in one row. */
function Seg<K extends string>({ label, items, cur, on }: { label: string; items: [K, string][]; cur: K; on: (k: K) => void }) {
  return (
    <div className="pfr">
      <span>{label}</span>
      <div className="seg" role="radiogroup" aria-label={label} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(([k, l]) => <button key={k} role="radio" aria-checked={cur == k} className={cur == k ? "on" : ""} onClick={() => on(k)}>{l}</button>)}
      </div>
    </div>
  );
}

export default function Profile() {
  useStore();
  const setLang = (l: Lang) => {
    if (l == LANG) return;
    S.set.lang = l;
    commit();
    // The interface language is read at start-up.
    location.reload();
  };
  const look = LOOKS.find(l => l[0] == lookOf());
  return (
    <Page title="Profile">
      <BackButton fallback="/train" />
      <h1>Profile</h1>
      <div className="cols c-even">
        <div className="col">
          <div className="card">
            <b className="card-t">Units</b>
            <Seg label="Weight" items={[["kg", t("kg")], ["lb", t("lb")]]} cur={S.set.uw == "lb" ? "lb" : "kg"} on={k => { S.set.uw = k; commit(); }} />
            <Seg label="Height and body" items={[["cm", t("cm")], ["in", t("in")]]} cur={S.set.ul == "in" ? "in" : "cm"} on={k => { S.set.ul = k; commit(); }} />
            <p className="mu" style={{ margin: "8px 0 0" }}>Used for sets, body weight, height and measurements. Food stays in grams.</p>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <b className="card-t">Language</b>
            {LANGS.map(([k, l]) => (
              <button key={k} className={"opt lng" + (LANG == k ? " on" : "")} aria-pressed={LANG == k} onClick={() => setLang(k)}>
                <b>{l}</b>
              </button>
            ))}
            <p className="mu" style={{ margin: "8px 0 0" }}>Exercise names, recipes, tips and quotes are in English for now.</p>
          </div>
          <div className="card">
            <b className="card-t">Style</b>
            <div className="row">
              <span>{look?.[1]}</span>
              <button className="g s" style={{ flex: "none" }} onClick={() => openSheet({ t: "look" })}>Change</button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/** Sign in, create account, forgot password. ?m=in | up | reset */
export function Account() {
  const r = useIonRouter();
  const q = new URLSearchParams(useLocation().search);
  const [m, setM] = useState<"in" | "up" | "reset">((q.get("m") as any) || "in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const ok = /^\S+@\S+\.\S+$/.test(email.trim()) && (m == "reset" || pw.length >= 8);
  const go = async () => {
    if (!ok || busy) return;
    setBusy(true);
    setMsg("");
    const e = email.trim();
    if (m == "reset") {
      const x = await resetPassword(e);
      setMsg(x.ok ? "If this email has an account, a reset link is on its way." : x.msg!);
    } else if (m == "up") {
      const x = await signUp(e, pw);
      if (!x.ok) setMsg(x.msg!);
      else if (x.confirm) setMsg("Almost there: open the link we sent to your email, then sign in.");
      else r.push("/profile", "back", "replace");
    } else {
      const x = await signIn(e, pw);
      if (!x.ok) setMsg(x.msg!);
      else r.push("/profile", "back", "replace");
    }
    setBusy(false);
  };
  const title = m == "up" ? "Create account" : m == "reset" ? "Reset password" : "Sign in";
  return (
    <Page title={title}>
      <BackButton fallback="/profile" />
      <h1>{title}</h1>
      <div className="card acc">
        {m != "reset" && (
          <div className="seg" role="tablist" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 0 }}>
            <button role="tab" aria-selected={m == "in"} className={m == "in" ? "on" : ""} onClick={() => { setM("in"); setMsg(""); }}>Sign in</button>
            <button role="tab" aria-selected={m == "up"} className={m == "up" ? "on" : ""} onClick={() => { setM("up"); setMsg(""); }}>Create account</button>
          </div>
        )}
        {!cloudOn && <p className="mu">Accounts aren’t connected yet. Your data is saved on this device.</p>}
        <form onSubmit={e => { e.preventDefault(); go(); }}>
          <label className="fl">
            <span className="mu">Email</span>
            <input type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          {m != "reset" && (
            <label className="fl">
              <span className="mu">Password</span>
              <span className="pw">
                <input type={show ? "text" : "password"} autoComplete={m == "up" ? "new-password" : "current-password"} value={pw} onChange={e => setPw(e.target.value)} />
                <button type="button" className="g s" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
              </span>
              {m == "up" && <span className="mu" style={{ fontSize: 13 }}>At least 8 characters.</span>}
            </label>
          )}
          <button type="submit" style={{ width: "100%", marginTop: 14 }} disabled={!ok || busy || !cloudOn}>{busy ? "Please wait…" : m == "reset" ? "Send reset link" : title}</button>
        </form>
        {msg && <p className="mu" role="status" style={{ margin: "10px 0 0" }}>{t(msg)}</p>}
        {m == "in" && <button className="g s lnk" style={{ marginTop: 8 }} onClick={() => { setM("reset"); setMsg(""); }}>Forgot password?</button>}
        {m == "reset" && <button className="g s lnk" style={{ marginTop: 8 }} onClick={() => { setM("in"); setMsg(""); }}>Back to sign in</button>}
      </div>
    </Page>
  );
}
