// Small building blocks shared by every screen.
import { ReactNode, useEffect, useRef, useState } from "react";
import { CI, WIC, hsh } from "../lib/icons";
import { MOODS } from "../lib/moods";
import { mb, av } from "../lib/art";
import { figSvg } from "../lib/figures";
import { EX } from "../data/exercises";
import { eqLbl, muscles } from "../lib/train";

/** Render trusted, generated SVG markup (figures, charts) inside an element. */
export function Svg({ html, className, style, as: Tag = "div" }: { html: string; className?: string; style?: React.CSSProperties; as?: any }) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Ico({ k, s = 18 }: { k: string; s?: number }) {
  return (
    <svg className="ci" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: CI[k] }} />
  );
}

/** Colourful widget icon (Cycle cards). */
export function Wico({ k }: { k: string }) {
  const [c, b] = WIC[k];
  return (
    <span className="wi" aria-hidden="true" style={{ ["--c" as any]: `var(${c})`, ["--a" as any]: "var(--cr)" }}>
      <svg viewBox="0 0 32 32" width={26} height={26} dangerouslySetInnerHTML={{ __html: b }} />
    </span>
  );
}

/** Brand mark (see BRAND in lib/icons.ts) in the current colour. */
export function BrandMark({ k, s = 28 }: { k: "wave" | "moon"; s?: number }) {
  const m = `var(--b-${k})`;
  return <span className="bmark" aria-hidden="true" style={{ width: s, height: s, WebkitMaskImage: m, maskImage: m }} />;
}

/** Mood emoji (fluffy character), i = 0 (awful) … 4 (great). */
export function MoodIcon({ i, s = 26 }: { i: number; s?: number }) {
  return <svg className="moji" width={s} height={s} viewBox="0 0 32 32" aria-hidden="true" dangerouslySetInnerHTML={{ __html: MOODS[i].svg }} />;
}

