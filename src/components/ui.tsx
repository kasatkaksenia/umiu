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

// "umiu" set in Gluten 400 (SIL Open Font License), turned into shapes; each letter rides a gentle wave
// (scratch script: opentype.js + a sine warp). No font file is loaded at runtime.
const LOGO_D = "M23 74.7L23 74.7Q16.1 73.9 11.5 71.2Q6.9 68.6 4.2 64.3Q1.6 59.9 0.8 54.1Q0 48.3 0.8 41.2L0.8 41.2Q1 39.5 1.3 37.8Q1.6 36.1 2 34.5Q2.4 32.9 2.9 31.6L2.9 31.6Q4.1 28.4 5.9 27.1Q7.7 25.9 10 26.1L10 26.1Q12.1 26.3 13.1 27.4Q14.1 28.4 14.4 29.8Q14.6 31.2 14.5 32.5L14.5 32.5L13.9 37.3Q13.8 38.6 13.7 39.9Q13.6 41.2 13.5 42.2L13.5 42.2Q13.1 48.4 13.8 53.2Q14.5 57.9 17.1 60.8Q19.7 63.8 24.6 64.3L24.6 64.3Q29.6 64.8 32.9 63.1Q36.1 61.4 38.2 57.6Q40.3 53.8 41.7 48.4L41.7 48.4Q42.1 47 42.4 45.5Q42.8 44 43 42.5Q43.3 41 43.7 39.5Q44 37.9 44.4 36.4L44.4 36.4Q45.2 33.3 46.8 31.8Q48.3 30.2 50.9 30.5L50.9 30.5Q53.2 30.7 54.2 32.3Q55.1 34 55.2 36.7L55.2 36.7Q55.2 38.5 55.1 40.3Q54.9 42 54.7 43.8Q54.5 45.5 54.2 47.3Q54 49 53.6 50.7L53.6 50.7Q52 59.4 48.2 65.1Q44.3 70.8 38.1 73.2Q31.8 75.6 23 74.7ZM66.2 74L66.2 74Q64.5 74.3 63.3 73.6Q62 72.9 61.2 71.2Q60.4 69.6 59.9 67.2L59.9 67.2Q59.5 65 59.2 62.4Q58.9 59.9 58.7 57.1Q58.5 54.4 58.4 51.7Q58.4 49 58.5 46.4Q58.7 43.8 59.1 41.5L59.1 41.5Q60.4 35.8 63.3 32.3Q66.2 28.8 71 28L71 28Q74.4 27.4 77 28.8Q79.6 30.3 81.6 33Q83.7 35.7 85.3 38.9L85.3 38.9Q86.5 41.1 87.8 42.8Q89.1 44.4 90.3 44.2L90.3 44.2Q91.7 44 92.8 41.9Q94 39.8 95 36.8L95 36.8Q96.5 32.5 98.2 29.3Q99.8 26.1 102.1 24.1Q104.4 22.1 107.9 21.4L107.9 21.4Q112.6 20.6 115.9 22.9Q119.3 25.2 121.4 29.6Q123.5 34.1 124.5 39.9L124.5 39.9Q124.9 42.1 125.3 44.5Q125.6 46.9 125.8 49.3Q126 51.7 126.1 53.9Q126.1 56.2 126.1 58.1L126.1 58.1Q125.7 60.9 124.7 62.2Q123.8 63.5 121.8 63.9L121.8 63.9Q120.1 64.2 118.8 63.4Q117.5 62.6 116.7 61.1L116.7 61.1Q116.5 60.1 116.2 58.8Q115.9 57.4 115.7 55.8Q115.4 54.1 115.2 52.2Q114.9 50.3 114.5 48.1Q114.2 45.9 113.7 43.4L113.7 43.4Q113.1 40.7 112.2 38.3Q111.3 36 109.9 34.7Q108.6 33.4 106.9 33.7L106.9 33.7Q105.3 34 104.1 35.7Q102.8 37.5 101.9 40.1Q100.9 42.8 100 45.8L100 45.8Q98.6 50.8 96.9 53.6Q95.2 56.4 91.9 56.9L91.9 56.9Q88.7 57.5 86.6 55.6Q84.5 53.6 82.7 50L82.7 50Q81.4 47.1 80.1 44.8Q78.8 42.6 77.5 41.3Q76.1 40.1 74.5 40.4L74.5 40.4Q72.8 40.7 71.8 42.5Q70.7 44.2 70.2 47.5L70.2 47.5Q69.7 51.1 69.6 54.7Q69.6 58.3 69.9 61.6Q70.2 64.9 70.6 67.6L70.6 67.6Q70.6 70.6 69.7 72.1Q68.7 73.5 66.2 74ZM145.7 62.4L145.7 62.4Q143.5 62.5 142.1 61.6Q140.8 60.7 140.2 58.8Q139.7 56.8 139.6 53.9L139.6 53.9Q139.6 52.2 139.7 49.9Q139.7 47.6 139.8 44.9Q139.9 42.2 140.1 39.4Q140.2 36.6 140.4 34.1Q140.6 31.5 140.8 29.4Q141 27.3 141.3 26.1L141.3 26.1Q142.2 23.1 144.1 21.5Q145.9 20 148.8 20L148.8 20Q151.5 19.9 152.8 22Q154.1 24 154.2 27.9L154.2 27.9Q154.2 29.4 154.1 31.8Q154.1 34.3 153.9 37.2Q153.8 40.2 153.6 43.3Q153.4 46.5 153.1 49.3Q152.9 52.2 152.6 54.4Q152.4 56.6 152 57.7L152 57.7Q151.1 60.3 149.5 61.3Q148 62.4 145.7 62.4ZM148.3 12.6L148.3 12.6Q143.8 12.6 142.1 11.1Q140.4 9.6 140.3 7.7L140.3 7.7Q140.3 5.2 142.1 3.5Q143.8 1.9 146.4 1Q149 0.1 151.6 0L151.6 0Q153.4 0 155 0.6Q156.6 1.2 157.6 2.5Q158.5 3.8 158.6 5.9L158.6 5.9Q158.6 8.2 157.2 9.6Q155.7 11.1 153.4 11.8Q151.1 12.5 148.3 12.6ZM193.4 68.3L193.4 68.3Q186.6 67.1 182.2 64.2Q177.7 61.2 175.4 56.7Q173.1 52.2 172.6 46.4Q172.2 40.5 173.4 33.5L173.4 33.5Q173.7 31.8 174.1 30.1Q174.6 28.4 175.1 26.8Q175.6 25.3 176.2 24.1L176.2 24.1Q177.6 21 179.5 19.8Q181.4 18.6 183.6 19L183.6 19Q185.8 19.4 186.7 20.5Q187.6 21.6 187.7 23Q187.8 24.4 187.7 25.7L187.7 25.7L186.8 30.5Q186.6 31.8 186.4 33.1Q186.2 34.3 186.1 35.4L186.1 35.4Q185.2 41.5 185.7 46.3Q186.1 51.1 188.4 54.2Q190.8 57.2 195.7 58.1L195.7 58.1Q200.6 59 204 57.5Q207.4 55.9 209.7 52.3Q212 48.7 213.8 43.4L213.8 43.4Q214.3 42 214.7 40.5Q215.1 39.1 215.5 37.6Q215.9 36.1 216.3 34.6Q216.8 33.1 217.2 31.5L217.2 31.5Q218.3 28.6 219.9 27.1Q221.6 25.6 224.2 26.1L224.2 26.1Q226.4 26.5 227.3 28.2Q228.1 29.9 228.1 32.6L228.1 32.6Q227.9 34.4 227.7 36.1Q227.4 37.9 227.1 39.6Q226.7 41.4 226.4 43Q226 44.7 225.5 46.4L225.5 46.4Q223.4 55 219.2 60.4Q215 65.8 208.5 67.9Q202.1 69.9 193.4 68.3Z";
const LOGO_VB = "-3 -3 238.1 85.6";
/** Wavy "umiu" logo with an offset colour layer behind it (70s ribbon style). */
export function Logo({ height = 32 }: { height?: number }) {
  return (
    <svg className="logo" role="img" aria-label="umiu" viewBox={LOGO_VB} height={height} width={Math.round(height * 2.78)}>
      <path d={LOGO_D} transform="translate(4 4)" fill="var(--pk)" />
      <path d={LOGO_D} fill="currentColor" />
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
