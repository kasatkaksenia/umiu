import { useState } from "react";
import { ai } from "../../lib/ai";
import { MEALS, Suggestion, chooseMeal, chosenMeal, eaten, localName, mealNow, mealOf, readBarcode, searchFoods, todayLog } from "../../lib/food";
import { FoodEntry, MealKey, S, commit, openSheet, render } from "../../lib/store";
import { TODAY } from "../../lib/util";
import { offerUndo } from "../../lib/undo";
import { t as tt } from "../../lib/i18n";
import { FileButton, Ico } from "../../components/ui";



export function FoodLog() {
  const t = todayLog();
  return (
    <div className="cols c-main">
      <div className="col main">
        <Summary />
        <AddFood />
      </div>
      <div className="col side">
        <Meals items={t} />
      </div>
    </div>
  );
}

/** Today by meal: a ring for each meal's share of the calorie goal, its foods, and "+" to add to it. Tap a meal to see and remove its foods. */
function Meals({ items }: { items: FoodEntry[] }) {
  const [open, setOpen] = useState<MealKey | null>(null);
  const C = 2 * Math.PI * 21;
  return (
    <div className="card meals">
      <b className="card-t">Today</b>
      {MEALS.map(([k, n, ic, share]) => {
        const L = items.filter(x => mealOf(x) == k), kc = L.reduce((a, x) => a + (x.k || 0), 0), goal = Math.round((S.goal.k || 0) * share);
        const pc = goal ? Math.min(1, kc / goal) : 0, on = open == k;
        return (
          <div className="ml" key={k}>
            <div className="mlr">
              <button className="mlh" aria-expanded={on} onClick={() => setOpen(on ? null : k)}>
                <span className="mlring" aria-hidden="true">
                  <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="none" stroke="var(--ln)" strokeWidth="4" />
                    {kc > 0 && <circle cx="24" cy="24" r="21" fill="none" stroke="var(--ac)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pc * C).toFixed(1)} ${C.toFixed(1)}`} transform="rotate(-90 24 24)" />}</svg>
                  <Ico k={ic} s={22} />
                </span>
                <span className="mlt">
                  <b>{n} <Ico k={on ? "down" : "chev"} s={16} /></b>
                  <span className="mu">{kc} / {goal} kcal</span>
                  {L.length > 0 && !on && <span className="mu mln">{L.map(x => x.n).join(", ")}</span>}
                </span>
              </button>
              <button className="mladd" aria-label={tt("Add to {m}", { m: tt(n) })} onClick={() => {
                chooseMeal(k);
                render();
                const el = document.querySelector<HTMLInputElement>(".ion-page.up:not(.ion-page-hidden) input[aria-label='Food name']");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                el?.focus({ preventScroll: true });
              }}><Ico k="plus" s={22} /></button>
            </div>
            {on && (L.length ? L.map(x => (
              <div className="li" key={S.f.indexOf(x)}>
                <span>{x.n}<br /><span className="mu">{x.k} kcal · <b className="mt mp">P</b>{x.p} <b className="mt mc">C</b>{x.c || 0} <b className="mt mf">F</b>{x.f || 0}</span></span>
                <button className="q" aria-label={`Remove ${x.n}`} onClick={() => {
                  const i = S.f.indexOf(x);
                  S.f.splice(i, 1);
                  commit();
                  offerUndo(tt("Removed “{n}”", { n: x.n }), () => S.f.splice(i, 0, x));
                }}><Ico k="x" s={18} /></button>
              </div>
            )) : <p className="mu" style={{ margin: "4px 0 8px" }}>Nothing here yet.</p>)}
          </div>
        );
      })}
    </div>
  );
}

function Summary() {
  const G = S.goal, kc = eaten("k"), C = 2 * Math.PI * 46, pc = Math.min(1, kc / (G.k || 1)), left = G.k - kc;
  return (
    <div className="card sum">
      <div className="ring">
        <svg viewBox="0 0 120 120" role="img" aria-label={`${kc} of ${G.k} kcal eaten`}>
          <circle cx="60" cy="60" r="46" fill="none" stroke="var(--ln)" strokeWidth="10" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="var(--ac)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(pc * C).toFixed(1)} ${C.toFixed(1)}`} transform="rotate(-90 60 60)" />
        </svg>
        <div className="rc"><b>{Math.abs(left)}</b><span>{left >= 0 ? "kcal left" : "kcal over"}</span></div>
      </div>
      <div className="mac">
        <div className="mu" style={{ marginBottom: 6 }}>Eaten {kc} of {G.k} kcal</div>
        {([["Protein", "p", "mp"], ["Carbs", "c", "mc"], ["Fat", "f", "mf"]] as const).map(([l, k, c]) => (
          <div className="mi" key={k}>
            <div className="mh"><span>{l} (g)</span><span><b>{eaten(k)}</b> / {G[k]}</span></div>
            <div className="bar"><i className={c} style={{ width: `${Math.min(100, (eaten(k) / (G[k] || 1)) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}


/**
 * Food search (option A): one field with photo and barcode buttons inside, results with "+".
 * "+" opens the edit window (sheet "fe") with grams and nutrients; "Enter manually" opens it empty.
 */
function AddFood() {
  const [name, setName] = useState("");
  const [sugs, setSugs] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState("");
  const clear = () => {
    setName("");
    setSugs([]);
  };
  const open = (s: Suggestion | null, code?: string) => {
    clear();
    setStatus("");
    openSheet({ t: "fe", s, code });
  };

  const scan = async (file: File) => {
    setStatus("Reading barcode…");
    const c = await readBarcode(file);
    if (!c) {
      setStatus("Couldn’t read a barcode. Retake the photo closer and well lit, or type the number below.");
      return;
    }
    const f = S.foods[c];
    open(f ? { ...f, h: "", saved: 1 } : null, c);
  };

  const askAI = async () => {
    if (!ai) return;
    const q = name.trim();
    setSugs([]);
    setStatus("Asking AI…");
    try {
      const r = await ai.json('Typical nutrition per 100 g for "' + q + '". Reply ONLY JSON {"n":"name","k":kcal,"p":protein g,"c":carbs g,"f":fat g} (numbers).');
      open({ n: r.n || q, k: +r.k || 0, p: +r.p || 0, c: +r.c || 0, f: +r.f || 0, h: "" });
    } catch (e: any) {
      setStatus("Couldn’t get an estimate (" + (e?.code || "error") + ").");
    }
  };

  const q = name.trim();
  return (
    <div className="card fsr">
      {chosenMeal() && (
        <div className="mlto">
          <span>{tt("Adding to {m}", { m: tt(MEALS.find(m => m[0] == chosenMeal())![1]) })}</span>
          <button className="q" aria-label="Cancel" onClick={() => { chooseMeal(null); render(); }}><Ico k="x" s={16} /></button>
        </div>
      )}
      <div className="fsf">
        <span className="fsi" aria-hidden="true"><Ico k="search" s={18} /></span>
        <input autoComplete="off" placeholder="Search food" aria-label="Food name" value={name} onChange={e => {
          setName(e.target.value);
          setSugs(searchFoods(e.target.value));
        }} />
        <span className="fsb">
          <FileButton className="g s ic" accept="image/*" capture onFiles={f => openSheet({ t: "mp", url: URL.createObjectURL(f[0]), file: f[0] })} label="Meal from photo"><Ico k="cam" s={18} /></FileButton>
          <FileButton className="g s ic" accept="image/*" capture onFiles={f => scan(f[0])} label="Scan barcode"><Ico k="barcode" s={18} /></FileButton>
        </span>
      </div>
      {q.length >= 2 && (
        <div className="fres">
          {sugs.map((x, i) => {
            const loc = localName(x, q.toLowerCase());
            return (
              <div className="li" key={i}>
                <span>{x.n}<br /><span className="mu">{loc ? loc + " · " : ""}{Math.round(x.k)} kcal · P{Math.round(x.p)} {x.saved ? "· your food" : "per 100 g"}</span></span>
                <button className="fadd" aria-label={tt("Add {n}", { n: x.n })} onClick={() => open(x)}><Ico k="plus" s={20} /></button>
              </div>
            );
          })}
          {!sugs.length && <p className="mu" style={{ margin: "8px 0" }}>No matches.</p>}
          {ai && <button className="q" onClick={askAI}>Ask AI to estimate “{q}”</button>}
        </div>
      )}
      <div className="fsl">
        <button className="q" onClick={() => open(q ? { n: q, k: 0, p: 0, c: 0, f: 0, h: "", saved: 1 } : null)}>Enter manually ›</button>
        <button className="q" onClick={() => openSheet({ t: "cm" })}>Build a meal ›</button>
      </div>
      {status && <p className="mu" role="status" style={{ margin: "4px 0 0" }}>{status}</p>}
    </div>
  );
}
