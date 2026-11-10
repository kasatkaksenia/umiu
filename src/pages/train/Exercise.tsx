import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { CD, EX } from "../../data/exercises";
import { fig, figSvg } from "../../lib/figures";
import { S, useStore } from "../../lib/store";
import { adv, cleanNum, dr, muscles, rowOp, rowsOf, setDone, setTxt, setVal } from "../../lib/train";
import { BackButton, Page } from "../../components/layout";
import { FigAnim, Svg } from "../../components/ui";
import { dmy } from "../../lib/util";
import { WU, isLb, wIn, wOut } from "../../lib/units";

export function ExerciseScreen() {
  useStore();
  const { id } = useParams<{ id: string }>();
  const e = EX[id];
  if (!e) return <Page><BackButton fallback="/train" /><p className="mu">Exercise not found.</p></Page>;
  return (
    <Page title={e[0]}>
      <BackButton fallback="/train" />
      <h1>{e[0]}</h1>
      <Swipe id={id}>
      <div className="cols c-even">
        <div className="col">
          <div className="card">
            <FigAnim id={id} />
            <p className="mu" style={{ textAlign: "center", margin: "2px 0 0" }}>Schematic demo · tap to pause</p>
          </div>
          <div className="card">
            <b>How to perform</b>
            <ol>{e[4].split("|").map((t, i) => <li key={i}>{t}</li>)}</ol>
            <div className="row" style={{ alignItems: "center" }}>
              <Svg style={{ flex: "none", width: 120 }} html={fig(e[1], e[2])} />
              <div className="mu">
                Main: {muscles(e[1])}
                {e[2] && <><br />Helping: {muscles(e[2])}</>}
                <br />{CD[id] ? "Cardio: log time and speed" : <>Target: {e[3]} reps</>}
              </div>
            </div>
            <p style={{ margin: "8px 0 0" }}>
              <a style={{ color: "var(--ac)", fontWeight: 600 }} target="_blank" rel="noopener"
                href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(e[0] + " proper form")}>▶ Real video demos on YouTube</a>
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card sticky">
            <b>Sets</b>
            <p className="mu" style={{ margin: "2px 0 8px" }}>💡 {adv(id)}</p>
            <SetsTable id={id} />
          </div>
        </div>
      </div>
      </Swipe>
    </Page>
  );
}

/**
 * Exercises of the current workout: a strip of all of them (tap to jump) and a left/right swipe
 * anywhere on the screen to go to the next / previous one. Only shown when the exercise is in the workout.
 */
