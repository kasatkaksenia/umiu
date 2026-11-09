import { useState } from "react";
import { ai } from "../../lib/ai";
import { Suggestion, eaten, localName, readBarcode, searchFoods, todayLog } from "../../lib/food";
import { S, commit, openSheet } from "../../lib/store";
import { TODAY } from "../../lib/util";
import { FileButton, Ico } from "../../components/ui";

type Macros = { k: number; p: number; c: number; f: number };

const r0 = (v: number) => Math.round(v || 0);

export function FoodLog() {
  const t = todayLog();
  return (
    <div className="cols c-main">
      <div className="col main">
        <Summary />
        <AddFood />
      </div>
      <div className="col side">
        <div className="card">
          <b className="card-t">Today</b>
          {t.length ? t.map(x => (
            <div className="li" key={S.f.indexOf(x)}>
              <span>{x.n}</span>
              <span className="mu">{x.k} kcal · P{x.p} C{x.c || 0} F{x.f || 0}</span>
              <button className="g s" aria-label={`Remove ${x.n}`} onClick={() => {
                S.f.splice(S.f.indexOf(x), 1);
                commit();
              }}>✕</button>
            </div>
          )) : <span className="mu">Nothing logged today.</span>}
        </div>
      </div>
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
        {([["Protein", "p", "var(--pk)"], ["Carbs", "c", "var(--cr)"], ["Fat", "f", "var(--ol)"]] as const).map(([l, k, c]) => (
          <div className="mi" key={k}>
            <div className="mh"><span>{l}</span><span><b>{eaten(k)}</b> / {G[k]} g</span></div>
            <div className="bar"><i style={{ width: `${Math.min(100, (eaten(k) / (G[k] || 1)) * 100)}%`, background: c }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const EMPTY = { k: "", p: "", c: "", f: "" };

function AddFood() {
  const [name, setName] = useState("");
  const [sugs, setSugs] = useState<Suggestion[]>([]);
  const [picked, setPicked] = useState<Suggestion | null>(null);
  const [grams, setGrams] = useState("100");
  const [mac, setMac] = useState<Record<keyof Macros, string>>(EMPTY);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const fill = (o: Partial<Macros>) => setMac({ k: String(r0(o.k!)), p: String(r0(o.p!)), c: String(r0(o.c!)), f: String(r0(o.f!)) });
  const byGrams = (s: Suggestion, g: number) => fill({ k: (s.k * g) / 100, p: (s.p * g) / 100, c: (s.c * g) / 100, f: (s.f * g) / 100 });
  const reset = () => {
    setName("");
    setSugs([]);
    setPicked(null);
    setGrams("100");
    setMac(EMPTY);
    setCode("");
  };

  const pick = (s: Suggestion) => {
    setSugs([]);
    setName(s.n);
    if (s.saved) {
      setPicked(null);
      fill(s);
      return;
    }
    setPicked(s);
    setGrams("100");
    byGrams(s, 100);
  };

  const add = () => {
    const o = { n: name.trim(), k: r0(+mac.k), p: r0(+mac.p), c: r0(+mac.c), f: r0(+mac.f) };
    if (!o.n) {
      setStatus("Type a food name first.");
      return;
    }
    const b = code.trim();
    if (b) S.foods[b] = { ...o };
    S.f.push({ d: TODAY(), ...o });
    commit();
    reset();
    setStatus("");
  };

  const scan = async (file: File) => {
    setStatus("Reading barcode…");
    const c = await readBarcode(file);
    if (!c) {
      setStatus("Couldn’t read a barcode. Retake the photo closer and well lit, or type the number below.");
      return;
    }
    setCode(c);
    const f = S.foods[c];
    if (f) {
      setName(f.n);
      fill(f);
      setStatus("Barcode " + c + " found in your saved foods.");
    } else setStatus("New barcode " + c + ". Enter name and macros once and I’ll remember it.");
  };

  const askAI = async () => {
    if (!ai) return;
    const q = name.trim();
    setSugs([]);
    setStatus("Asking AI…");
    try {
      const r = await ai.json('Typical nutrition per 100 g for "' + q + '". Reply ONLY JSON {"n":"name","k":kcal,"p":protein g,"c":carbs g,"f":fat g} (numbers).');
      const s: Suggestion = { n: r.n || q, k: +r.k || 0, p: +r.p || 0, c: +r.c || 0, f: +r.f || 0, h: "" };
      setName(s.n);
      setPicked(s);
      setGrams("100");
      byGrams(s, 100);
      setStatus("Estimate per 100 g – adjust the amount.");
    } catch (e: any) {
      setStatus("Couldn’t get an estimate (" + (e?.code || "error") + ").");
    }
  };


  return (
    <div className="card">
      {/* Meal from a photo gets its own full-width button so the row below keeps two equal buttons. */}
      <FileButton className="lab2 mpb" accept="image/*" capture onFiles={f => openSheet({ t: "mp", url: URL.createObjectURL(f[0]), file: f[0] })}><Ico k="cam" /> Meal from photo</FileButton>
      <div className="row">
        <FileButton className="lab2" accept="image/*" capture onFiles={f => scan(f[0])}>▮▮ Scan barcode</FileButton>
        <button className="lab2" onClick={() => openSheet({ t: "cm" })}>+ Add meal</button>
      </div>
      <p className="mu" role="status">{status}</p>

      <div style={{ position: "relative" }}>
        <input autoComplete="off" placeholder="Food – start typing" aria-label="Food name" value={name} onChange={e => {
          setName(e.target.value);
          setPicked(null);
          setSugs(searchFoods(e.target.value));
        }} />
        {(sugs.length > 0 || (ai && name.trim().length >= 2 && !picked)) && name.trim().length >= 2 && (
          <div className="sg">
            {sugs.map((x, i) => {
              const loc = localName(x, name.trim().toLowerCase());
              return (
                <button key={i} onClick={() => pick(x)}>
                  {x.n}
                  <span className="mu"> {loc ? loc + " · " : ""}{x.saved ? "your food" : "per 100 g"} · {Math.round(x.k)} kcal · P{Math.round(x.p)}</span>
                </button>
              );
            })}
            {ai && <button onClick={askAI}>Ask AI to estimate “{name.trim()}”</button>}
          </div>
        )}
      </div>
      {picked && (
        <div className="row" style={{ marginTop: 6 }}>
          <div>
            <span className="mu">Amount (g)</span>
            <input type="number" inputMode="decimal" value={grams} aria-label="Amount in grams" onChange={e => {
              setGrams(e.target.value);
              byGrams(picked, +e.target.value || 0);
            }} />
          </div>
        </div>
      )}
      <div className="row" style={{ marginTop: 6 }}>
        {([["k", "kcal"], ["p", "P g"], ["c", "C g"], ["f", "F g"]] as const).map(([k, l]) => (
          <input key={k} type="number" inputMode="decimal" placeholder={l} aria-label={l} value={mac[k]} onChange={e => setMac({ ...mac, [k]: e.target.value })} />
        ))}
      </div>
      <input placeholder="Barcode (optional – remembered for next time)" aria-label="Barcode" value={code} onChange={e => setCode(e.target.value)} style={{ marginTop: 6 }} />
      <button style={{ width: "100%", marginTop: 8 }} onClick={add}>Add</button>
    </div>
  );
}
