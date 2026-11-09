// Every pop-up sheet in the app. The open sheet lives in UI.sheet; SheetHost draws it.
import { ReactNode, useEffect, useRef, useState } from "react";
import { useIonAlert } from "@ionic/react";
import { EX, FOC, MN, SPL } from "../data/exercises";
import { EL, TL, WID } from "../data/cycle";
import { figSvg } from "../lib/figures";
import { S, Sheet, UI, commit, openSheet, render, useStore } from "../lib/store";
import { addEx, chWk, delWk, dr, ensureLib, eqOk, isCustom, planKeys, UNDO_MS, ewDo, ewLeave, ewRename, ewRm, ewUndo, ewUndoMsg, genWk, libOf, nameOf, exOrder, newWk, swapList, swapTo } from "../lib/train";
import { MealIng, RF, analyseMeal, gPct, gpInfo, recipesShown, resizeImage, rfChips, rfReset, searchIngredients } from "../lib/food";
import { ai } from "../lib/ai";
import { CATS, FD } from "../data/foods";
import { phase, qClr, qList, qTog, wOn, wTog } from "../lib/cycle";
import { PEND, PHOTOS, delPhoto, savePending, selCollage } from "../lib/photos";
import { A_, TODAY, dmy, download } from "../lib/util";
import { Chip, ExOption, FileButton, Ico, Svg, exMatches } from "../components/ui";
import { NT_TOPICS, ntList } from "../data/tips";

