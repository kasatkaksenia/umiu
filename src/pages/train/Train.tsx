import { useState } from "react";
import { useIonAlert, useIonRouter } from "@ionic/react";
import { CD, EX, SPL } from "../../data/exercises";
import { fig, figSvg } from "../../lib/figures";
import { S, UI, commit, openSheet, render, save, useStore } from "../../lib/store";
import { comeback, dr, ewName, fin, nameOf, rmEx, rowsOf, setTxt, vol, wkDone } from "../../lib/train";
import { TODAY, dmy } from "../../lib/util";
import { Hero, Ico, Svg, Tabs } from "../../components/ui";
import { Page } from "../../components/layout";

export default function Train() {
  useStore();
  const v: "w" | "h" = S.set.tv || "w";
  return (
    <Page title="Train">
      <Hero kind="train" seed={1} a="Your next" b="workout" tag="movement" icon={4} />
      <Tabs items={[["w", "Workout"], ["h", "History"]]} cur={v} on={k => {
        S.set.tv = k;
        S.set.hw = null;
        UI.menu = null;
        commit();
      }} />
      {v == "w" ? <Workout /> : S.set.hw != null && S.hist[S.set.hw] ? <WorkoutDetail /> : <History />}
    </Page>
  );
}

function Workout() {
  const r = useIonRouter();
  const D = dr(), pl = S.plan, sp = SPL[pl.split], done = wkDone(), P = new Set<string>(), Q = new Set<string>();
  D.ids.forEach(id => {
    EX[id][1].split(",").forEach(m => m && P.add(m));
    EX[id][2].split(",").forEach(m => m && Q.add(m));
  });
  const sets = D.ids.reduce((a, id) => a + rowsOf(id).length, 0);
  return (
    <div className="cols c-main">
      <div className="col side">
        <Comeback />
        <button className="card plan-card" onClick={() => r.push("/train/plan")}>
          <div className="row" style={{ alignItems: "center" }}>
            <div><b>Training plan</b><div className="mu">{pl.days}× per week · {sp.n}</div></div>
            <span style={{ flex: "none", color: "var(--ac)", fontWeight: 600 }}>Edit ›</span>
          </div>
          <div className="dots">
            {Array.from({ length: pl.days }, (_, i) => <i key={i} className={i < done ? "on" : ""} />)}
            <span className="mu">{Math.min(done, pl.days)} of {pl.days} this week</span>
          </div>
        </button>
      </div>
      <div className="col main">
        <div className="card">
          <div className="mu eyebrow">Next workout</div>
          <div className="row" style={{ alignItems: "center", margin: "6px 0 10px" }}>
            <div style={{ minWidth: 0 }}>
              <WorkoutName k={D.n} />
              <div className="mu">{D.ids.length} exercises · {sets} sets</div>
            </div>
            <Svg className="wfig" html={fig([...P].join(), [...Q].filter(x => !P.has(x)).join())} />
          </div>
          <div className="row">
            <button className="g s" onClick={() => openSheet({ t: "add" })}>+ Add exercise</button>
            <button className="g s" onClick={() => openSheet({ t: "wk" })}>Change workout</button>
          </div>
          <div style={{ marginTop: 10 }}>
            {D.ids.length ? D.ids.map(id => <ExRow key={id} id={id} />) : <p className="mu">No exercises yet. Add one.</p>}
          </div>
          <p className="mu" role="status" style={{ margin: "8px 0" }}>{UI.msg}</p>
          <button style={{ width: "100%" }} onClick={() => fin()}>Finish workout</button>
        </div>
      </div>
    </div>
  );
}

/** Workout title; the pencil turns it into a text field. */
function WorkoutName({ k }: { k: string }) {
  const [edit, setEdit] = useState(false);
  const [txt, setTxt] = useState("");
  const done = () => {
    ewName(k, txt);
    setEdit(false);
  };
  if (edit)
    return (
      <div className="wkn">
        <input autoFocus maxLength={32} aria-label="Workout name" value={txt} onChange={e => setTxt(e.target.value)} onBlur={done}
          onKeyDown={e => e.key == "Enter" && done()} />
      </div>
    );
  return (
    <div className="wkn">
      <h2>{nameOf(k)}</h2>
      <button className="g s ic" aria-label="Rename workout" onClick={() => {
        setTxt(nameOf(k));
        setEdit(true);
      }}>✎</button>
    </div>
  );
}

function ExRow({ id }: { id: string }) {
  const r = useIonRouter();
  const e = EX[id], rows = rowsOf(id), n = rows.filter(x => x.d).length;
  const menu = UI.menu == id;
  return (
    <div className="cx" onClick={() => {
      UI.menu = null;
      r.push("/train/ex/" + id);
    }}>
      <Svg className="th" html={figSvg(id, 0)} />
      <div className="nm">
        <b>{e[0]}</b>
        <span className="mu">{n}/{rows.length} {CD[id] ? "blocks · cardio" : "sets · " + e[3] + " reps"}</span>
      </div>
      <button className="bm" aria-label={`Menu for ${e[0]}`} aria-expanded={menu} onClick={ev => {
        ev.stopPropagation();
        UI.menu = menu ? null : id;
        render();
      }}><Ico k="menu" s={18} /></button>
      {menu && (
        <div className="pop" onClick={ev => ev.stopPropagation()}>
          <button onClick={() => {
            UI.menu = null;
            openSheet({ t: "swap", id });
          }}><Ico k="swap" s={18} /> Swap</button>
          <button onClick={() => {
            UI.menu = null;
            r.push(`/train/ex/${id}/history`);
          }}><Ico k="hist" s={18} /> History</button>
          <button className="rm" onClick={() => rmEx(id)}><Ico k="trash" s={18} /> Remove</button>
        </div>
      )}
    </div>
  );
}

