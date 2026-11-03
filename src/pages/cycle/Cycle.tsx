import { useEffect, useRef, useState } from "react";
import { EL, HM, MF, MIND, PH, PR, SYM, TL, fmt } from "../../data/cycle";
import { avq } from "../../lib/art";
import { Phase, addSym, ahImport, delSym, ent, perAdd, perDel, perEnd, perSort, perStart, phase, qList, setCycle, setMood, setNote, togSym, wOn } from "../../lib/cycle";
import { hormones } from "../../lib/figures";
import { QX } from "../../data/cycle";
import { S, commit, openSheet, render, useStore } from "../../lib/store";
import { A_, TODAY, dDiff, dFmt, dayNo, mod } from "../../lib/util";
import { Deco, FileButton, Hero, Ico, MoodIcon, Svg, Wico, useArt } from "../../components/ui";
import { Page } from "../../components/layout";

const HERO: Record<string, string> = { menstrual: "water", follicular: "grass", ovulation: "petal", luteal: "wind" };

export default function Cycle() {
  useStore();
  const p = phase();
  return (
    <Page title="Cycle">
      <Hero kind={p ? HERO[p.k] : "wind"} seed={3} a="Move with" b="your cycle" tag="balance" />
      <div className="masonry">
        <Status p={p} />
        {wOn("per") && <PeriodCard p={p} />}
        {p && wOn("horm") && <Hormones p={p} />}
        {wOn("quote") && <QuoteCard p={p} />}
        {wOn("today") && <Today />}
        {p && wOn("tips") && (
          <>
            <ListCard icon="eat" title="Eat" items={PH[p.k].eat} />
            <ListCard icon="sport" title="Sports" items={PH[p.k].sport} />
            <ListCard icon="do" title="Do" items={PH[p.k].do} />
          </>
        )}
        {p && wOn("mind") && <Mind p={p} />}
        {wOn("fact") && <Fact />}
        {wOn("reset") && <Breathing />}
        <Setup p={p} />
        <LastEntries />
      </div>
      <p className="mu">
        Educational information based on general guidance and published studies (e.g. ACOG, Cochrane, Elliott-Sale 2020, Balban 2023). Hormone curves are typical patterns; yours will differ. This isn’t medical advice. See a clinician for severe, unusual or worsening symptoms or mood changes.
      </p>
    </Page>
  );
}

function WidgetsButton() {
  return (
    <button className="g s ic wbtn" aria-label="Customize widgets" onClick={() => openSheet({ t: "wid" })}><Ico k="sliders" s={16} /></button>
  );
}

function Status({ p }: { p: Phase | null }) {
  if (!p)
    return (
      <div className="card">
        <WidgetsButton />
        <p className="mu" style={{ margin: 0, paddingRight: 44 }}>Enter your last period start to get phase-based tips.</p>
      </div>
    );
  const x = PH[p.k];
  return (
    <div className="card">
      <WidgetsButton />
      <span className="pill">{x.n} phase</span> <b>Day {p.day}</b> of {p.L}
      <div className="bar" style={{ margin: "10px 0" }}><i style={{ width: `${(p.day / p.L) * 100}%` }} /></div>
      <p className="mu" style={{ margin: 0 }}>{x.d} Next period in ~{p.next} days.</p>
    </div>
  );
}

function PeriodCard({ p }: { p: Phase | null }) {
  const L = perSort(), o = L[0] && !L[0].e && dDiff(L[0].s, TODAY()) <= 14 ? L[0] : null, op = !!S.set.pa;
  const [s, setS] = useState(""), [e, setE] = useState(""), [msg, setMsg] = useState("");
  return (
    <div className="card">
      <div className="ch"><b className="wt"><Wico k="per" /> Period tracker</b></div>
      <p style={{ margin: "8px 0" }}>
        {o ? <>Period day <b>{dDiff(o.s, TODAY()) + 1}</b>, started {dFmt(o.s)}.</>
          : p ? <>Cycle day <b>{p.day}</b> of {p.L}. Next period in about {p.next} day{p.next == 1 ? "" : "s"}.</>
            : "Log the first day of your period to start tracking."}
      </p>
      <div className="row">
        {o ? <button onClick={perEnd}>Period ended today</button> : <button onClick={() => perStart()}>My period started today</button>}
        <button className="g" aria-expanded={op} onClick={() => {
          S.set.pa = op ? 0 : 1;
          render();
        }}>{op ? "Close" : "Other date"}</button>
      </div>
      {op && (
        <>
          <div className="row" style={{ marginTop: 10 }}>
            <div><span className="mu">First day</span><input type="date" max={TODAY()} value={s} aria-label="First day" onChange={ev => setS(ev.target.value)} /></div>
            <div><span className="mu">Last day (optional)</span><input type="date" max={TODAY()} value={e} aria-label="Last day" onChange={ev => setE(ev.target.value)} /></div>
          </div>
          <button className="g" style={{ width: "100%", marginTop: 8 }} onClick={() => {
            if (perAdd(s, e)) {
              setS("");
              setE("");
            }
          }}>Add period</button>
        </>
      )}
      {L.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {L.slice(0, 6).map((x, i) => {
            const n = x.e ? dDiff(x.s, x.e) + 1 : null, nx = L[i - 1], cl = nx ? dDiff(x.s, nx.s) : null;
            return (
              <div className="li" key={x.s}>
                <span>
                  <b>{dFmt(x.s)}{x.e ? " – " + dFmt(x.e) : " – now"}</b><br />
                  <span className="mu">{n ? n + " day" + (n > 1 ? "s" : "") : "ongoing"}{cl && cl <= 60 ? " · cycle " + cl + " days" : ""}</span>
                </span>
                <button className="g s ic" aria-label={`Delete period ${dFmt(x.s)}`} onClick={() => perDel(x.s)}>✕</button>
              </div>
            );
          })}
        </div>
      )}
      <details style={{ marginTop: 10 }}>
        <summary>Import from Apple Health</summary>
        <p className="mu" style={{ margin: "8px 0" }}>A web page cannot read Apple Health directly, so there is no live sync. Instead, export once and import the file here:</p>
        <ol className="mu" style={{ margin: "0 0 8px", paddingLeft: 20 }}>
          <li>Open the Health app and tap your profile picture.</li>
          <li>Tap Export All Health Data and save the file.</li>
          <li>Choose that file (export.zip or export.xml) below.</li>
        </ol>
        <FileButton accept=".zip,.xml,application/zip,text/xml" onFiles={async f => {
          setMsg("Reading the file…");
          setMsg(await ahImport(f[0]));
        }}>Choose export file</FileButton>
        <p className="mu" role="status" style={{ margin: "6px 0 0" }}>{msg}</p>
      </details>
    </div>
  );
}

