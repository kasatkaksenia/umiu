import { useParams } from "react-router-dom";
import { CD, EX } from "../../data/exercises";
import { fig } from "../../lib/figures";
import { S, useStore } from "../../lib/store";
import { adv, cleanNum, muscles, rowOp, rowsOf, setDone, setTxt, setVal } from "../../lib/train";
import { BackButton, Page } from "../../components/layout";
import { FigAnim, Svg } from "../../components/ui";

export function ExerciseScreen() {
  useStore();
  const { id } = useParams<{ id: string }>();
  const e = EX[id];
  if (!e) return <Page><BackButton fallback="/train" /><p className="mu">Exercise not found.</p></Page>;
  return (
    <Page title={e[0]}>
      <BackButton fallback="/train" />
      <h1>{e[0]}</h1>
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
                <br />{CD[id] ? "Cardio: log time and speed" : "Target: " + e[3] + " reps"}
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
    </Page>
  );
}

function SetsTable({ id }: { id: string }) {
  const R = rowsOf(id), C = CD[id];
  // [field, column heading, keyboard, accessible name]
  const cols: [("r" | "w" | "i"), string, "numeric" | "decimal", string][] = C
    ? C.map(c => [c[0] as "r" | "w" | "i", c[1], "decimal", c[1]])
    : [["r", "Reps", "numeric", "Reps"], ["w", "kg", "decimal", "Weight"]];
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
                <input type="text" inputMode={im} pattern={im == "numeric" ? "[0-9]*" : undefined} aria-label={`${l} ${unit} ${j + 1}`}
                  value={x[k] == null ? "" : String(x[k])} onChange={ev => setVal(id, j, k, cleanNum(id, k, ev.target.value))} />
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
              <b>{w.d}</b> <span className="mu">{w.n}</span>
              {x.s.map((s, j) => <div className="li" key={j}><span className="mu">Set {j + 1}</span><span>{setTxt(id, s)}</span></div>)}
            </div>
          );
        }) : <p className="mu">No logged sessions yet.</p>}
      </div>
    </Page>
  );
}
