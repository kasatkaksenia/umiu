import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { EL, HM, MF, MIND, PH, PR, SYM, TL, fmt } from "../../data/cycle";
import { drawArt, pickArt } from "../../lib/qart";
import { DEF_LEN, Phase, addSym, avgOf, delSym, ent, flowOf, perOn, perTog, phase, predOf, setFlow, qList, setCycle, setMood, setNote, togSym, wOn } from "../../lib/cycle";
import { hormones } from "../../lib/figures";
import { QX } from "../../data/cycle";
import { S, commit, openSheet, render, useStore } from "../../lib/store";
import { A_, TODAY, dAdd, dDiff, dayNo, dmy, mod } from "../../lib/util";
import { Hero, Ico, InfoButton, MoodIcon, Svg, Wico } from "../../components/ui";
import { Page } from "../../components/layout";
import { MOODS, isClay } from "../../lib/moods";
import { LANG, pn, t as tt } from "../../lib/i18n";

const HERO: Record<string, string> = { menstrual: "water", follicular: "grass", ovulation: "petal", luteal: "wind" };

export default function Cycle() {
  useStore();
  const p = phase();
  // New users: the setup card comes first until a period is logged.
  const fresh = !S.per.length && !S.cyc;
  return (
    <Page title="Cycle">
      <Hero kind={p ? HERO[p.k] : "wind"} seed={3} a="Move with" b="your cycle" tag="balance" icon="wave" />
      <div className="masonry">
        {fresh && <Setup />}
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
        <LastEntries />
      </div>
      <p className="mu">
        Educational information based on general guidance and published studies (e.g. ACOG, Cochrane, Elliott-Sale 2020, Balban 2023). Hormone curves are typical patterns; yours will differ. This isn’t medical advice. See a clinician for severe, unusual or worsening symptoms or mood changes.
      </p>
    </Page>
  );
}

function WidgetsButton({ inline }: { inline?: boolean }) {
  return (
    <button className={"g s ic" + (inline ? " wbi" : " wbtn")} aria-label="Customize widgets" onClick={() => openSheet({ t: "wid" })}><Ico k="sliders" s={16} /></button>
  );
}

const lateTxt = (n: number) => (n ? tt("Period is {n} late.", { n: pn(n, "day") }) : tt("Period is due today."));

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
      {/* Button sits in the first line so it never covers the progress bar. */}
      <div className="stl">
        <span><span className="pill">{x.n} phase</span><span><b className="num">Day {p.day}</b> of {p.L}</span></span>
        <WidgetsButton inline />
      </div>
      <div className="bar" style={{ margin: "10px 0" }}><i style={{ width: `${Math.min(1, p.day / p.L) * 100}%` }} /></div>
      <p className="mu" style={{ margin: 0 }}>{p.late != null ? lateTxt(p.late) + " " + tt("Tap the day it starts in the period tracker below.") : tt(x.d) + " " + tt("Next period in ~{n}.", { n: pn(p.next, "day") })}</p>
    </div>
  );
}

const FLOW = ["None", "Light", "Medium", "Heavy"];
const WD = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(LANG, { weekday: "narrow" });
const dLong = (d: string) => (d == TODAY() ? "Today" : new Date(d + "T12:00:00").toLocaleDateString(LANG, { weekday: "short", day: "numeric", month: "short" }));
const MON = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(LANG, { month: "long", year: d.slice(0, 4) == TODAY().slice(0, 4) ? undefined : "numeric" });
const MORE = 42; // days added each time the strip is scrolled near an end

/**
 * Period tracker in the style of Apple Health: an endless strip of days.
 * Tap a past day (or today) to mark it as a period day, tap again to unmark it;
 * the last tapped period day can get a flow level. Future days show predictions.
 */