function Hormones({ p }: { p: Phase }) {
  return (
    <div className="card">
      <b>Hormone levels</b>
      <p className="mu" style={{ margin: "2px 0 6px" }}>Typical pattern for a {p.L}-day cycle, schematic and not measured.</p>
      <Svg html={hormones(S.cyc, p)} />
      <div className="lg">
        <span><i style={{ background: "var(--h1)" }} />Estrogen</span>
        <span><i style={{ background: "var(--h2)" }} />Progesterone</span>
        <span><i style={{ background: "var(--h3)" }} />Testosterone</span>
      </div>
      <p style={{ margin: "6px 0 0" }}>{HM[p.k]}</p>
    </div>
  );
}

function QuoteCard({ p }: { p: Phase | null }) {
  const l = qList(p), q = l[mod(dayNo() + (S.set.q || 0), l.length)], qi = QX.indexOf(q);
  const f = A_(S.set.qt).length + A_(S.set.qe).length + (S.set.qph ? 1 : 0);
  const bg = useArt(() => avq(q.e, qi), "q" + qi);
  return (
    <div className="qc" style={bg ? { backgroundImage: bg } : undefined}>
      <Deco seed={"q" + qi} n={1} top />
      <button className={"qfb" + (f ? " on" : "")} aria-label={`Choose quotes${f ? " (filtered)" : ""}`} onClick={() => openSheet({ t: "qf" })}>
        <Ico k="sliders" s={18} />
      </button>
      <span className="el">{EL[q.e]} · {TL[q.t]}</span>
      <p>“{q.q}”</p>
      {q.a && <span className="el" style={{ textTransform: "none", letterSpacing: 0 }}>— {q.a}{q.s ? " · " + q.s : ""}</span>}
      <button className="s" onClick={() => {
        S.set.q = (S.set.q || 0) + 1;
        commit();
      }}>Another</button>
    </div>
  );
}

function Today() {
  const e = ent(), sy = !!S.set.sy;
  const [ns, setNs] = useState("");
  const [note, setNoteTxt] = useState(e.nt);
  const add = () => {
    addSym(ns);
    setNs("");
  };
  return (
    <div className="card">
      <b>Today</b>
      <div className="row" style={{ margin: "10px 0" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <button key={i} className={"chip mood" + (e.m == i + 1 ? " on" : "")} aria-label={`Mood ${i + 1} of 5`} aria-pressed={e.m == i + 1}
            onClick={() => setMood(i + 1)}><MoodIcon i={i} /></button>
        ))}
      </div>
      <button className="g fh" aria-expanded={sy} onClick={() => {
        S.set.sy = sy ? 0 : 1;
        render();
      }}>
        <span>Symptoms{e.sy.length ? " · " + e.sy.length : ""}</span><span>{sy ? "▴" : "▾"}</span>
      </button>
      {sy && (
        <>
          <div style={{ marginTop: 8 }}>
            {SYM.map(s => <button key={s} className={"chip" + (e.sy.includes(s) ? " on" : "")} aria-pressed={e.sy.includes(s)} onClick={() => togSym(s)}>{s}</button>)}
            {S.symx.map((s, i) => (
              <span className="cw" key={s}>
                <button className={"chip" + (e.sy.includes(s) ? " on" : "")} aria-pressed={e.sy.includes(s)} onClick={() => togSym(s)}>{s}</button>
                <button className="cwx" aria-label={`Remove ${s}`} onClick={() => delSym(i)}>×</button>
              </span>
            ))}
          </div>
          <div className="addr">
            <input maxLength={28} placeholder="Add your own symptom or label" value={ns} onChange={ev => setNs(ev.target.value)} onKeyDown={ev => ev.key == "Enter" && add()} />
            <button className="g" onClick={add}>Add</button>
          </div>
        </>
      )}
      <input placeholder="Notes (optional)" aria-label="Notes" value={note} onChange={ev => setNoteTxt(ev.target.value)} onBlur={() => setNote(note)} style={{ marginTop: 8 }} />
    </div>
  );
}