function Comeback() {
  const c = comeback();
  if (!c) return null;
  return (
    <div className="card">
      <b>Welcome back</b>
      <p className="mu" style={{ margin: "4px 0 8px" }}>Your last workout was {c.g} days ago. Here is a gentle way to restart.</p>
      <div className="row wrapr" style={{ gap: 6 }}>
        {([["hol", "Holiday or busy"], ["ill", "Illness or injury"]] as const).map(([k, l]) => (
          <button key={k} className={"chip" + ((S.set.brk || "hol") == k ? " on" : "")} onClick={() => {
            S.set.brk = k;
            commit();
          }}>{l}</button>
        ))}
      </div>
      <ul style={{ margin: "8px 0" }}>
        {c.ill && <li>Restart only when symptoms are gone and you feel normal for a day or two. Ask a clinician first after fever, heart or chest symptoms, or an injury.</li>}
        <li>Weights: start at about {Math.round(c.f * 100)}% of your last working weights ({Math.round((1 - c.f) * 100)}% lighter).</li>
        <li>Volume: {c.vol} of your usual sets in the first week, with 2–3 reps left in reserve.</li>
        <li>Ramp up over {c.wk} weeks: add about 5% load a session, or a set a week, until you are back at your old numbers.</li>
        <li>Strength comes back faster than it was built (muscle memory), so don’t rush it.</li>
      </ul>
      <p className="mu" style={{ fontSize: 12, margin: "0 0 8px" }}>
        Based on detraining and retraining research (Mujika &amp; Padilla 2000, Bosquet 2013, Seaborne 2018) and ACSM guidance. General information, not medical advice.
      </p>
      <button className="g s" onClick={() => {
        S.set.brkX = TODAY();
        commit();
      }}>Dismiss for a week</button>
    </div>
  );
}

function History() {
  const m: string = S.set.hm || TODAY().slice(0, 7);
  const [y, mo] = m.split("-").map(Number);
  const lead = (new Date(y, mo - 1, 1).getDay() + 6) % 7, n = new Date(y, mo, 0).getDate(), dd = new Set(S.hist.map(x => x.d));
  const mv = (k: number) => {
    const d = new Date(y, mo - 1 + k, 1);
    S.set.hm = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    commit();
  };
  const L = S.hist.map((w, i) => [w, i] as const).filter(([w]) => (S.set.hd ? w.d == S.set.hd : true)).reverse().slice(0, S.set.hd ? 99 : 15);
  return (
    <div className="cols c-even">
      <div className="col">
        <div className="card">
          <div className="row">
            <button className="g s" style={{ flex: "none" }} aria-label="Previous month" onClick={() => mv(-1)}>‹</button>
            <b style={{ textAlign: "center" }}>{new Date(y, mo - 1).toLocaleString("en", { month: "long", year: "numeric" })}</b>
            <button className="g s" style={{ flex: "none" }} aria-label="Next month" onClick={() => mv(1)}>›</button>
          </div>
          <div className="cal mu" style={{ margin: "8px 0 2px" }}>{"MTWTFSS".split("").map((d, i) => <span key={i}>{d}</span>)}</div>
          <div className="cal">
            {Array.from({ length: lead }, (_, i) => <i key={"l" + i} />)}
            {Array.from({ length: n }, (_, i) => {
              const ds = `${m}-${String(i + 1).padStart(2, "0")}`;
              return (
                <button key={ds} className={(dd.has(ds) ? "has" : "") + (S.set.hd == ds ? " sel" : "")} aria-pressed={S.set.hd == ds} onClick={() => {
                  S.set.hd = S.set.hd == ds ? null : ds;
                  commit();
                }}>{i + 1}</button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col">
        <h2>{S.set.hd ? "Workouts on " + dmy(S.set.hd) : "Recent workouts"}</h2>
        {L.length ? L.map(([w, i]) => (
          <button key={i} className="card li" onClick={() => {
            S.set.hw = i;
            save();
            render();
          }}>
            <span><b>{w.n}</b><br /><span className="mu">{dmy(w.d)} · {w.it.length} exercises · {vol(w)} kg volume</span></span>
            <span>›</span>
          </button>
        )) : <p className="mu">No workouts yet.</p>}
      </div>
    </div>
  );
}

function WorkoutDetail() {
  const [alert] = useIonAlert();
  const w = S.hist[S.set.hw];
  return (
    <>
      <button className="g s" onClick={() => {
        S.set.hw = null;
        commit();
      }}>‹ Back</button>
      <h2>{w.n} <span className="mu">{dmy(w.d)}</span></h2>
      <div className="grid-cards">
        {w.it.map((x, k) => (
          <div className="card" key={k}>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <Svg style={{ flex: "none", width: 80 }} html={fig(EX[x.id][1], EX[x.id][2])} />
              <div>
                <b>{EX[x.id][0]}</b>
                {x.s.map((s, j) => <div className="li" key={j}><span className="mu">Set {j + 1}</span><span>{setTxt(x.id, s)}</span></div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="g" onClick={() => alert({
        header: "Delete this workout?",
        message: "It will be removed from your history.",
        buttons: [{ text: "Cancel", role: "cancel" }, {
          text: "Delete", role: "destructive", handler: () => {
            S.hist.splice(S.set.hw, 1);
            S.set.hw = null;
            commit();
          },
        }],
      })}>Delete workout</button>
    </>
  );
}
