import { useState } from "react";
import { MEALS, chooseMeal, eaten, mealOf, todayLog } from "../../lib/food";
import { FoodEntry, MealKey, S, commit, openSheet } from "../../lib/store";
import { offerUndo } from "../../lib/undo";
import { t as tt } from "../../lib/i18n";
import { Ico } from "../../components/ui";



export function FoodLog() {
  const t = todayLog();
  return (
    <div className="cols c-main">
      <div className="col main">
        <Summary />
      </div>
      <div className="col side">
        <Meals items={t} />
      </div>
    </div>
  );
}

/** Today by meal: a ring for each meal's share of the calorie goal, its foods, and "+" that opens the food search for that meal. Tap a meal to see and remove its foods. */
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
                openSheet({ t: "af" });
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