function ListCard({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <div className="card">
      <b className="wt"><Wico k={icon} /> {title}</b>
      <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

function Mind({ p }: { p: Phase }) {
  const m = MIND[p.k];
  return (
    <div className="card">
      <div className="ch"><b className="wt"><Wico k="mind" /> Mind &amp; brain</b><span className="pill">{m.chem}</span></div>
      <p style={{ margin: "8px 0 0" }}>{m.fact}</p>
      <ul>{m.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </div>
  );
}

function Fact() {
  const mf = MF[mod(dayNo() + (S.set.mf || 0), MF.length)];
  return (
    <div className="card">
      <div className="ch"><Wico k="fact" /><span className="pill">{mf[0]}</span></div>
      <p style={{ margin: "8px 0 4px" }}>{mf[1]}</p>
      <p className="mu" style={{ margin: 0 }}>Try: {mf[2]}</p>
      <button className="g s" style={{ marginTop: 10 }} onClick={() => {
        S.set.mf = (S.set.mf || 0) + 1;
        commit();
      }}>Another fact</button>
    </div>
  );
}

/** Guided breathing: an orb grows and shrinks with the instructions. */
function Breathing() {
  const key = S.set.pr && PR[S.set.pr] ? S.set.pr : "cyc", pr = PR[key];
  const orb = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [txt, setTxt] = useState(pr.n + " · " + fmt(pr.dur));
  useEffect(() => {
    if (!run) {
      if (orb.current) orb.current.style.transform = "scale(.55)";
      setTxt(pr.n + " · " + fmt(pr.dur));
      return;
    }
    const t0 = Date.now();
    const iv = setInterval(() => {
      const t = (Date.now() - t0) / 1000;
      if (t >= pr.dur) {
        setRun(false);
        return;
      }
      const [ph, sc] = pr.f(t);
      if (orb.current) orb.current.style.transform = `scale(${sc})`;
      setTxt(ph + " · " + fmt(Math.ceil(pr.dur - t)));
    }, 80);
    return () => clearInterval(iv);
  }, [run, key]);
  return (
    <div className="card brw">
      <div className="row" style={{ alignItems: "center", gap: 12, flexWrap: "nowrap" }}>
        <div className="brc" ref={orb} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>Breathing &amp; meditation</b>
          <select aria-label="Practice" value={key} style={{ margin: "6px 0" }} onChange={e => {
            S.set.pr = e.target.value;
            setRun(false);
            commit();
          }}>
            {Object.entries(PR).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}
          </select>
          <p className="mu" role="timer" style={{ margin: 0, fontSize: 13 }}>{txt}</p>
        </div>
      </div>
      <p className="mu" style={{ margin: "8px 0" }}>{pr.d}</p>
      <button style={{ width: "100%" }} onClick={() => setRun(!run)}>{run ? "Stop" : "Start"}</button>
      {pr.w && (
        <details>
          <summary className="mu" style={{ fontSize: 12, marginTop: 8 }}>Safety note</summary>
          <p className="mu" style={{ fontSize: 12, margin: "6px 0 0" }}>{pr.w}</p>
        </details>
      )}
    </div>
  );
}

function Setup({ p }: { p: Phase | null }) {
  const c = S.cyc;
  const [start, setStart] = useState(c?.start || "");
  const [len, setLen] = useState(String(c?.len || 28));
  return (
    <div className="card">
      <b>{p ? "Update" : "Set up"} your cycle</b>
      <div className="row" style={{ marginTop: 8 }}>
        <div><span className="mu">Period started</span><input type="date" aria-label="Period started" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><span className="mu">Cycle length</span><input type="number" aria-label="Cycle length in days" value={len} onChange={e => setLen(e.target.value)} /></div>
      </div>
      <button style={{ width: "100%", marginTop: 10 }} onClick={() => setCycle(start, +len || 28)}>Save</button>
    </div>
  );
}

function LastEntries() {
  const hist = Object.keys(S.cl).sort().reverse().slice(0, 7).map(d => [d, S.cl[d]] as const).filter(([, x]) => x.m || x.sy.length);
  if (!hist.length) return null;
  return (
    <div className="card">
      <b>Last entries</b>
      {hist.map(([d, x]) => (
        <div className="li" key={d}>
          <span className="hm">{d.slice(5)} {x.m ? <MoodIcon i={x.m - 1} s={18} /> : null}</span>
          <span className="mu" style={{ textAlign: "right" }}>{x.sy.join(", ")}</span>
        </div>
      ))}
    </div>
  );
}