export function SheetHost() {
  useStore();
  const s = UI.sheet;
  const box = useRef<HTMLDivElement>(null);
  // Closing: the add/swap list goes back to the workout editor. The editor saves as you go, so it just closes.
  const close = () => {
    const c = UI.sheet;
    if (c?.t == "ewp") return openSheet({ t: "ew", k: c.k });
    if (c?.t == "ew") ewLeave(c.k);
    openSheet(null);
  };
  useEffect(() => {
    if (!s) return;
    const k = (e: KeyboardEvent) => e.key == "Escape" && !document.querySelector("ion-alert") && close();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [s]);
  useEffect(() => {
    if (s && box.current && !box.current.contains(document.activeElement)) box.current.focus();
  }, [s?.t]);
  if (!s) return null;
  const { title, body, head } = content(s);
  return (
    <div className="ov" onClick={close}>
      <div className="sh" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={box} onClick={e => e.stopPropagation()}>
        <div className="row sh-head">
          <b style={{ fontSize: 18 }}>{title}</b>
          {head !== undefined ? head : <button className="g s" style={{ flex: "none" }} onClick={close}>{s.t == "ewp" ? "Back" : "Close"}</button>}
        </div>
        <div className="sh-body">{body}</div>
      </div>
    </div>
  );
}

/** head: replaces the header's Close button (null = no button; the sheet closes from its own button or a tap outside). */
function content(s: Sheet): { title: string; body: ReactNode; head?: ReactNode } {
  switch (s.t) {
    case "swap": return { title: "Swap " + EX[s.id][0], body: <SwapList id={s.id} ok={k => !dr().ids.includes(k)} pick={k => swapTo(s.id, k)} key={s.id} /> };
    case "add": return { title: "Add exercises", body: <AddMany ok={k => !dr().ids.includes(k)} done={addEx} name={nameOf(dr().n)} /> };
    case "wk": return { title: "Choose workout", body: <ChooseWorkout /> };
    case "ew": return libOf(s.k)
      ? { title: "Edit workout", body: <EditWorkout k={s.k} key={s.k} />, head: <button className="g s" style={{ flex: "none" }} onClick={() => { ewLeave(s.k); openSheet({ t: "wk" }); }}>‹ Back</button> }
      : { title: "Choose workout", body: <ChooseWorkout /> };
    case "ewp": {
      const L = libOf(s.k) || { ids: [] as string[], n: "" };
      return s.m == "swap"
        ? { title: "Swap " + EX[s.id!][0], body: <SwapList id={s.id!} ok={k => !L.ids.includes(k)} pick={k => ewDo(s.k, "swap", s.id!, k)} /> }
        : { title: "Add exercises", body: <AddMany ok={k => !L.ids.includes(k)} done={ks => ewDo(s.k, "add", "", ks)} name={L.n} /> };
    }
    case "ai": return { title: "Generate a workout", body: <Generate s={s} /> };
    case "wid": return { title: "Widgets", body: <Widgets /> };
    case "cm": return { title: "Add your meal", body: <CustomMeal /> };
    case "mp": return { title: "Meal from photo", body: <MealPhoto s={s} key={s.url} /> };
    case "pnd": return { title: "Which angle is each photo?", body: <Pending /> };
    case "col": return { title: "Your progress", body: <Collages s={s} /> };
    case "csel": return { title: "Choose photos", body: <ChoosePhotos s={s} /> };
    case "qf": return { title: "Choose quotes", body: <QuoteFilter /> };
    case "ntf": return { title: "Nutrition tip topics", body: <TipFilter /> };
    case "rf": return { title: "Filter recipes", body: <RecipeFilter />, head: rfChips().length ? <button className="g s lnk" style={{ flex: "none" }} onClick={rfReset}>Reset</button> : null };
    case "gp": return { title: "Goal", body: <GoalPct /> };
    case "goals": return { title: "Set calorie goal manually", body: <ManualGoals /> };
    case "look": case "data": return { title: "Style", body: <Look /> };
    case "pho": {
      const p = PHOTOS.find(x => x.id == s.id);
      return { title: p ? dmy(p.d) + " · " + (p.lab || "Photo") : "Photo", body: <PhotoView s={s} /> };
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
/**
 * Exercises to add: ones that fit the workout name first (e.g. "Glute focus"), otherwise A–Z.
 * While searching, matches that need equipment the owner hasn't ticked show in a second group,
 * so a search never comes back empty just because of the equipment list.
 */
function addKs(ok: (k: string) => boolean, q: string, name: string) {
  const ks = Object.keys(EX).filter(k => ok(k) && exMatches(k, q)), srch = !!q.trim();
  return {
    main: exOrder(ks.filter(eqOk), name),
    more: srch ? exOrder(ks.filter(k => !eqOk(k)), name) : [],
    has: srch ? Object.keys(EX).filter(k => !ok(k) && exMatches(k, q)) : [],
  };
}
const MORE = "Needs equipment you haven’t ticked";
/** While searching, exercises already in the workout show greyed out instead of silently missing. */
const Has = ({ ks }: { ks: string[] }) => ks.length ? <><div className="mu grp">Already in this workout</div>{ks.map(k => <ExOption key={k} k={k} off badge="Added" onPick={() => {}} />)}</> : null;
/** Pick several exercises, then add them in one go. */
function AddMany({ ok, done, name }: { ok: (k: string) => boolean; done: (ks: string[]) => void; name: string }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const { main, more, has } = addKs(ok, q, name);
  const tog = (k: string) => setSel(sel.includes(k) ? sel.filter(x => x != k) : [...sel, k]);
  const opt = (k: string) => <ExOption key={k} k={k} on={sel.includes(k)} badge={sel.includes(k) ? "✓" : undefined} onPick={() => tog(k)} />;
  return (
    <>
      <Search q={q} setQ={setQ} />
      {main.map(opt)}
      {more.length > 0 && <><div className="mu grp">{MORE}</div>{more.map(opt)}</>}
      <Has ks={has} />
      {!main.length && !more.length && !has.length && <p className="mu">No exercises match “{q}”.</p>}
      <div className="addbar">
        <button style={{ width: "100%" }} disabled={!sel.length} onClick={() => done(sel)}>
          {sel.length ? `Add ${sel.length} exercise${sel.length > 1 ? "s" : ""}` : "Tap exercises to select"}
        </button>
      </div>
    </>
  );
}

function ChooseWorkout() {
  const [alert] = useIonAlert();
  ensureLib();
  const cur = dr().n, pk = planKeys();
  // Only the workouts of the current plan (split × workouts per week), plus the ones the owner made.
  const list = [...pk.map(k => libOf(k)).filter(Boolean), ...S.lib!.filter(w => isCustom(w.k))] as NonNullable<ReturnType<typeof libOf>>[];
  const ask = (w: (typeof list)[number]) => alert({
    header: `Delete “${w.n}”?`,
    message: "This removes it from your workout list. Your logged history stays.",
    buttons: [{ text: "Cancel", role: "cancel" }, { text: "Delete", role: "destructive", handler: () => delWk(w.k) }],
  });
  return (
    <>
      <p className="mu" style={{ margin: "4px 0 6px" }}>{SPL[S.plan.split].n} · {S.plan.days}× per week</p>
      <p className="mu" style={{ margin: "0 0 8px", fontSize: 13 }}>Tap a workout to edit it. “Do next” picks the one you train next.</p>
      {list.map(w => (
        <div className="row wr" key={w.k}>
          {/* The card opens the editor; the pill picks the next workout. */}
          <button className={"opt" + (w.k == cur ? " on" : "")} aria-label={`Edit ${w.n}`} onClick={() => openSheet({ t: "ew", k: w.k })}>
            <b>{w.n}</b><span className="mu">{w.ids.length ? w.ids.length + " exercises" : "Empty"}</span>
          </button>
          {w.k == cur
            ? <span className="nxt on" aria-label={`${w.n} is next`}>✓ Next</span>
            : <button className="nxt" aria-label={`Do ${w.n} next`} onClick={() => chWk(w.k)}>Do next</button>}
          <button className="g s ic" aria-label={`Delete ${w.n}`} onClick={() => ask(w)}>✕</button>
        </div>
      ))}
      <div className="row" style={{ marginTop: 12 }}>
        <button className="g" onClick={newWk}>+ New workout</button>
        <button onClick={() => openSheet({ t: "ai", f: [] })}><Ico k="magic" s={18} /> Generate</button>
      </div>
    </>
  )
}

/** Edit a workout. Every change saves at once; an Undo bar shows for a few seconds after each one. */
function EditWorkout({ k }: { k: string }) {
  const [alert] = useIonAlert();
  const L = libOf(k)!;
  const [name, setName] = useState(L.n);
  const [, tick] = useState(0);
  const um = ewUndoMsg(k);
  useEffect(() => {
    if (!um) return;
    const t = setTimeout(() => tick(x => x + 1), UNDO_MS + 50);
    return () => clearTimeout(t);
  }, [um, L.ids.join(), L.n]);
  const askRm = (id: string) => alert({
    header: `Remove “${EX[id][0]}”?`,
    message: "It comes off this workout. You can add it back any time.",
    buttons: [{ text: "Cancel", role: "cancel" }, { text: "Remove", role: "destructive", handler: () => ewRm(k, id) }],
  });
  return (
    <>
      <input maxLength={32} value={name} aria-label="Workout name" onChange={e => setName(e.target.value)} onBlur={() => ewRename(k, name)}
        onKeyDown={e => e.key == "Enter" && (e.target as HTMLInputElement).blur()} style={{ margin: "10px 0" }} />
      {L.ids.length ? L.ids.map(id => (
        <div className="row wr" key={id}>
          <Svg as="span" className="oth" style={{ flex: "none", width: 64 }} html={figSvg(id, 1)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <b>{EX[id][0]}</b>
            <div className="mu">{EX[id][1].split(",").map(m => MN[m]).join(", ")}</div>
          </div>
          <button className="g s ic" aria-label={`Swap ${EX[id][0]}`} onClick={() => openSheet({ t: "ewp", k, m: "swap", id })}>⇄</button>
          <button className="g s ic" aria-label={`Remove ${EX[id][0]}`} onClick={() => askRm(id)}>✕</button>
        </div>
      )) : <p className="mu">No exercises yet. Add one below.</p>}
      <button className="g" style={{ width: "100%", marginTop: 12 }} onClick={() => openSheet({ t: "ewp", k, m: "add" })}>+ Add exercise</button>
      <p className="mu" style={{ margin: "10px 2px 0", fontSize: 13 }}>Changes save automatically.</p>
      {um && (
        <div className="undo" role="status">
          <span>{um}</span>
          <button onClick={() => {
            ewUndo();
            setName(libOf(k)?.n || name);
          }}>Undo</button>
        </div>
      )}
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
      }}><Ico k="magic" s={18} /> Generate</button>
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
/** Recipe filters: meal type, four limits as segmented rows, favourites switch. Changes apply at once. */
function RecipeFilter() {
  const st = S.set, rc = st.rc || "", fv = !!st.rf, n = recipesShown().length;
  const set = (k: string, v: any) => {
    S.set[k] = v;
    commit();
  };
  return (
    <>
      <div className="mu rfl">Meal</div>
      <div className="hs rfm" role="group" aria-label="Meal">
        <Chip on={!rc} onClick={() => set("rc", "")}>All</Chip>
        {CATS.map(([k, l]) => <Chip key={k} on={rc == k} onClick={() => set("rc", rc == k ? "" : k)}>{l}</Chip>)}
      </div>
      <div className="mu rfl">Limits</div>
      <div className="rfg">
        {RF.map(([k, l, o]) => (
          <div className="rfr" key={k} role="radiogroup" aria-label={l}>
            <span>{l}</span>
            <div className="seg">
              {o.map(([v, t, c]) => <button key={v} role="radio" aria-checked={(st[k] || 0) == v} aria-label={c || "Any " + l.toLowerCase()} className={(st[k] || 0) == v ? "on" : ""} onClick={() => set(k, v)}>{t}</button>)}
            </div>
          </div>
        ))}
      </div>
      <button className="swr" role="switch" aria-checked={fv} onClick={() => set("rf", fv ? 0 : 1)}>
        <b>Favourites only</b><i aria-hidden="true" />
      </button>
      <button style={{ width: "100%", marginTop: 12 }} disabled={!n} onClick={() => openSheet(null)}>
        {n ? `Show ${n} recipe${n == 1 ? "" : "s"}` : "No recipes match"}
      </button>
    </>
  );
}
function TipFilter() {
  const t = A_<string>(S.set.ntf);
  const tog = (v: string) => {
    S.set.ntf = t.includes(v) ? t.filter(x => x != v) : t.concat(v);
    S.set.nti = 0;
    commit();
  };
  return (
    <>
      <p className="mu">{ntList(t).length} tips match.</p>
      <div className="hs wrapc" style={{ marginTop: 8 }}>
        <Chip on={!t.length} onClick={() => { S.set.ntf = []; S.set.nti = 0; commit(); }}>All</Chip>
        {NT_TOPICS.map(([v, x]) => <Chip key={v} on={t.includes(v)} onClick={() => tog(v)}>{x}</Chip>)}
      </div>
      <button style={{ width: "100%", marginTop: 12 }} onClick={() => openSheet(null)}>Done</button>
    </>
  );
}


/**
 * Meal from a photo. With AI connected, it names the meal and lists the ingredients; without it, the owner adds
 * them from the food search. Grams per ingredient and for the whole meal stay editable until it's added.
 */
function MealPhoto({ s }: { s: Extract<Sheet, { t: "mp" }> }) {
  const [name, setName] = useState("");
  const [list, setList] = useState<MealIng[]>([]);
  const [q, setQ] = useState("");
  const [whole, setWhole] = useState<string | null>(null); // whole-meal grams while typing
  const [msg, setMsg] = useState(ai ? "Recognising the meal…" : "Automatic recognition isn’t connected yet. Add what’s on the plate below.");
  useEffect(() => {
    let off = false;
    if (ai) analyseMeal(s.file).then(r => {
      if (off) return;
      setName(r.n);
      setList(r.items);
      setMsg(r.items.length ? "Check the ingredients and amounts, then add the meal." : "Couldn’t recognise the meal. Add ingredients below.");
    }).catch(() => !off && setMsg("Couldn’t analyse the photo. Add ingredients below."));
    return () => {
      off = true;
      URL.revokeObjectURL(s.url);
    };
  }, [s.url]);
  const sum = (k: "k" | "p" | "c" | "f") => Math.round(list.reduce((a, x) => a + (x[k] * x.g) / 100, 0));
  const grams = Math.round(list.reduce((a, x) => a + x.g, 0));
  const upd = (i: number, o: Partial<MealIng>) => setList(list.map((x, j) => (j == i ? { ...x, ...o } : x)));
  // Whole meal: scale every ingredient by the same factor.
  const scaleTo = (g: number) => {
    if (!grams || !(g > 0)) return;
    const f = g / grams;
    setList(list.map(x => ({ ...x, g: Math.max(1, Math.round(x.g * f)) })));
  };
  const sugs = searchIngredients(q);
  return (
    <>
      <img className="mpi" src={s.url} alt="Your meal" />
      <p className="mu" role="status" style={{ margin: "8px 2px" }}>{msg}</p>
      <input placeholder="Meal name" aria-label="Meal name" maxLength={40} value={name} onChange={e => setName(e.target.value)} />
      <div className="mu rfl" style={{ marginTop: 12 }}>Ingredients</div>
      {list.map((x, i) => (
        <div className="mpr" key={i}>
          <div className="mpn">
            <input aria-label="Ingredient name" value={x.n} onChange={e => upd(i, { n: e.target.value })} />
            <span className="mu">{Math.round((x.k * x.g) / 100)} kcal · P{Math.round((x.p * x.g) / 100)} C{Math.round((x.c * x.g) / 100)} F{Math.round((x.f * x.g) / 100)}</span>
          </div>
          <span className="mpg">
            <input type="number" inputMode="numeric" min={0} aria-label={`Grams of ${x.n}`} value={x.g} onChange={e => upd(i, { g: Math.max(0, Math.round(+e.target.value || 0)) })} />
            <span className="mu">g</span>
          </span>
          <button className="g s ic" aria-label={`Remove ${x.n}`} onClick={() => setList(list.filter((_, j) => j != i))}>✕</button>
        </div>
      ))}
      {!list.length && <p className="mu" style={{ margin: "4px 2px 8px" }}>No ingredients yet.</p>}
      <div style={{ position: "relative" }}>
        <input autoComplete="off" placeholder="+ Add ingredient, e.g. rice" aria-label="Add ingredient" value={q} onChange={e => setQ(e.target.value)} />
        {sugs.length > 0 && (
          <div className="sg">
            {sugs.map(k => (
              <button key={k} onClick={() => {
                const d = FD[k];
                setList([...list, { n: d.n, g: 100, k: d.k, p: d.p, c: d.c, f: d.f }]);
                setQ("");
              }}>{FD[k].n}<span className="mu"> · per 100 g {Math.round(FD[k].k)} kcal</span></button>
            ))}
          </div>
        )}
      </div>
      {list.length > 0 && (
        <div className="mpt">
          <div className="row">
            <b>Whole meal</b>
            <span className="mpg">
              <input type="number" inputMode="numeric" min={1} aria-label="Whole meal in grams" value={whole ?? grams}
                onChange={e => setWhole(e.target.value)} onBlur={() => { if (whole != null) scaleTo(+whole); setWhole(null); }}
                onKeyDown={e => e.key == "Enter" && (e.target as HTMLInputElement).blur()} />
              <span className="mu">g</span>
            </span>
          </div>
          <div className="mps" role="group" aria-label="Portion size">
            {([[0.5, "½"], [0.75, "¾"], [1.25, "1¼"], [1.5, "1½"], [2, "2×"]] as const).map(([f, l]) => (
              <Chip key={f} label={`Scale whole meal by ${f}`} onClick={() => scaleTo(grams * f)}>{l}</Chip>
            ))}
          </div>
          <p style={{ margin: "8px 2px 0" }}><b>{sum("k")} kcal</b> <span className="mu">· P{sum("p")} C{sum("c")} F{sum("f")}</span></p>
        </div>
      )}
      <button style={{ width: "100%", marginTop: 12 }} disabled={!list.length} onClick={() => {
        S.f.push({ d: TODAY(), n: (name.trim() || "Meal").slice(0, 40), k: sum("k"), p: sum("p"), c: sum("c"), f: sum("f") });
        UI.sheet = null;
        commit();
      }}>{list.length ? "Add to today" : "Add ingredients first"}</button>
    </>
  );
}

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
          <div key={x}><span className="mu">{l}</span><input type="number" inputMode="numeric" min={0} aria-label={l} value={g[x]}
            onKeyDown={e => e.key == "-" && e.preventDefault()} onChange={e => setG({ ...g, [x]: e.target.value.replace(/-/g, "") })} /></div>
        ))}
      </div>
      <button style={{ width: "100%", marginTop: 12 }} onClick={() => {
        S.goal = { k: Math.max(0, +g.k || 0), p: Math.max(0, +g.p || 0), c: Math.max(0, +g.c || 0), f: Math.max(0, +g.f || 0) };
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
              <img alt="" src={p.img} /><span>{dmy(p.d)} · {p.lab || ""}</span>
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
  ["u", "Urban glow", "City dusk and soft bokeh in blush and mauve"],
  ["w", "Clean white", "White and simple, like Apple Health"],
  // Extra looks (styles in theme/looks.css)
  ["gs", "Glow signal", "Black with a lime accent, magenta and sage glows, dot-matrix numbers"],
  ["sl", "Still life", "Lemon and leaf colours behind liquid-glass panels"],
  ["dh", "Desert HUD", "Crisp white tiles, black bars and a desert-dusk sky"],
  ["px", "Pixel", "White dot grid, pixel headings, black accents"],
  ["em", "Ember", "Dark, lit by a warm amber glow, with frosted panels"],
  ["np", "Night planner", "Near-black with a moody glow, gold ticks and cream buttons"],
  ["ga", "Gallery", "Paper grain, poster colour bursts and bold tight headlines"],
  ["mi", "Mist", "Soft grey with sage glass and light, thin numbers"],
];
// Default look: Urban glow (also used when a saved look was removed).
export const lookOf = () => (LOOKS.some(l => l[0] == S.set.look) ? S.set.look : "u");
function Look() {
  return (
    <>
      {LOOKS.map(([k, n, d]) => (
        <button key={k} className={"opt lko" + (lookOf() == k ? " on" : "")} aria-pressed={lookOf() == k} onClick={() => {
          S.set.look = k;
          commit();
        }}><b>{n}</b><span className="mu">{d}</span>{lookOf() == k && <span className="lkc" aria-hidden="true">✓</span>}</button>
      ))}
    </>
  );
}