// "umiu" set in Shantell Sans 500 (SIL Open Font License), turned into shapes; each letter rides a gentle wave
// (scratch script: opentype.js + a sine warp). No font file is loaded at runtime.
const LOGO_D = "M21.6 86.8L21.6 86.8Q15.1 85.9 10.8 82.6Q6.4 79.3 4 74.5Q1.5 69.7 0.8 64.1Q0 58.4 0.7 53L0.7 53Q1.3 48.2 2.6 44.3Q3.9 40.4 5.9 36.8L5.9 36.8Q6.7 35.3 7.9 34.5Q9.1 33.8 11 34L11 34Q13.4 34.3 14.7 36.1Q16.1 37.9 15.8 40.5L15.8 40.5Q15.6 42.1 15 43.4Q14.5 44.7 13.9 46.2Q13.2 47.7 12.6 49.7Q12 51.7 11.6 54.7L11.6 54.7Q11 59.2 11.5 62.9Q11.9 66.7 13.4 69.6Q14.9 72.5 17.3 74.2Q19.7 75.9 22.9 76.3L22.9 76.3Q26.7 76.9 29.8 74.3Q32.8 71.7 35 66.3Q37.1 61 38.1 53.3L38.1 53.3Q38.4 50.8 38.5 49Q38.6 47.1 38.6 45.7Q38.7 44.2 38.9 42.6L38.9 42.6Q39.2 40.3 40.3 39.1Q41.3 37.9 43.6 38.2L43.6 38.2Q45.9 38.5 47.3 40.1Q48.7 41.6 49.1 44.9Q49.6 48.1 48.9 53.5L48.9 53.5Q47.2 65.7 43.4 73.4Q39.6 81 34 84.3Q28.4 87.7 21.6 86.8ZM66.8 87.9L66.8 87.9Q64.2 88.4 62.5 86.6Q60.7 84.8 59.4 81.7Q58.2 78.5 57.5 74.9L57.5 74.9Q56.8 71.6 56.3 68.3Q55.9 65 55.5 61.6Q55 58.2 54.4 55.2L54.4 55.2Q53.9 52.6 53.1 50.5Q52.2 48.4 51.8 46.3L51.8 46.3Q51.5 44.8 52.4 43.4Q53.3 42 55.3 41.7L55.3 41.7Q57.6 41.2 59.2 42.3Q60.8 43.4 62 45.7L62 45.7Q62.4 46.7 62.8 47.6L62.8 47.6Q63.2 45.4 63.7 43.5L63.7 43.5Q64.9 39.5 67.1 37.1Q69.3 34.8 72.3 34.2L72.3 34.2Q76 33.4 78.8 35.6Q81.7 37.8 84.3 42.3Q86.8 46.8 89.1 53.1L89.1 53.1Q91.3 58.8 92.7 62L92.7 62Q93.3 53.7 94.8 47.1L94.8 47.1Q96.7 38.4 99.9 33.2Q103 28 107 27.2L107 27.2Q113.6 25.9 117.8 31.2Q122 36.5 125.7 48.4L125.7 48.4Q127.5 54.7 129.2 58.1Q130.9 61.6 132.1 63.4Q133.3 65.3 134.1 66.5Q135 67.7 135.3 69.4L135.3 69.4Q135.7 71.6 134.5 73.1Q133.3 74.5 130.9 75Q128.6 75.5 126.3 73.9Q124 72.2 121.8 68.1Q119.6 63.9 117.3 57L117.3 57Q115.4 51.4 114.1 47.9Q112.8 44.4 111.8 42.4Q110.8 40.4 109.8 39.2L109.8 39.2Q109.3 38.6 108.8 38L108.8 38Q106.4 42.1 105 46.8L105 46.8Q103.2 52.6 102.4 59.9Q101.7 67.1 101 75.9L101 75.9Q100.9 78.5 99.7 80Q98.5 81.5 96.5 81.9L96.5 81.9Q93.8 82.5 91.4 80.7Q89.1 78.9 87.1 75Q85 71.1 83 65.4L83 65.4Q81.3 60.7 80 57.2Q78.6 53.6 77.3 51Q76 48.4 74.6 46.5L74.6 46.5Q74.1 45.9 73.6 45.3L73.6 45.3Q71.9 48.2 70.9 51.7L70.9 51.7Q69.8 56 69.5 61Q69.1 66 69.4 71.2Q69.7 76.5 70.4 81.8L70.4 81.8Q70.7 84.6 69.7 86Q68.8 87.5 66.8 87.9ZM156.9 74.5L156.9 74.5Q154.7 74.4 153.4 73.4Q152.1 72.4 151.5 70.5Q150.9 68.7 150.9 66.2L150.9 66.2Q151 58.8 151.1 53.6Q151.1 48.5 151.1 44.7Q151.1 40.9 151.1 37.6Q151.1 34.3 151.1 30.6L151.1 30.6Q151.2 28.4 151.9 26.6Q152.6 24.9 154.1 23.9Q155.6 22.9 157.9 23L157.9 23Q160.6 23 162.1 24.8Q163.7 26.5 163.8 30.1L163.8 30.1Q163.7 32.2 163.6 36.1Q163.5 40 163.3 44.7Q163.1 49.3 162.9 54.1Q162.6 58.8 162.5 62.7Q162.3 66.6 162.3 69L162.3 69Q162.3 71.3 160.9 72.9Q159.6 74.5 156.9 74.5ZM158.7 15.1L158.7 15.1Q154.6 15 151.9 12.6Q149.2 10.2 149.3 6.9L149.3 6.9Q149.3 3.7 151.6 1.9Q153.8 0 157.2 0L157.2 0Q160 0.1 162 1.4Q163.9 2.7 165 4.8Q166 6.8 166 8.8L166 8.8Q165.9 11.1 164.2 13.1Q162.6 15.1 158.7 15.1ZM204.1 80.4L204.1 80.4Q197.7 79.1 193.6 75.5Q189.5 72 187.3 67Q185.2 62.1 184.8 56.4Q184.4 50.7 185.5 45.3L185.5 45.3Q186.4 40.6 188 36.8Q189.5 32.9 191.7 29.5L191.7 29.5Q192.6 28 193.9 27.4Q195.1 26.7 197 27.1L197 27.1Q199.3 27.5 200.6 29.4Q201.8 31.3 201.3 33.9L201.3 33.9Q201 35.4 200.4 36.7Q199.8 37.9 199.1 39.4Q198.3 40.9 197.6 42.8Q196.8 44.8 196.2 47.7L196.2 47.7Q195.4 52.1 195.6 56Q195.8 59.8 197.1 62.7Q198.4 65.7 200.6 67.6Q202.9 69.4 206.1 70.1L206.1 70.1Q209.9 70.8 213.1 68.5Q216.3 66.1 218.8 60.9Q221.3 55.7 222.8 48.1L222.8 48.1Q223.3 45.6 223.5 43.8Q223.7 42 223.8 40.5Q224 39.1 224.3 37.5L224.3 37.5Q224.7 35.1 225.9 34Q227 32.9 229.3 33.4L229.3 33.4Q231.5 33.8 232.8 35.5Q234.1 37.1 234.4 40.4Q234.6 43.6 233.5 49L233.5 49Q231.1 61.1 226.8 68.4Q222.5 75.8 216.7 78.8Q210.9 81.7 204.1 80.4Z";
const LOGO_VB = "-3 -3 240.6 94.4";
/** Wavy "umiu" logo, plain black in every look (light text in dark mode so it stays visible). */
export function Logo({ height = 32 }: { height?: number }) {
  return (
    <svg className="logo" role="img" aria-label="umiu" viewBox={LOGO_VB} height={height} width={Math.round(height * 2.55)}>
      <path d={LOGO_D} fill="var(--logo)" />
    </svg>
  );
}

