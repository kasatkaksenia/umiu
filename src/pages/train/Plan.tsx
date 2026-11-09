import { useRef, useState } from "react";
import { useIonAlert } from "@ionic/react";
import { EQL, SPL } from "../../data/exercises";
import { S, commit, useStore } from "../../lib/store";
import { eqClr, eqTog } from "../../lib/train";
import { BackButton, Page } from "../../components/layout";
import { Chip, Ico, Svg } from "../../components/ui";
import { eqSvg } from "../../data/equipment-icons";

export default function Plan() {
  useStore();
  // Workouts per week starts empty until the owner has saved a plan once.
  const [d, setD] = useState<number | null>(S.plan.set ? S.plan.days : null);
  const [s, setS] = useState(S.plan.split);
  const [custom, setCustom] = useState(false);
  const [txt, setTxt] = useState(S.plan.set ? String(S.plan.days) : "");
  const row = useRef<HTMLDivElement>(null);
  const sp = SPL[s], f = d ? Math.round(((d * sp.f) / sp.seq.length) * 10) / 10 : 0;
  const [alert] = useIonAlert();
  // Changes save as soon as they're picked. The rotation restarts only when the number of workouts
  // or the split really changes, and a workout with ticked sets is only reset after asking.
  const apply = (nd: number | null, ns: string) => {
    setD(nd);
    setS(ns);
    if (!nd || (S.plan.set && nd == S.plan.days && ns == S.plan.split)) return;
    const go = () => {
      S.plan = { days: nd, split: ns, i: 0, set: true };
      S.draft = null;
      commit();
    };
    const started = !!S.draft && Object.values(S.draft.sets).some(r => r.some(x => x.d));
    if (!started) return go();
    alert({
      header: "Change your plan?",
      message: "The workout you started (with ticked sets) will be reset. Your logged history stays.",
      buttons: [{ text: "Cancel", role: "cancel", handler: () => { setD(S.plan.set ? S.plan.days : null); setS(S.plan.split); } }, { text: "Change", role: "destructive", handler: go }],
    });
  };
  // Custom number: any whole number from 1 up. Applied with Set or Enter; tapping 1–7 cancels it.
  const n = +txt.trim(), ok = /^\d+$/.test(txt.trim()) && n >= 1;
  const applyCustom = () => {
    if (!ok) return;
    setCustom(false);
    apply(n, s);
    setTimeout(() => row.current && (row.current.scrollLeft = 9999), 30);
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
              {[1, 2, 3, 4, 5, 6, 7].map(x => <Chip key={x} on={d == x && !custom} onClick={() => {
                setCustom(false);
                apply(x, s);
              }}>{x}</Chip>)}
              <Chip on={(!!d && d > 7) || custom} onClick={() => {
                setTxt(d && d > 7 ? String(d) : "");
                setCustom(!custom);
                setTimeout(() => row.current && (row.current.scrollLeft = 9999), 30);
              }} label={d && d > 7 ? `Custom: ${d} workouts, tap to change` : "Custom number of workouts"}>
                {d && d > 7 ? <span className="cnum">{d}<Ico k="pen" s={13} /></span> : <Ico k="pen" s={16} />}
              </Chip>
            </div>
            {custom && (
              <div className="cust">
                <label htmlFor="cust-n">Custom number</label>
                <div className="row">
                  <span className="custf">
                    <input id="cust-n" type="number" inputMode="numeric" min={1} step={1} placeholder="e.g. 10" autoFocus value={txt}
                      onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key == "Enter" && applyCustom()} />
                    <span aria-hidden="true">per week</span>
                  </span>
                  <button disabled={!ok} onClick={applyCustom}>Set</button>
                </div>
                {txt.trim() != "" && !ok && <p className="mu" role="alert">Enter a whole number, 1 or more.</p>}
              </div>
            )}
          </div>
          <div className="card">
            <b>Split</b>
            {Object.entries(SPL).map(([k, v]) => (
              <button key={k} className={"opt" + (s == k ? " on" : "")} aria-pressed={s == k} onClick={() => apply(d, k)}>
                <b>{v.n}</b><span className="mu">{v.d}</span>
              </button>
            ))}
          </div>
          <p className="mu" style={{ margin: "6px 4px 12px" }}>
            {d ? `With this split, each muscle group is trained about ${f}× a week. Changes save automatically.` : "Choose how many workouts a week to start your plan."}
          </p>
        </div>
        <div className="col">
          <EquipmentCard />
        </div>
      </div>
    </Page>
  );
}

function EquipmentCard() {
  const e = Array.isArray(S.eq) ? S.eq : [];
  const [open, setOpen] = useState(false);
  // Nothing ticked and everything ticked both mean "use all equipment".
  const total = EQL.reduce((n, [, a]) => n + a.length, 0), all = !e.length || e.length >= total;
  const items = `${e.length} item${e.length == 1 ? "" : "s"}`;
  return (
    <div className="card">
      <button className="fh eqh" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>
          <b>Available equipment</b>
          <span className={"eqc" + (all ? "" : " on")}>{all ? "All equipment" : `${items} selected`}</span>
        </span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <>
          <div className="eqn">
            <p>
              {!e.length ? "Tick what your gym has to see only those exercises." : all ? "Every item is ticked." : `Exercises for ${e.length == 1 ? "this item" : `these ${items}`} plus bodyweight.`}
            </p>
            {e.length > 0 && <button className="g s" style={{ flex: "none" }} onClick={eqClr}>Clear</button>}
          </div>
          {EQL.map(([g, a]) => (
            <div className="eqg" key={g}>
              <span className="eyebrow mu">{g}</span>
              <div className="eqt">
                {a.map(([k, l]) => (
                  <button key={k} className={"eqi" + (e.includes(k) ? " on" : "")} aria-pressed={e.includes(k)} onClick={() => eqTog(k)}>
                    <Svg as="span" className="eqp" html={eqSvg(k)} />
                    <span>{l}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
