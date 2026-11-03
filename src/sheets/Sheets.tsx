// Every pop-up sheet in the app. The open sheet lives in UI.sheet; SheetHost draws it.
import { ReactNode, useEffect, useRef, useState } from "react";
import { useIonAlert } from "@ionic/react";
import { EX, FOC, MN } from "../data/exercises";
import { EL, TL, WID } from "../data/cycle";
import { figSvg } from "../lib/figures";
import { S, Sheet, UI, commit, exportData, importData, openSheet, render, useStore } from "../lib/store";
import { addEx, chWk, delWk, dr, ensureLib, eqOk, ewDo, ewName, ewRm, genWk, libOf, newWk, swapList, swapTo } from "../lib/train";
import { gPct, gpInfo, resizeImage } from "../lib/food";
import { phase, qClr, qList, qTog, wOn, wTog } from "../lib/cycle";
import { PEND, PHOTOS, delPhoto, savePending, selCollage } from "../lib/photos";
import { A_, download } from "../lib/util";
import { Chip, ExOption, FileButton, Ico, Svg, exMatches } from "../components/ui";

export function SheetHost() {
  useStore();
  const s = UI.sheet;
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!s) return;
    const k = (e: KeyboardEvent) => e.key == "Escape" && openSheet(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [s]);
  useEffect(() => {
    if (s && box.current && !box.current.contains(document.activeElement)) box.current.focus();
  }, [s?.t]);
  if (!s) return null;
  const { title, body } = content(s);
  return (
    <div className="ov" onClick={() => openSheet(null)}>
      <div className="sh" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={box} onClick={e => e.stopPropagation()}>
        <div className="row sh-head">
          <b style={{ fontSize: 18 }}>{title}</b>
          <button className="g s" style={{ flex: "none" }} onClick={() => openSheet(null)}>Close</button>
        </div>
        <div className="sh-body">{body}</div>
      </div>
    </div>
  );
}

function content(s: Sheet): { title: string; body: ReactNode } {
  switch (s.t) {
    case "swap": return { title: "Swap " + EX[s.id][0], body: <SwapList id={s.id} ok={k => !dr().ids.includes(k)} pick={k => swapTo(s.id, k)} key={s.id} /> };
    case "add": return { title: "Add exercise", body: <AddList ok={k => !dr().ids.includes(k)} pick={addEx} /> };
    case "wk": return { title: "Choose workout", body: <ChooseWorkout del={s.del || null} /> };
    case "ew": return libOf(s.k) ? { title: "Edit workout", body: <EditWorkout k={s.k} key={s.k} /> } : { title: "Choose workout", body: <ChooseWorkout del={null} /> };
    case "ewp": {
      const L = libOf(s.k) || { ids: [] as string[] };
      return s.m == "swap"
        ? { title: "Swap " + EX[s.id!][0], body: <SwapList id={s.id!} ok={k => !L.ids.includes(k)} pick={k => ewDo(s.k, "swap", s.id!, k)} /> }
        : { title: "Add exercise", body: <AddList ok={k => !L.ids.includes(k)} pick={k => ewDo(s.k, "add", "", k)} /> };
    }
    case "ai": return { title: "Generate a workout", body: <Generate s={s} /> };
    case "wid": return { title: "Widgets", body: <Widgets /> };
    case "cm": return { title: "Add your meal", body: <CustomMeal /> };
    case "pnd": return { title: "Which angle is each photo?", body: <Pending /> };
    case "col": return { title: "Your progress", body: <Collages s={s} /> };
    case "csel": return { title: "Choose photos", body: <ChoosePhotos s={s} /> };
    case "qf": return { title: "Choose quotes", body: <QuoteFilter /> };
    case "gp": return { title: "Goal", body: <GoalPct /> };
    case "goals": return { title: "Set calorie goal manually", body: <ManualGoals /> };
    case "look": case "data": return { title: "Style & data", body: <Look /> };
    case "pho": {
      const p = PHOTOS.find(x => x.id == s.id);
      return { title: p ? p.d + " · " + (p.lab || "Photo") : "Photo", body: <PhotoView s={s} /> };
    }
  }
}

