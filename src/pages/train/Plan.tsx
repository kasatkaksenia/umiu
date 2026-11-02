import { useRef, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { EQL, SPL } from "../../data/exercises";
import { S, commit, useStore } from "../../lib/store";
import { eqClr, eqTog } from "../../lib/train";
import { BackButton, Page } from "../../components/layout";
import { Chip } from "../../components/ui";

export default function Plan() {
  useStore();
  const r = useIonRouter();
  const [d, setD] = useState(S.plan.days);
  const [s, setS] = useState(S.plan.split);
  const [custom, setCustom] = useState(false);
  const [txt, setTxt] = useState(String(S.plan.days));
  const row = useRef<HTMLDivElement>(null);
  const sp = SPL[s], f = Math.round(((d * sp.f) / sp.seq.length) * 10) / 10;
  const savePlan = () => {
    S.plan = { days: d, split: s, i: 0 };
    S.draft = null;
    commit();
    r.canGoBack() ? r.goBack() : r.push("/train", "back", "replace");
  };
  const applyCustom = () => {
    setD(Math.min(14, Math.max(1, Math.round(+txt) || 3)));
    setCustom(false);
  };
  return (
    <Page title="Training plan">
      <BackButton fallback="/train" />
      <h1>Training plan</h1>
      <div className="cols c-even">
        <div className="col sticky">
          <div className="card">
            <b>Workouts per week</b>
            <div className="hs" ref={row} style={{ marginTop: 8 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(n => <Chip key={n} on={d == n && !custom} onClick={() => {
                setD(n);
                setCustom(false);
              }}>{n}</Chip>)}
              {custom ? (
                <input className="chip on" type="number" inputMode="numeric" min={1} max={14} aria-label="Workouts per week" autoFocus value={txt}
                  onChange={e => setTxt(e.target.value)} onBlur={applyCustom} onKeyDown={e => e.key == "Enter" && applyCustom()} />
              ) : (
                <Chip on={d > 7} onClick={() => {
                  setTxt(String(d));
                  setCustom(true);
                  setTimeout(() => row.current && (row.current.scrollLeft = 9999), 30);
                }}>{d > 7 ? String(d) : "Custom"}</Chip>
              )}
            </div>
          </div>
          <div className="card">
            <b>Split</b>
            {Object.entries(SPL).map(([k, v]) => (
              <button key={k} className={"opt" + (s == k ? " on" : "")} aria-pressed={s == k} onClick={() => setS(k)}>
                <b>{v.n}</b><span className="mu">{v.d}</span>
              </button>
            ))}
          </div>
          <p className="mu" style={{ margin: "6px 4px 12px" }}>With this split, each muscle group is trained about {f}× a week.</p>
          <button className="only-wide" style={{ width: "100%" }} onClick={savePlan}>Save plan</button>
        </div>
        <div className="col">
          <EquipmentCard />
          <button className="only-narrow" style={{ width: "100%" }} onClick={savePlan}>Save plan</button>
        </div>
      </div>
    </Page>
  );
}

function EquipmentCard() {
  const e = Array.isArray(S.eq) ? S.eq : [];
  return (
    <div className="card">
      <div className="row" style={{ alignItems: "center" }}>
        <b>Available equipment</b>
        {e.length > 0 && <button className="g s" style={{ flex: "none" }} onClick={eqClr}>Show all</button>}
      </div>
      <p className="mu" style={{ margin: "4px 0 0" }}>
        {e.length
          ? `Showing only exercises for the ${e.length} item${e.length > 1 ? "s" : ""} you ticked. Bodyweight exercises always show.`
          : "Nothing ticked, so every exercise is shown. Tick what your gym has to hide the rest."}
      </p>
      {EQL.map(([g, a]) => (
        <div className="eqg" key={g}>
          <span className="mu">{g}</span>
          <div className="hs wrapc">{a.map(([k, l]) => <Chip key={k} on={e.includes(k)} onClick={() => eqTog(k)}>{l}</Chip>)}</div>
        </div>
      ))}
    </div>
  );
}