/** Scattered organic shapes over a picture. */
export function Deco({ seed, n, top }: { seed: string; n: number; top?: boolean }) {
  const R = mb(hsh(seed));
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const k = Math.floor(R() * 5) + 1;
    const s = top ? 30 + R() * 18 : 30 + R() * 44, x = top ? 50 + R() * 14 : 46 + R() * 46, y = top ? 4 + R() * 14 : 4 + R() * 56, r = (R() - 0.5) * 80;
    out.push(
      <span key={i} className="dc" aria-hidden="true" style={{
        left: `${x.toFixed(0)}%`, top: `${y.toFixed(0)}%`, width: `${s.toFixed(0)}px`, height: `${s.toFixed(0)}px`,
        transform: `rotate(${r.toFixed(0)}deg)`, WebkitMaskImage: `var(--m${k})`, maskImage: `var(--m${k})`,
      }} />,
    );
  }
  return <>{out}</>;
}

/** Paint generated art after the first frame so the screen appears immediately. */
export function useArt(make: () => string, key: string) {
  const [bg, setBg] = useState<string | undefined>();
  useEffect(() => {
    let on = true;
    const t = setTimeout(() => on && setBg(make()), 0);
    return () => {
      on = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return bg;
}

/** Banner. `icon` (1–6, a --m shape) shows one fixed icon on the right instead of the two scattered shapes. */
/** Banner. icon: a decoration mask number (--m1…) or a brand mark name (--b-wave, --b-moon). */
export function Hero({ kind, seed, a, b, tag, icon }: { kind: string; seed: number; a: string; b: string; tag: string; icon?: number | string }) {
  const bg = useArt(() => av(kind, 640, 280, seed), kind + seed);
  const m = typeof icon == "string" ? `var(--b-${icon})` : `var(--m${icon})`;
  return (
    <div className="hero" style={bg ? { backgroundImage: bg } : undefined}>
      <span className="tag">[{tag}]</span>
      {icon ? (
        <span className="dc hico" aria-hidden="true" style={{ WebkitMaskImage: m, maskImage: m }} />
      ) : <Deco seed={kind + seed} n={2} />}
      <h1>{a}<br /><span>{b}</span></h1>
    </div>
  );
}

export function Tabs<K extends string>({ items, cur, on }: { items: [K, string][]; cur: K; on: (k: K) => void }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={cur == k} className={cur == k ? "on" : ""} onClick={() => on(k)}>{l}</button>
      ))}
    </div>
  );
}