/* ---------- exercises ---------- */
function Search({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return <input placeholder="Search exercises" aria-label="Search exercises" value={q} onChange={e => setQ(e.target.value)} style={{ margin: "10px 0" }} />;
}
function SwapList({ id, ok, pick }: { id: string; ok: (k: string) => boolean; pick: (k: string) => void }) {
  const [q, setQ] = useState("");
  const { same, other } = swapList(id, ok);
  const f = (l: typeof same) => l.filter(x => exMatches(x.k, q));
  const A = f(same), B = f(other);
  return (
    <>
      <Search q={q} setQ={setQ} />
      {A.length > 0 && <><div className="mu grp">Same muscle group</div>{A.map(x => <ExOption key={x.k} k={x.k} badge={x.pct + "% match"} onPick={() => pick(x.k)} />)}</>}
      {B.length > 0 && <><div className="mu grp">Other muscle groups</div>{B.map(x => <ExOption key={x.k} k={x.k} badge={x.pct + "% match"} onPick={() => pick(x.k)} />)}</>}
    </>
  );
}
function AddList({ ok, pick }: { ok: (k: string) => boolean; pick: (k: string) => void }) {
  const [q, setQ] = useState("");
  const ks = Object.keys(EX).filter(k => ok(k) && eqOk(k) && exMatches(k, q));
  return (
    <>
      <Search q={q} setQ={setQ} />
      {ks.map(k => <ExOption key={k} k={k} onPick={() => pick(k)} />)}
    </>
  );
}

function ChooseWorkout({ del }: { del: string | null }) {
  ensureLib();
  const cur = dr().n;
  return (
    <>
      {S.lib!.map(w => del == w.k ? (
        <div className="dlg" role="alertdialog" aria-label="Delete workout" key={w.k}>
          <b>Delete “{w.n}”?</b>
          <p className="mu">This removes it from your workout list. Your logged history stays.</p>
          <div className="row">
            <button className="g" onClick={() => openSheet({ t: "wk", del: null })}>Cancel</button>
            <button className="dg" onClick={() => delWk(w.k)}>Delete</button>
          </div>
        </div>
      ) : (
        <div className="row wr" key={w.k}>
          <button className={"opt" + (w.k == cur ? " on" : "")} aria-pressed={w.k == cur} onClick={() => chWk(w.k)}>
            <b>{w.n}</b><span className="mu">{w.ids.length ? w.ids.length + " exercises" : "Empty"}</span>
          </button>
          <button className="g s ic" aria-label={`Edit ${w.n}`} onClick={() => openSheet({ t: "ew", k: w.k })}>✎</button>
          <button className="g s ic" aria-label={`Delete ${w.n}`} onClick={() => openSheet({ t: "wk", del: w.k })}>✕</button>
        </div>
      ))}
      <div className="row" style={{ marginTop: 12 }}>
        <button className="g" onClick={newWk}>+ New workout</button>
        <button onClick={() => openSheet({ t: "ai", f: [] })}>Generate a workout</button>
      </div>
    </>
  );
}

function EditWorkout({ k }: { k: string }) {
  const L = libOf(k)!;
  const [name, setName] = useState(L.n);
  return (
    <>
      <input maxLength={32} value={name} aria-label="Workout name" onChange={e => setName(e.target.value)} onBlur={() => ewName(k, name)} style={{ margin: "10px 0" }} />
      {L.ids.length ? L.ids.map(id => (
        <div className="row wr" key={id}>
          <Svg as="span" className="oth" style={{ flex: "none", width: 64 }} html={figSvg(id, 1)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{EX[id][0]}</b>
            <div className="mu">{EX[id][1].split(",").map(m => MN[m]).join(", ")}</div>
          </div>
          <button className="g s ic" aria-label={`Swap ${EX[id][0]}`} onClick={() => openSheet({ t: "ewp", k, m: "swap", id })}>⇄</button>
          <button className="g s ic" aria-label={`Remove ${EX[id][0]}`} onClick={() => ewRm(k, id)}>✕</button>
        </div>
      )) : <p className="mu">No exercises yet. Add one below.</p>}
      <div className="row" style={{ marginTop: 12 }}>
        <button className="g" onClick={() => {
          ewName(k, name);
          openSheet({ t: "ewp", k, m: "add" });
        }}>+ Add exercise</button>
        <button onClick={() => {
          ewName(k, name);
          openSheet({ t: "wk" });
        }}>Done</button>
      </div>
    </>
  );
}

function Generate({ s }: { s: Extract<Sheet, { t: "ai" }> }) {
  const [n, setN] = useState(s.n || 6);
  const [eq, setEq] = useState(s.e || "Mixed");
  const [st, setSt] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <p className="mu">Pick one or more focus areas.</p>
      <div>
        {FOC.map(f => <Chip key={f} on={s.f.includes(f)} onClick={() => {
          const i = s.f.indexOf(f);
          i < 0 ? s.f.push(f) : s.f.splice(i, 1);
          render();
        }}>{f}</Chip>)}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <div>
          <span className="mu">Exercises</span>
          <select aria-label="Number of exercises" value={n} onChange={e => setN(+e.target.value)}>{[4, 5, 6, 7, 8].map(x => <option key={x}>{x}</option>)}</select>
        </div>
        <div>
          <span className="mu">Equipment</span>
          <select aria-label="Equipment" value={eq} onChange={e => setEq(e.target.value)}>{["Mixed", "Machines", "Dumbbells"].map(x => <option key={x}>{x}</option>)}</select>
        </div>
      </div>
      <button style={{ width: "100%", marginTop: 12 }} disabled={busy} onClick={async () => {
        if (!s.f.length) {
          setSt("Pick at least one focus area.");
          return;
        }
        setBusy(true);
        setSt("Designing your workout…");
        await genWk(s.f, n, eq);
      }}>Generate</button>
      <p className="mu" role="status">{st}</p>
    </>
  );
}

/* ---------- cycle ---------- */
function Widgets() {
  return (
    <>
      <p className="mu">Show or hide sections of the Cycle tab.</p>
      {WID.map(([k, l]) => (
        <button key={k} className={"opt" + (wOn(k) ? " on" : "")} aria-pressed={wOn(k)} onClick={() => wTog(k)}>
          <b>{l}</b><span className="mu">{wOn(k) ? "Shown" : "Hidden"}</span>
        </button>
      ))}
    </>
  );
}
function QuoteFilter() {
  const p = phase(), t = A_<string>(S.set.qt), e = A_<string>(S.set.qe);
  return (
    <>
      <p className="mu">{qList(p).length} quotes match.</p>
      <div className="mu" style={{ margin: "10px 0 4px" }}>Type</div>
      <div className="hs wrapc">
        <Chip on={!t.length} onClick={() => qClr("qt")}>All</Chip>
        {Object.entries(TL).map(([v, x]) => <Chip key={v} on={t.includes(v)} onClick={() => qTog("qt", v)}>{x}</Chip>)}
      </div>
      <div className="mu" style={{ margin: "10px 0 4px" }}>Element</div>
      <div className="hs wrapc">
        <Chip on={!e.length && !S.set.qph} onClick={() => qClr("qe")}>All</Chip>
        {p && <Chip on={!!S.set.qph} onClick={() => {
          S.set.qph = S.set.qph ? 0 : 1;
          S.set.q = 0;
          commit();
        }}>My phase</Chip>}
        {Object.entries(EL).map(([v, x]) => <Chip key={v} on={e.includes(v)} onClick={() => qTog("qe", v)}>{x}</Chip>)}
      </div>
      <button style={{ width: "100%", marginTop: 12 }} onClick={() => openSheet(null)}>Done</button>
    </>
  );
}

/* ---------- food ---------- */
function CustomMeal() {
  const [f, setF] = useState({ t: "", p: "", k: "", c: "", fat: "", m: "", ing: "", st: "" });
  const [img, setImg] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const num = (v: string) => Math.round(+v) || 0;
  const lines = (v: string) => v.split("\n").map(x => x.trim()).filter(Boolean);
  const N = (k: keyof typeof f, l: string) => (
    <div><span className="mu">{l}</span><input type="number" inputMode="decimal" aria-label={l} value={f[k]} onChange={set(k)} /></div>
  );
  return (
    <>
      <input placeholder="Meal name" aria-label="Meal name" maxLength={60} value={f.t} onChange={set("t")} style={{ marginTop: 10 }} />
      <div className="row" style={{ marginTop: 8 }}>{N("p", "Protein g")}{N("k", "kcal")}{N("c", "Carbs g")}</div>
      <div className="row" style={{ marginTop: 8 }}>{N("fat", "Fat g")}{N("m", "Minutes")}</div>
      <textarea rows={4} placeholder="Ingredients, one per line (e.g. 150 g chicken breast)" aria-label="Ingredients" value={f.ing} onChange={set("ing")} />
      <textarea rows={3} placeholder="Steps, one per line" aria-label="Steps" value={f.st} onChange={set("st")} />
      <div className="row" style={{ marginTop: 8 }}>
        <FileButton accept="image/*" onFiles={async fl => {
          setImg(await resizeImage(fl[0], 360, 0.6, 1e9));
          setMsg("Photo added ✓");
        }}><Ico k="cam" /> Add photo</FileButton>
        <button onClick={() => {
          const t = f.t.trim().slice(0, 60);
          if (!t) {
            setMsg("Give the meal a name.");
            return;
          }
          const ing = lines(f.ing);
          S.rec.push({ t, p: num(f.p), k: num(f.k), c: num(f.c), f: num(f.fat), m: num(f.m) || 20, ing: ing.length ? ing : ["(no ingredients listed)"], st: lines(f.st), cu: 1, ...(img ? { img } : {}) });
          UI.sheet = null;
          commit();
        }}>Save meal</button>
      </div>
      <p className="mu" role="status">{msg}</p>
    </>
  );
}

function GoalPct() {
  const [v, setV] = useState(String(gPct()));
  return (
    <>
      <p className="mu">Choose how much of your daily calories to cut or add. Fat loss is a negative percentage.</p>
      <div className="hs" style={{ marginTop: 8 }}>
        {[-15, -10, -5, 0, 5, 10].map(x => <Chip key={x} on={+v == x} onClick={() => setV(String(x))}>{x > 0 ? "+" : ""}{x}%</Chip>)}
      </div>
      <span className="mu">Percent of daily calories (−30 to +25)</span>
      <input type="number" step="0.5" min={-30} max={25} inputMode="decimal" aria-label="Percent of daily calories" value={v} onChange={e => setV(e.target.value)} style={{ marginTop: 4 }} />
      <p style={{ margin: "10px 0" }} role="status">{gpInfo(v)}</p>
      <button style={{ width: "100%" }} onClick={() => {
        const x = Math.max(-30, Math.min(25, +v || 0));
        S.prof.g = Math.round(x * 10) / 1000;
        UI.sheet = null;
        commit();
      }}>Apply</button>
    </>
  );
}

function ManualGoals() {
  const [g, setG] = useState({ k: String(S.goal.k), p: String(S.goal.p), c: String(S.goal.c), f: String(S.goal.f) });
  return (
    <>
      <div className="row" style={{ marginTop: 10 }}>
        {([["k", "kcal"], ["p", "protein g"], ["c", "carbs g"], ["f", "fat g"]] as const).map(([x, l]) => (
          <div key={x}><span className="mu">{l}</span><input type="number" inputMode="numeric" aria-label={l} value={g[x]} onChange={e => setG({ ...g, [x]: e.target.value })} /></div>
        ))}
      </div>
      <button style={{ width: "100%", marginTop: 12 }} onClick={() => {
        S.goal = { k: +g.k || 0, p: +g.p || 0, c: +g.c || 0, f: +g.f || 0 };
        UI.sheet = null;
        commit();
      }}>Save goals</button>
    </>
  );
}

/* ---------- photos ---------- */
function Pending() {
  const [, force] = useState(0);
  const [msg, setMsg] = useState("");
  return (
    <>
      <p className="mu">Pick Front, Side or Back for every photo.</p>
      {PEND.map((x, i) => (
        <div className="row pnr" style={{ alignItems: "center", margin: "8px 0" }} key={i}>
          <img className="pth" alt="" src={x.img} />
          <select aria-label={`Angle for photo ${i + 1}`} value={x.lab} onChange={e => {
            PEND[i].lab = e.target.value;
            force(n => n + 1);
          }}>{["Front", "Side", "Back"].map(l => <option key={l}>{l}</option>)}</select>
        </div>
      ))}
      <button style={{ width: "100%", marginTop: 6 }} onClick={async () => {
        setMsg("Saving…");
        await savePending();
      }}>Save {PEND.length} photo{PEND.length > 1 ? "s" : ""}</button>
      <p className="mu" role="status">{msg}</p>
    </>
  );
}
function Collages({ s }: { s: Extract<Sheet, { t: "col" }> }) {
  if (!s.items) return <p className="mu" role="status">{s.msg || ""}</p>;
  return (
    <>
      {s.items.map((it, i) => (
        <div style={{ marginTop: 12 }} key={i}>
          <b>{it.title}</b>
          <img alt={`${it.title} collage`} src={it.img} style={{ width: "100%", borderRadius: 18, marginTop: 6 }} />
          <div className="row" style={{ marginTop: 8, alignItems: "center" }}>
            <button onClick={() => download("umiu-" + it.title.toLowerCase().replace(/\W+/g, "-") + ".png", it.img)}>Save image</button>
          </div>
        </div>
      ))}
    </>
  );
}
function ChoosePhotos({ s }: { s: Extract<Sheet, { t: "csel" }> }) {
  const n = s.sel.length;
  return (
    <>
      <p className="mu">Pick 2 to 4 photos. They go side by side, oldest first.</p>
      <div className="pg">
        {PHOTOS.map(p => {
          const on = s.sel.includes(p.id);
          return (
            <button key={p.id} className={"pt" + (on ? " sel" : "")} aria-pressed={on} onClick={() => {
              const i = s.sel.indexOf(p.id);
              i < 0 ? s.sel.length < 4 && s.sel.push(p.id) : s.sel.splice(i, 1);
              render();
            }}>
              <img alt="" src={p.img} /><span>{p.d.slice(5)} · {p.lab || ""}</span>
            </button>
          );
        })}
      </div>
      <button style={{ width: "100%", marginTop: 10 }} disabled={n < 2} onClick={() => selCollage(s.sel)}>Create collage{n ? ` (${n})` : ""}</button>
    </>
  );
}
function PhotoView({ s }: { s: Extract<Sheet, { t: "pho" }> }) {
  const p = PHOTOS.find(x => x.id == s.id);
  if (!p) return null;
  return (
    <>
      <img alt="Progress photo" src={p.img} style={{ width: "100%", borderRadius: 20, margin: "10px 0" }} />
      <p className="mu">{p.w ? p.w + " kg" : ""}</p>
      {s.del ? (
        <div className="row">
          <button className="dg" onClick={() => delPhoto(p.id)}>Delete photo</button>
          <button className="g" onClick={() => openSheet({ ...s, del: false })}>Cancel</button>
        </div>
      ) : <button className="g" onClick={() => openSheet({ ...s, del: true })}>Delete</button>}
    </>
  );
}

/* ---------- style and backup ---------- */
const LOOKS: [string, string, string][] = [
  ["b", "Cerulean & soil", "Sky blue, ivory and warm brown"],
  ["u", "Urban glow", "City dusk and soft bokeh in blush and mauve"],
  ["p", "Bright pop", "Cerulean blue and soil brown, with cream and red accents"],
  ["w", "Clean white", "White and simple, like Apple Health"],
];
export const lookOf = () => (["u", "p", "w"].includes(S.set.look) ? S.set.look : "b");
function Look() {
  const [msg, setMsg] = useState("");
  const [alert] = useIonAlert();
  return (
    <>
      {LOOKS.map(([k, n, d]) => (
        <button key={k} className={"opt" + (lookOf() == k ? " on" : "")} aria-pressed={lookOf() == k} onClick={() => {
          S.set.look = k;
          commit();
        }}><b>{n}</b><span className="mu">{d}</span></button>
      ))}
      <h3 className="sh-sub">Your data</h3>
      <p className="mu" style={{ marginTop: 0 }}>
        Everything is saved in this browser only. Download a backup to keep it safe or to move it to another device. Progress photos aren’t included.
      </p>
      <div className="row">
        <button className="g" onClick={() => {
          const url = URL.createObjectURL(new Blob([exportData()], { type: "application/json" }));
          download(`umiu-backup-${new Date().toISOString().slice(0, 10)}.json`, url);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          setMsg("Backup downloaded.");
        }}>Download backup</button>
        <FileButton className="lab" accept="application/json,.json" onFiles={async f => {
          const txt = await f[0].text();
          alert({
            header: "Restore this backup?",
            message: "It replaces all workouts, food logs and cycle data in this browser.",
            buttons: [{ text: "Cancel", role: "cancel" }, {
              text: "Restore", role: "destructive", handler: () => {
                try {
                  importData(txt);
                } catch {
                  setMsg("That file isn’t a umiu backup.");
                }
              },
            }],
          });
        }}>Restore backup</FileButton>
      </div>
      <p className="mu" role="status">{msg}</p>
    </>
  );
}