function PeriodCard({ p }: { p: Phase | null }) {
  const t = TODAY();
  const [sel, setSel] = useState<string | null>(null);
  const [rng, setRng] = useState({ a: -MORE, b: 28 }); // first and last day, relative to today
  const [mid, setMid] = useState(t); // day in the middle of the strip, for the month label
  const strip = useRef<HTMLDivElement>(null);
  const shift = useRef(0);
  const days = Array.from({ length: rng.b - rng.a + 1 }, (_, i) => dAdd(t, rng.a + i));
  const stride = () => {
    const c = strip.current?.children;
    return c && c.length > 1 ? (c[1] as HTMLElement).offsetLeft - (c[0] as HTMLElement).offsetLeft : 44;
  };
  const toToday = (smooth?: boolean) => {
    const st = strip.current, el = st?.querySelector<HTMLElement>(".pday.today");
    if (!st || !el || !st.clientWidth) return false;
    const a = st.getBoundingClientRect(), b = el.getBoundingClientRect();
    st.scrollTo({ left: st.scrollLeft + b.left - a.left - (a.width - b.width) / 2, behavior: smooth ? "smooth" : "auto" });
    return true;
  };
  // Start with today in the middle; the page may still be hidden while Ionic animates it in.
  useEffect(() => {
    if (!toToday()) {
      const tm = setTimeout(() => toToday(), 350);
      return () => clearTimeout(tm);
    }
  }, []);
  // After adding days on the left, keep the same days in view.
  useLayoutEffect(() => {
    if (shift.current && strip.current) {
      strip.current.scrollLeft += shift.current;
      shift.current = 0;
    }
  }, [rng.a]);
  const onScroll = () => {
    const st = strip.current;
    if (!st) return;
    const w = stride(), i = Math.floor((st.scrollLeft + st.clientWidth / 2) / w);
    setMid(days[Math.max(0, Math.min(days.length - 1, i))]);
    if (st.scrollLeft < w * 7 && !shift.current) {
      shift.current = MORE * w;
      setRng(r => ({ ...r, a: r.a - MORE }));
    } else if (st.scrollLeft + st.clientWidth > st.scrollWidth - w * 7) setRng(r => ({ ...r, b: r.b + MORE }));
  };
  const cur = perOn(t), away = Math.abs(dDiff(t, mid)) > 4;
  const fs = sel ? flowOf(sel) : null;
  return (
    <div className="card pcard">
      <div className="ch"><b className="wt"><Wico k="per" /> Period tracker</b></div>
      <p style={{ margin: "8px 0 2px" }}>
        {cur ? <>Period day <b>{dDiff(cur.s, t) + 1}</b></>
          : p?.late != null ? <b>{lateTxt(p.late)}</b>
          : p ? <>Next period in about <b>{pn(p.next, "day")}</b></>
            : "Tap the days of your last period to start tracking."}
      </p>
      <div className="pmon">
        <b>{MON(mid)}</b>
        {away && <button className="g s" onClick={() => toToday(true)}>Today</button>}
      </div>
      <div className="pstrip" ref={strip} onScroll={onScroll} role="group" aria-label="Days: tap to mark or unmark a period day">
        {days.map(d => {
          const f = flowOf(d), pd = f == null && d > t ? predOf(d) : null, first = d.slice(8) == "01";
          const cls = "pday" + (f != null ? " fl f" + f : "") + (pd ? " " + pd : "") + (d == t ? " today" : "") + (d == sel ? " sel" : "") + (d > t ? " fut" : "") + (first ? " m1" : "");
          return (
            <button key={d} className={cls} aria-pressed={f != null} disabled={d > t}
              aria-label={`${dLong(d)}${f != null ? ", period" + (f ? ", " + FLOW[f].toLowerCase() + " flow" : "") : pd == "per" ? ", predicted period" : pd == "fert" ? ", fertile window" : ""}`}
              onClick={() => {
                perTog(d);
                setSel(f == null ? d : null);
              }}>
              <span className="pw">{first ? new Date(d + "T12:00:00").toLocaleDateString(LANG, { month: "short" }) : WD(d)}</span>
              <span className="pc">{+d.slice(8)}</span>
            </button>
          );
        })}
      </div>
      {sel && fs != null ? (
        <div className="pflow">
          <b>{dLong(sel)}</b><span className="mu"> · flow (optional)</span>
          <div className="seg" role="group" aria-label="Period flow">
            {FLOW.slice(1).map((l, i) => (
              <button key={l} className={fs == i + 1 ? "on" : ""} aria-pressed={fs == i + 1} onClick={() => setFlow(sel, fs == i + 1 ? 0 : i + 1, true)}>{l}</button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="plg mu" aria-hidden="true">
        <span><i className="lg-p" />Period</span><span><i className="lg-pr" />Predicted</span><span><i className="lg-f" />Fertile window</span>
      </div>
    </div>
  );
}

function Hormones({ p }: { p: Phase }) {
  return (
    <div className="card">
      <div className="ch"><b>Hormone levels</b><InfoButton k="horm" label="About this chart" /></div>
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

/** Quote of the day on a drawn picture (src/lib/qart.ts). Each new quote gets a picture the user hasn't seen yet. */
function QuoteCard({ p }: { p: Phase | null }) {
  const l = qList(p), n = dayNo() + (S.set.q || 0), q = l[mod(n, l.length)], qi = QX.indexOf(q);
  const f = A_(S.set.qt).length + A_(S.set.qe).length + (S.set.qph ? 1 : 0);
  const key = pickArt(q, n + ":" + qi);
  const a = useMemo(() => drawArt(key, q), [key, q]);
  const lay = a.lay || "plain";
  let text = a.lower ? q.q.toLowerCase() : q.q;
  let last = "";
  if (a.sub) {
    const w = text.replace(/[.!]$/, "").split(" ");
    last = w.pop() + ".";
    text = w.join(" ") + " ";
  }
  const by = q.a ? <span className="qa-a">— {q.a}{q.s ? " · " + q.s : ""}</span> : null;
  const st = { ...a.tx, color: a.ink };
  return (
    <div className="qa" data-art={key} style={{ color: a.ink }}>
      <div className="qa-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: a.svg }} />
      <span className="qa-tag" style={a.tag ? { color: a.tag } : undefined}>{EL[q.e]} · {TL[q.t]}</span>
      <button className={"qfb" + (f ? " on" : "")} aria-label={`Choose quotes${f ? " (filtered)" : ""}`} onClick={() => openSheet({ t: "qf" })}>
        <Ico k="sliders" s={18} />
      </button>
      {lay == "plain" && <p className="qa-q" style={st}>{text}{last && <b>{last}</b>}{by}</p>}
      {lay == "dict" && (
        <div className={"qa-q qa-dict" + (a.upper ? " qa-up" : "")} style={st}>
          <div className="qa-h">{a.head}</div>
          <div className="qa-ph">noun · {EL[q.e]} · {TL[q.t]}</div>
          <div className="qa-def">(n.) {a.lower ? q.q.toLowerCase() : q.q}</div>
          {by}
        </div>
      )}
      {lay == "poster" && (
        <>
          <p className="qa-q" style={st}>{q.q.replace(/[.!]$/, "")}</p>
          <span className="qa-stk" style={{ color: a.head }}>{a.sticker}</span>
        </>
      )}
      {lay == "none" && <p className="sr-only">{q.q}{q.a ? " — " + q.a : ""}</p>}
      <button className="s qa-more" style={{ background: a.chip[0], color: a.chip[1] }} onClick={() => {
        S.set.q = (S.set.q || 0) + 1;
        commit();
      }}>Another</button>
    </div>
  );
}

function Today() {
  const e = ent();
  const [ns, setNs] = useState("");
  const [adding, setAdding] = useState(false);
  const [note, setNoteTxt] = useState(e.nt);
  const add = () => {
    addSym(ns);
    setNs("");
  };
  return (
    <div className="card">
      <b>Today</b>
      <div className={"row moods" + (e.m ? " has" : "")} role="radiogroup" aria-label="Mood" style={{ margin: "10px 0" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <button key={i} className={"chip mood" + (isClay() ? " clay" : "") + (e.m == i + 1 ? " on" : "")} role="radio" aria-label={`Mood: ${MOODS[i].n}`} aria-checked={e.m == i + 1}
            onClick={() => setMood(i + 1)}><MoodIcon i={i} s={38} /></button>
        ))}
      </div>
      <div className="mu sylab">Symptoms{e.sy.length ? " · " + e.sy.length : ""}</div>
      {/* One sideways row: chosen symptoms first, then the rest; "+" at the end adds your own. */}
      <div className="syrow" role="group" aria-label="Symptoms">
        {[...e.sy.filter(x => SYM.includes(x) || S.symx.includes(x)), ...[...SYM, ...S.symx].filter(x => !e.sy.includes(x))].map(s => {
          const xi = S.symx.indexOf(s), on = e.sy.includes(s);
          return (
            <span className="cw" key={s}>
              <button className={"chip" + (on ? " on" : "")} aria-pressed={on} onClick={() => togSym(s)}>{s}</button>
              {xi >= 0 && !on && <button className="cwx" aria-label={`Remove ${s}`} onClick={() => delSym(xi)}>×</button>}
            </span>
          );
        })}
        {adding ? (
          <input className="chip syin" autoFocus maxLength={28} placeholder="Your own symptom" aria-label="Your own symptom" value={ns}
            onChange={ev => setNs(ev.target.value)} onKeyDown={ev => { if (ev.key == "Enter") { add(); setAdding(false); } if (ev.key == "Escape") setAdding(false); }}
            onBlur={() => { add(); setAdding(false); }} />
        ) : (
          <button className="chip syadd" aria-label="Add your own symptom" onClick={() => setAdding(true)}><Ico k="plus" s={16} /></button>
        )}
      </div>
      <label className="ntw">
        <Ico k="pen" s={18} />
        <textarea rows={1} placeholder="Add a note…" aria-label="Note" value={note} onChange={ev => {
          setNoteTxt(ev.target.value);
          ev.target.style.height = "auto";
          ev.target.style.height = ev.target.scrollHeight + "px";
        }} onBlur={() => setNote(note)} />
      </label>
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
      <div className="ch"><b className="wt"><Wico k="fact" /> Daily practice</b><span className="pill">{mf[0]}</span></div>
      <p style={{ margin: "8px 0 4px" }}>{mf[1]}</p>
      <p className="mu" style={{ margin: 0 }}>Try: {mf[2]}</p>
      <button className="g s" style={{ marginTop: 10 }} onClick={() => {
        S.set.mf = (S.set.mf || 0) + 1;
        commit();
      }}>Another practice</button>
    </div>
  );
}

/** Guided breathing: the orb sits in a fixed-size stage in the middle, so the card never changes size. */
function Breathing() {
  const key = S.set.pr && PR[S.set.pr] ? S.set.pr : "cyc", pr = PR[key];
  const orb = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const [txt, setTxt] = useState("");
  const [left, setLeft] = useState(pr.dur);
  useEffect(() => {
    if (!run) {
      if (orb.current) orb.current.style.transform = "scale(.62)";
      setTxt("");
      setLeft(pr.dur);
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
      // Practices scale the orb between about .5 and 1; keep it inside the stage.
      if (orb.current) orb.current.style.transform = `scale(${Math.min(1, Math.max(.5, sc))})`;
      setTxt(ph);
      setLeft(Math.ceil(pr.dur - t));
    }, 80);
    return () => clearInterval(iv);
  }, [run, key]);
  return (
    <div className="card brw">
      <b>Breathing &amp; meditation</b>
      <span className="selw">
        <select aria-label="Practice" value={key} onChange={e => {
          S.set.pr = e.target.value;
          setRun(false);
          commit();
        }}>
          {Object.entries(PR).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}
        </select>
        <Ico k="down" s={18} />
      </span>
      <div className="brs">
        <div className="brc" ref={orb} />
        <span className="brt" role="timer">{fmt(left)}</span>
      </div>
      <p className="brp" aria-live="polite">{run ? txt : pr.d}</p>
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

/** First-run card; once a period is logged, the period tracker keeps the cycle up to date. */
function Setup() {
  const c = S.cyc;
  const [start, setStart] = useState(c?.start || "");
  const [len, setLen] = useState(String(c?.len || DEF_LEN));
  return (
    <div className="card">
      <b>Set up your cycle</b>
      <div className="row" style={{ marginTop: 8 }}>
        <div><span className="mu">Period started</span><input type="date" aria-label="Period started" value={start} onChange={e => setStart(e.target.value)} /></div>
        <div><span className="mu">Cycle length</span><input type="number" aria-label="Cycle length in days" value={len} onChange={e => setLen(e.target.value)} /></div>
      </div>
      <button style={{ width: "100%", marginTop: 10 }} onClick={() => setCycle(start, +len || DEF_LEN)}>Save</button>
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
          <span className="hm">{dmy(d)} {x.m ? <MoodIcon i={x.m - 1} s={18} /> : null}</span>
          <span className="mu" style={{ textAlign: "right" }}>{x.sy.join(", ")}</span>
        </div>
      ))}
    </div>
  );
}