function Swipe({ id, children }: { id: string; children: React.ReactNode }) {
  const r = useIonRouter();
  const ids = dr().ids, i = ids.indexOf(id);
  const strip = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null);
  const go = (j: number) => j >= 0 && j < ids.length && j != i && r.push("/train/ex/" + ids[j], j > i ? "forward" : "back", "replace");
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    const st = strip.current, el = st?.querySelector<HTMLElement>(".on");
    if (st && el) st.scrollLeft = el.offsetLeft - (st.clientWidth - el.offsetWidth) / 2;
  }, [id]);
  // The swipe listens on the whole screen (header and empty space below the cards too), not just the cards.
  useEffect(() => {
    const pg = box.current?.closest<HTMLElement>(".ion-page");
    if (!pg || i < 0) return;
    let t0: { x: number; y: number } | null = null;
    const start = (ev: TouchEvent) => {
      const p = ev.touches[0], tg = ev.target as HTMLElement;
      // Leave the screen edge to the iOS back gesture, let the strip scroll on its own, ignore multi-touch.
      t0 = ev.touches.length > 1 || p.clientX < 28 || tg.closest(".exs, .ov") ? null : { x: p.clientX, y: p.clientY };
    };
    const end = (ev: TouchEvent) => {
      const a = t0, p = ev.changedTouches[0];
      t0 = null;
      if (!a) return;
      const dx = p.clientX - a.x, dy = p.clientY - a.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goRef.current(dx < 0 ? i + 1 : i - 1);
    };
    pg.addEventListener("touchstart", start, { passive: true });
    pg.addEventListener("touchend", end, { passive: true });
    return () => {
      pg.removeEventListener("touchstart", start);
      pg.removeEventListener("touchend", end);
    };
  }, [i]);
  if (i < 0) return <div ref={box}>{children}</div>;
  return (
    <div ref={box}>
      <div className="exs" ref={strip} role="list" aria-label="Exercises in this workout">
        {ids.map((k, j) => {
          const R = rowsOf(k), n = R.filter(x => x.d).length;
          return (
            <button key={k} role="listitem" className={(j == i ? "on" : "") + (n && n == R.length ? " dn" : "")} aria-current={j == i} aria-label={`${j + 1}. ${EX[k][0]}, ${n} of ${R.length} done`} onClick={() => go(j)}>
              <Svg as="span" html={figSvg(k, 0)} />
              <span className="exn">{j + 1}</span>
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}

function SetsTable({ id }: { id: string }) {
  const R = rowsOf(id), C = CD[id];
  // [field, column heading, keyboard, accessible name]
  const cols: [("r" | "w" | "i"), string, "numeric" | "decimal", string][] = C
    ? C.map(c => [c[0] as "r" | "w" | "i", c[1], "decimal", c[1]])
    : [["w", WU(), "decimal", "Weight"], ["r", "Reps", "numeric", "Reps"]];
  const unit = C ? "block" : "set";
  return (
    <table className="tb">
      <thead>
        <tr><th>#</th>{cols.map(c => <th key={c[0]}>{c[1]}</th>)}<th>Done</th></tr>
      </thead>
      <tbody>
        {R.map((x, j) => (
          <tr key={j} className={x.d ? "dn" : ""}>
            <td>{j + 1}</td>
            {cols.map(([k, , im, l]) => (
              <td key={k}>
                <SetInput id={id} j={j} k={k} im={im} label={`${l} ${unit} ${j + 1}`} value={x[k]} />
              </td>
            ))}
            <td>
              <input type="checkbox" className="ck" aria-label={`${C ? "Block" : "Set"} ${j + 1} done`} checked={x.d} onChange={ev => setDone(id, j, ev.target.checked)} />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={cols.length + 2}>
            <div className="row">
              <button className="g" aria-label={`Remove last ${unit}`} onClick={() => rowOp(id, -1)}>−</button>
              <button className="g" aria-label={`Add ${unit}`} onClick={() => rowOp(id, 1)}>+</button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/** One cell of the sets table. Keeps the typed text (e.g. "62." on the way to "62.5") and stores the number. */
function SetInput({ id, j, k, im, label, value }: { id: string; j: number; k: "r" | "w" | "i"; im: "numeric" | "decimal"; label: string; value: number | "" | undefined }) {
  // Weights are stored in kg and shown in the chosen unit (kg or lb).
  const conv = k == "w" && !CD[id] && isLb();
  const shown = value == null || value === "" ? "" : String(conv ? wOut(+value, 2) : value);
  const [txt, setTxt] = useState(shown);
  useEffect(() => {
    // Only replace what's typed when the stored value really changed (lb ↔ kg rounding is ignored).
    if (txt === "" ? shown !== "" : Math.abs(+txt - +shown) > (conv ? 0.06 : 0)) setTxt(shown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);
  return (
    <input type="text" inputMode={im} pattern={im == "numeric" ? "[0-9]*" : undefined} aria-label={label} value={txt}
      onChange={ev => {
        const v = cleanNum(id, k, ev.target.value);
        setTxt(v);
        const n = v == "." ? "" : v;
        setVal(id, j, k, conv && n !== "" ? String(Math.round(wIn(+n) * 1000) / 1000) : n);
      }} />
  );
}

export function ExerciseHistory() {
  useStore();
  const { id } = useParams<{ id: string }>();
  const H = S.hist.filter(w => w.it.some(x => x.id == id)).reverse();
  return (
    <Page title={EX[id]?.[0] || "History"}>
      <BackButton fallback="/train" />
      <h1>{EX[id]?.[0]}</h1>
      <p className="mu">History</p>
      <div className="grid-cards">
        {H.length ? H.map((w, i) => {
          const x = w.it.find(y => y.id == id)!;
          return (
            <div className="card" key={i}>
              <b>{dmy(w.d)}</b> <span className="mu">{w.n}</span>
              {x.s.map((s, j) => <div className="li" key={j}><span className="mu">Set {j + 1}</span><span>{setTxt(id, s)}</span></div>)}
            </div>
          );
        }) : <p className="mu">No logged sessions yet.</p>}
      </div>
    </Page>
  );
}