export function Chip({ on, onClick, children, label }: { on?: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return (
    <button className={"chip" + (on ? " on" : "")} aria-pressed={!!on} aria-label={label} onClick={onClick}>{children}</button>
  );
}

/** One exercise in a pick list: figure, name, muscles, equipment, optional badge. */
export function ExOption({ k, onPick, badge, on, off }: { k: string; onPick: () => void; badge?: string; on?: boolean; off?: boolean }) {
  return (
    <button className={"opt ox" + (on ? " on" : "")} aria-pressed={on} disabled={off} onClick={onPick}>
      <Svg as="span" className="oth" html={figSvg(k, 1)} />
      <span className="otx"><b>{EX[k][0]}</b><span className="mu">{muscles(EX[k][1])}{eqLbl(k)}</span></span>
      {badge && <span className="pill mt">{badge}</span>}
    </button>
  );
}
export { exMatches } from "../lib/train";

/** Looping exercise demo. Tap to pause. Respects reduced-motion. */
export function FigAnim({ id }: { id: string }) {
  const el = useRef<HTMLDivElement>(null);
  const playing = useRef(true);
  useEffect(() => {
    let raf = 0, t0 = performance.now();
    playing.current = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el.current) el.current.innerHTML = figSvg(id, 0);
    const loop = (n: number) => {
      if (playing.current && el.current) {
        const t = ((n - t0) / 3200) % 1, u = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);
        el.current.innerHTML = figSvg(id, u);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    (el.current as any).toggle = () => {
      playing.current = !playing.current;
      if (playing.current) t0 = performance.now();
    };
    return () => cancelAnimationFrame(raf);
  }, [id]);
  return <div className="anim" ref={el} role="button" aria-label="Pause or play the demo" tabIndex={0} onClick={() => (el.current as any)?.toggle?.()} />;
}

/** Hidden file input wrapped in a label styled as a button. */
export function FileButton({ accept, multiple, capture, onFiles, className = "lab", style, children }: {
  accept: string; multiple?: boolean; capture?: boolean; onFiles: (f: FileList) => void; className?: string; style?: React.CSSProperties; children: ReactNode;
}) {
  return (
    <label className={className} style={style}>
      {children}
      <input type="file" accept={accept} multiple={multiple} hidden {...(capture ? { capture: "environment" } : {})}
        onChange={e => {
          if (e.target.files && e.target.files.length) onFiles(e.target.files);
          e.target.value = "";
        }} />
    </label>
  );
}

/** Number input that keeps what the user is typing and reports numbers on change. */
export function NumField({ label, value, onChange, step, min, max, inputMode = "decimal" }: {
  label: string; value: number | ""; onChange: (v: number) => void; step?: string; min?: number; max?: number; inputMode?: "decimal" | "numeric";
}) {
  const [txt, setTxt] = useState(value === 0 || value === "" ? "" : String(value));
  useEffect(() => {
    if (+txt !== value) setTxt(value === 0 || value === "" ? "" : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div>
      <span className="mu">{label}</span>
      <input type="number" step={step || "any"} min={min} max={max} inputMode={inputMode} value={txt} aria-label={label}
        onChange={e => setTxt(min != null && min >= 0 ? e.target.value.replace(/-/g, "") : e.target.value)}
        onBlur={() => onChange(+txt)} onKeyDown={e => (e.key == "Enter" ? onChange(+txt) : e.key == "-" && min != null && min >= 0 && e.preventDefault())} />
    </div>
  );
}
